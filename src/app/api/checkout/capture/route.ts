import { z } from "zod";

import {
  foundationCaptureResponseSchema,
  type CheckoutCaptureResponse,
} from "@/lib/erp-order";
import { getCheckoutConfigurationIssues } from "@/lib/server/env";
import {
  foundationFailureHttpStatus,
  requestFoundation,
} from "@/lib/server/foundation-client";
import {
  acquireCaptureReplay,
  completeCaptureReplay,
  releaseCaptureReplay,
} from "@/lib/server/idempotency";
import { logServerEvent } from "@/lib/server/logging";
import {
  failureResponseHeaders,
  readPublicJsonRequest,
  requestResponseHeaders,
} from "@/lib/server/request";

export const runtime = "nodejs";

const captureSchema = z
  .object({
    provider: z.literal("paypal"),
    providerOrderId: z.string().trim().min(5).max(160),
  })
  .strict();

const respond = (
  body: CheckoutCaptureResponse,
  status: number,
  requestId: string,
  idempotencyKey?: string,
  extraHeaders?: HeadersInit,
): Response =>
  Response.json(body, {
    status,
    headers: requestResponseHeaders(
      requestId,
      idempotencyKey,
      extraHeaders,
    ),
  });

export async function POST(request: Request): Promise<Response> {
  const input = await readPublicJsonRequest(request, {
    scope: "checkout-capture",
    limit: 20,
    windowMs: 10 * 60 * 1_000,
    maxBytes: 8_192,
    requireOrigin: true,
    honeypotFields: ["websiteConfirmation"],
  });

  if (!input.ok) {
    return Response.json(
      {
        status: "failed",
        safeSummary: "Capture PayPal invalide.",
        safeError: input.safeError,
      } satisfies CheckoutCaptureResponse,
      {
        status: input.status,
        headers: failureResponseHeaders(input),
      },
    );
  }

  if (input.isHoneypot) {
    return respond(
      {
        status: "failed",
        safeSummary: "Capture PayPal refusée.",
        safeError: "La demande n’a pas pu être traitée.",
      },
      422,
      input.requestId,
      input.idempotencyKey,
    );
  }

  const parsed = captureSchema.safeParse(input.payload);
  if (!parsed.success) {
    return respond(
      {
        status: "failed",
        safeSummary: "Capture PayPal invalide.",
        safeError: parsed.error.issues.map((issue) => issue.message).join(" "),
      },
      400,
      input.requestId,
      input.idempotencyKey,
    );
  }

  if (
    !input.env.enableCheckout ||
    getCheckoutConfigurationIssues(input.env).length > 0
  ) {
    return respond(
      {
        status: "failed",
        safeSummary: "Capture PayPal indisponible.",
        safeError:
          "Le checkout direct n’est pas activé avec une configuration sécurisée.",
      },
      503,
      input.requestId,
      input.idempotencyKey,
    );
  }

  // This process-local guard prevents common React retries/double clicks. The
  // durable authority remains Fondation/provider via the propagated key.
  const replay = acquireCaptureReplay(parsed.data.providerOrderId);
  if (!replay.acquired && replay.state === "completed") {
    return respond(
      replay.response,
      202,
      input.requestId,
      input.idempotencyKey,
      { "x-idempotent-replay": "true" },
    );
  }
  if (!replay.acquired) {
    return respond(
      {
        status: "failed",
        safeSummary: "Capture PayPal déjà en cours.",
        safeError: "Veuillez patienter avant de réessayer.",
      },
      409,
      input.requestId,
      input.idempotencyKey,
      { "retry-after": "2" },
    );
  }

  const foundation = await requestFoundation({
    env: input.env,
    endpoint: "capture",
    method: "POST",
    responseSchema: foundationCaptureResponseSchema,
    requestId: input.requestId,
    idempotencyKey: input.idempotencyKey,
    body: parsed.data,
  });

  if (!foundation.ok) {
    releaseCaptureReplay(replay.key);
    const body = foundation.data;
    logServerEvent("warn", "checkout_capture.failed", {
      requestId: input.requestId,
      reason: foundation.code,
      status: foundation.status,
    });
    return respond(
      {
        status: "failed",
        safeSummary:
          body?.paymentResult?.safeSummary ??
          body?.safeSummary ??
          "Capture PayPal indisponible.",
        safeError:
          body?.paymentResult?.safeError ??
          body?.safeError ??
          foundation.safeError,
        primaryDomain: body?.paymentResult?.primaryDomain ?? null,
      },
      foundationFailureHttpStatus(foundation),
      input.requestId,
      input.idempotencyKey,
    );
  }

  const body = foundation.data;
  if (body.status !== "captured") {
    releaseCaptureReplay(replay.key);
    return respond(
      {
        status: "failed",
        safeSummary:
          body.paymentResult?.safeSummary ??
          body.safeSummary ??
          "Capture PayPal refusée.",
        safeError:
          body.paymentResult?.safeError ??
          body.safeError ??
          "Le fournisseur n’a pas confirmé la capture.",
        primaryDomain: body.paymentResult?.primaryDomain ?? null,
      },
      422,
      input.requestId,
      input.idempotencyKey,
    );
  }

  const result: CheckoutCaptureResponse = {
    status: "captured",
    safeSummary:
      body.paymentResult?.safeSummary ??
      body.safeSummary ??
      "Paiement PayPal capturé; activation en traitement.",
    safeError:
      body.paymentResult?.safeError ?? body.safeError ?? null,
    primaryDomain: body.paymentResult?.primaryDomain ?? null,
  };
  completeCaptureReplay(replay.key, result);
  logServerEvent("info", "checkout_capture.captured", {
    requestId: input.requestId,
  });
  return respond(
    result,
    202,
    input.requestId,
    input.idempotencyKey,
  );
}
