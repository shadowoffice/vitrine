import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

import {
  erpOrderSchema,
  formatOrderIssues,
  isErpOrderResponse,
  type ErpOrderResponse,
} from "@/lib/erp-order";

export const runtime = "nodejs";

type ProviderOrderResponse = {
  status?: string;
  safeSummary?: string;
  safeError?: string | null;
  customerId?: string | null;
  tenantId?: string | null;
  provisioningRequestId?: string | null;
  tenantSlug?: string | null;
  primaryDomain?: string | null;
};

const orderRef = (): string => {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  return `fic-${stamp}-${randomUUID().slice(0, 8)}`;
};

const readJson = async (request: Request): Promise<unknown> => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

const readProviderResponse = async (response: Response): Promise<ProviderOrderResponse> => {
  try {
    const payload: unknown = await response.json();
    if (payload && typeof payload === "object") {
      return payload as ProviderOrderResponse;
    }
  } catch {
    return {};
  }

  return {};
};

const storeLocalOrder = async (payload: unknown): Promise<void> => {
  const inboxPath = process.env.VITRINE_ORDER_INBOX_PATH || "/app/data/erp-orders.jsonl";
  await mkdir(dirname(inboxPath), { recursive: true });
  await appendFile(inboxPath, `${JSON.stringify(payload)}\n`, { mode: 0o600 });
};

const submitToProviderBridge = async (payload: unknown): Promise<ErpOrderResponse | null> => {
  const intakeUrl = process.env.FONDATION_ORDER_INTAKE_URL?.trim();
  const token = process.env.FONDATION_ORDER_INTAKE_TOKEN?.trim();
  if (!intakeUrl || !token) {
    return null;
  }

  const response = await fetch(intakeUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(payload),
  });
  const body = await readProviderResponse(response);
  if (!response.ok) {
    return {
      status: "failed",
      orderRef: typeof (payload as { orderRef?: unknown }).orderRef === "string" ? (payload as { orderRef: string }).orderRef : orderRef(),
      safeSummary: "Commande reçue, mais la préparation automatique a été refusée.",
      safeError: body.safeError ?? `Le service d'activation a répondu ${response.status}.`,
    };
  }

  return {
    status: "accepted",
    orderRef: typeof (payload as { orderRef?: unknown }).orderRef === "string" ? (payload as { orderRef: string }).orderRef : orderRef(),
    safeSummary: body.safeSummary ?? "Commande ERP transmise à l'équipe ProJD.",
    safeError: body.safeError ?? null,
    customerId: body.customerId ?? null,
    tenantId: body.tenantId ?? null,
    provisioningRequestId: body.provisioningRequestId ?? null,
    tenantSlug: body.tenantSlug ?? null,
    primaryDomain: body.primaryDomain ?? null,
  };
};

export async function POST(request: Request): Promise<Response> {
  const payload = await readJson(request);
  const parsed = erpOrderSchema.safeParse(payload);
  if (!parsed.success) {
    return Response.json(
      {
        status: "failed",
        orderRef: orderRef(),
        safeSummary: "Commande ERP invalide.",
        safeError: formatOrderIssues(parsed.error),
      } satisfies ErpOrderResponse,
      { status: 400 },
    );
  }

  const ref = orderRef();
  const orderPayload = {
    ...parsed.data,
    orderRef: ref,
    source: `vitrine:fichero.cloud:${parsed.data.requestType}`,
    receivedAt: new Date().toISOString(),
  };
  const localBackupSummary = "Achat ProJD reçu. Le dossier sera importé par l'équipe ProJD.";
  const reviewRequiredSummary = "Achat ProJD reçu en sauvegarde locale; révision requise.";

  try {
    const bridgeResult = await submitToProviderBridge(orderPayload);
    if (isErpOrderResponse(bridgeResult) && bridgeResult.status === "accepted") {
      return Response.json(bridgeResult, { status: 202 });
    }

    await storeLocalOrder({
      ...orderPayload,
      fallbackReason: bridgeResult?.safeError ?? "Activation intake not configured.",
    });

    return Response.json(
      {
        status: bridgeResult?.status === "failed" ? "failed" : "local_backup",
        orderRef: ref,
        safeSummary: bridgeResult?.status === "failed" ? reviewRequiredSummary : localBackupSummary,
        safeError: bridgeResult?.safeError ?? null,
      } satisfies ErpOrderResponse,
      { status: bridgeResult?.status === "failed" ? 202 : 202 },
    );
  } catch (error) {
    try {
      await storeLocalOrder({
        ...orderPayload,
        fallbackReason: error instanceof Error ? error.message : "Unknown intake failure.",
      });

      return Response.json(
        {
          status: "local_backup",
          orderRef: ref,
          safeSummary: localBackupSummary,
          safeError: null,
        } satisfies ErpOrderResponse,
        { status: 202 },
      );
    } catch {
      return Response.json(
        {
          status: "failed",
          orderRef: ref,
          safeSummary: "Commande ERP non enregistrée.",
          safeError: "La sauvegarde locale est indisponible.",
        } satisfies ErpOrderResponse,
        { status: 500 },
      );
    }
  }
}
