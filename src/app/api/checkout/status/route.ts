import { z } from "zod";

import {
  foundationCheckoutStatusResponseSchema,
  type CheckoutStatusResponse,
} from "@/lib/erp-order";
import {
  foundationFailureHttpStatus,
  requestFoundation,
} from "@/lib/server/foundation-client";
import {
  failureResponseHeaders,
  inspectPublicRequest,
  requestResponseHeaders,
} from "@/lib/server/request";

export const runtime = "nodejs";

const statusQuerySchema = z.object({
  provider: z.enum(["stripe", "paypal"]),
  sessionId: z.string().trim().min(5).max(200),
  orderRef: z.string().trim().min(5).max(200).optional(),
});

const respond = (
  body: CheckoutStatusResponse,
  status: number,
  requestId: string,
): Response =>
  Response.json(body, {
    status,
    headers: requestResponseHeaders(requestId),
  });

export async function GET(request: Request): Promise<Response> {
  const inspected = inspectPublicRequest(request, {
    scope: "checkout-status",
    limit: 120,
    windowMs: 10 * 60 * 1_000,
    requireOrigin: false,
  });

  if (!inspected.ok) {
    return Response.json(
      {
        status: "unavailable",
        provider: "stripe",
        providerSessionId: "invalid",
        safeSummary: "Statut de paiement indisponible.",
        safeError: inspected.safeError,
      } satisfies CheckoutStatusResponse,
      {
        status: inspected.status,
        headers: failureResponseHeaders(inspected),
      },
    );
  }

  const url = new URL(request.url);
  const parsed = statusQuerySchema.safeParse({
    provider: url.searchParams.get("provider"),
    sessionId:
      url.searchParams.get("sessionId") ??
      url.searchParams.get("session_id"),
    orderRef: url.searchParams.get("orderRef") ?? undefined,
  });
  if (!parsed.success) {
    return respond(
      {
        status: "unavailable",
        provider:
          url.searchParams.get("provider") === "paypal" ? "paypal" : "stripe",
        providerSessionId:
          url.searchParams.get("sessionId") ??
          url.searchParams.get("session_id") ??
          "invalid",
        safeSummary: "Identifiant de paiement invalide.",
        safeError: parsed.error.issues.map((issue) => issue.message).join(" "),
      },
      400,
      inspected.requestId,
    );
  }

  const foundation = await requestFoundation({
    env: inspected.env,
    endpoint: "status",
    method: "GET",
    responseSchema: foundationCheckoutStatusResponseSchema,
    requestId: inspected.requestId,
    idempotencyKey: inspected.idempotencyKey,
    query: {
      provider: parsed.data.provider,
      sessionId: parsed.data.sessionId,
      orderRef: parsed.data.orderRef,
    },
  });

  if (!foundation.ok) {
    return respond(
      {
        status: "unavailable",
        provider: parsed.data.provider,
        providerSessionId: parsed.data.sessionId,
        orderRef: parsed.data.orderRef ?? null,
        safeSummary: "Statut de paiement non vérifié.",
        safeError:
          foundation.code === "not_configured"
            ? "La vérification automatique du statut n’est pas encore configurée."
            : foundation.safeError,
      },
      foundationFailureHttpStatus(foundation),
      inspected.requestId,
    );
  }

  const body = foundation.data;
  return respond(
    {
      status: body.status,
      provider: body.provider ?? parsed.data.provider,
      providerSessionId:
        body.providerSessionId ?? parsed.data.sessionId,
      orderRef: body.orderRef ?? parsed.data.orderRef ?? null,
      safeSummary:
        body.safeSummary ??
        (body.status === "paid"
          ? "Paiement confirmé par Fondation."
          : "Paiement en cours de vérification."),
      safeError: body.safeError ?? null,
      primaryDomain: body.primaryDomain ?? null,
    },
    body.status === "unavailable" ? 503 : 200,
    inspected.requestId,
  );
}
