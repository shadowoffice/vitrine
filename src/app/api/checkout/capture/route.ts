import { z } from "zod";

import {
  isCheckoutCaptureResponse,
  type CheckoutCaptureResponse,
} from "@/lib/erp-order";

export const runtime = "nodejs";

const captureSchema = z.object({
  provider: z.literal("paypal"),
  providerOrderId: z.string().trim().min(5).max(160),
});

type ProviderCaptureResponse = {
  status?: string;
  safeSummary?: string;
  safeError?: string | null;
  paymentResult?: {
    safeSummary?: string;
    safeError?: string | null;
    primaryDomain?: string | null;
  } | null;
};

const captureUrl = (): string | null => {
  const explicit = process.env.FONDATION_CHECKOUT_CAPTURE_URL?.trim();
  if (explicit) {
    return explicit;
  }

  const orderUrl = process.env.FONDATION_ORDER_INTAKE_URL?.trim();
  return orderUrl?.replace(/\/erp-orders\/?$/, "/checkout-sessions/capture") ?? null;
};

const readJson = async (request: Request): Promise<unknown> => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

const readProviderResponse = async (response: Response): Promise<ProviderCaptureResponse> => {
  try {
    const payload: unknown = await response.json();
    return payload && typeof payload === "object" ? payload as ProviderCaptureResponse : {};
  } catch {
    return {};
  }
};

export async function POST(request: Request): Promise<Response> {
  const parsed = captureSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return Response.json(
      {
        status: "failed",
        safeSummary: "Capture PayPal invalide.",
        safeError: parsed.error.issues.map((issue) => issue.message).join(" "),
      } satisfies CheckoutCaptureResponse,
      { status: 400 },
    );
  }

  const intakeUrl = captureUrl();
  const token = process.env.FONDATION_ORDER_INTAKE_TOKEN?.trim();
  if (!intakeUrl || !token) {
    return Response.json(
      {
        status: "failed",
        safeSummary: "Capture PayPal indisponible.",
        safeError: "La capture PayPal n'est pas configurée.",
      } satisfies CheckoutCaptureResponse,
      { status: 503 },
    );
  }

  const response = await fetch(intakeUrl, {
    method: "POST",
    headers: {
      authorization: `Bearer ${token}`,
      "content-type": "application/json",
    },
    body: JSON.stringify(parsed.data),
  });
  const body = await readProviderResponse(response);
  const result: CheckoutCaptureResponse = {
    status: response.ok && body.status === "captured" ? "captured" : "failed",
    safeSummary: body.paymentResult?.safeSummary ?? body.safeSummary ?? "Capture PayPal traitée.",
    safeError: body.paymentResult?.safeError ?? body.safeError ?? null,
    primaryDomain: body.paymentResult?.primaryDomain ?? null,
  };

  if (!isCheckoutCaptureResponse(result)) {
    return Response.json(
      {
        status: "failed",
        safeSummary: "Réponse capture invalide.",
        safeError: "Le service de paiement a retourné une réponse inattendue.",
      } satisfies CheckoutCaptureResponse,
      { status: 502 },
    );
  }

  return Response.json(result, { status: result.status === "captured" ? 202 : 422 });
}
