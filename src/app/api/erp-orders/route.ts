import {
  erpOrderSchema,
  formatOrderIssues,
  foundationOrderResponseSchema,
  type ErpOrderResponse,
} from "@/lib/erp-order";
import { requestFoundation } from "@/lib/server/foundation-client";
import { createStableReference } from "@/lib/server/idempotency";
import { appendJsonLine } from "@/lib/server/jsonl";
import { logServerEvent } from "@/lib/server/logging";
import {
  failureResponseHeaders,
  readPublicJsonRequest,
  requestResponseHeaders,
} from "@/lib/server/request";

export const runtime = "nodejs";

const orderSpoolOptions = {
  maxFileBytes: 25 * 1024 * 1024,
  rotationFiles: 10,
} as const;

const respond = (
  body: ErpOrderResponse,
  status: number,
  requestId: string,
  idempotencyKey?: string,
): Response =>
  Response.json(body, {
    status,
    headers: requestResponseHeaders(requestId, idempotencyKey),
  });

export async function POST(request: Request): Promise<Response> {
  const input = await readPublicJsonRequest(request, {
    scope: "erp-orders",
    limit: 10,
    windowMs: 10 * 60 * 1_000,
    maxBytes: 64_000,
    requireOrigin: true,
    honeypotFields: ["websiteConfirmation"],
  });

  if (!input.ok) {
    return Response.json(
      {
        status: "failed",
        orderRef: createStableReference("fic", input.requestId),
        safeSummary: "Commande ERP invalide.",
        safeError: input.safeError,
      } satisfies ErpOrderResponse,
      {
        status: input.status,
        headers: failureResponseHeaders(input),
      },
    );
  }

  const ref = createStableReference("fic", input.idempotencyKey);
  if (input.isHoneypot) {
    return respond(
      {
        status: "accepted",
        orderRef: ref,
        safeSummary: "Commande ERP reçue.",
        safeError: null,
      },
      202,
      input.requestId,
      input.idempotencyKey,
    );
  }

  const parsed = erpOrderSchema.safeParse(input.payload);
  if (!parsed.success) {
    return respond(
      {
        status: "failed",
        orderRef: ref,
        safeSummary: "Commande ERP invalide.",
        safeError: formatOrderIssues(parsed.error),
      },
      400,
      input.requestId,
      input.idempotencyKey,
    );
  }

  const orderPayload = {
    ...parsed.data,
    orderRef: ref,
    idempotencyKey: input.idempotencyKey,
    source: `vitrine:fichero.cloud:${parsed.data.requestType}`,
    receivedAt: new Date().toISOString(),
  };
  const foundation = await requestFoundation({
    env: input.env,
    endpoint: "order",
    method: "POST",
    responseSchema: foundationOrderResponseSchema,
    requestId: input.requestId,
    idempotencyKey: input.idempotencyKey,
    body: orderPayload,
  });

  if (
    foundation.ok &&
    (foundation.data.status === "accepted" ||
      foundation.data.status === "already_prepared")
  ) {
    logServerEvent("info", "erp_order.accepted", {
      requestId: input.requestId,
      orderRef: ref,
      delivery: "fondation",
    });
    return respond(
      {
        status: "accepted",
        orderRef: ref,
        safeSummary:
          foundation.data.safeSummary ??
          "Commande ERP transmise à l’équipe ProJD.",
        safeError: foundation.data.safeError ?? null,
        customerId: foundation.data.customerId ?? null,
        tenantId: foundation.data.tenantId ?? null,
        provisioningRequestId:
          foundation.data.provisioningRequestId ?? null,
        tenantSlug: foundation.data.tenantSlug ?? null,
        primaryDomain: foundation.data.primaryDomain ?? null,
      },
      202,
      input.requestId,
      input.idempotencyKey,
    );
  }

  const providerError = foundation.ok
    ? foundation.data.safeError ?? "Fondation a refusé la commande."
    : foundation.data?.safeError ?? foundation.safeError;
  const fallbackReason = foundation.ok
    ? foundation.data.status
    : foundation.code;

  try {
    await appendJsonLine(
      input.env.orderInboxPath,
      {
        ...orderPayload,
        delivery: "local_backup",
        fallbackReason,
      },
      orderSpoolOptions,
    );
  } catch (error) {
    logServerEvent("error", "erp_order.spool_failed", {
      requestId: input.requestId,
      orderRef: ref,
      error,
    });
    return respond(
      {
        status: "failed",
        orderRef: ref,
        safeSummary: "Commande ERP non enregistrée.",
        safeError: "La sauvegarde locale est indisponible.",
      },
      503,
      input.requestId,
      input.idempotencyKey,
    );
  }

  logServerEvent("warn", "erp_order.local_backup", {
    requestId: input.requestId,
    orderRef: ref,
    fallbackReason,
  });
  return respond(
    {
      status: "local_backup",
      orderRef: ref,
      safeSummary:
        "Achat ProJD sauvegardé localement; une révision par l’équipe est requise.",
      safeError: providerError,
    },
    202,
    input.requestId,
    input.idempotencyKey,
  );
}
