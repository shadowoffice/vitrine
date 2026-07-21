import { randomUUID } from "node:crypto";

import {
  erpOrderSchema,
  formatOrderIssues,
  isCheckoutResponse,
  type CheckoutResponse,
} from "@/lib/erp-order";
import { buildPricingCart } from "@/lib/pricing";
import { siteUrl } from "@/lib/site-content";

export const runtime = "nodejs";

type FondationCheckoutResponse = {
  status?: string;
  safeSummary?: string;
  safeError?: string | null;
  provider?: "stripe" | "paypal";
  checkoutUrl?: string | null;
  providerSessionId?: string | null;
  orderRef?: string | null;
  customerId?: string | null;
  tenantId?: string | null;
  provisioningRequestId?: string | null;
  tenantSlug?: string | null;
  primaryDomain?: string | null;
  amountCents?: number;
  monthlyPriceCents?: number;
  currency?: string;
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

const checkoutUrl = (): string | null => {
  const explicit = process.env.FONDATION_CHECKOUT_URL?.trim();
  if (explicit) {
    return explicit;
  }

  const orderUrl = process.env.FONDATION_ORDER_INTAKE_URL?.trim();
  return orderUrl?.replace(/\/erp-orders\/?$/, "/checkout-sessions") ?? null;
};

const publicSiteUrl = (): string =>
  (process.env.NEXT_PUBLIC_SITE_URL?.trim() || siteUrl).replace(/\/+$/g, "");

const readFondationResponse = async (response: Response): Promise<FondationCheckoutResponse> => {
  try {
    const payload: unknown = await response.json();
    return payload && typeof payload === "object" ? payload as FondationCheckoutResponse : {};
  } catch {
    return {};
  }
};

const submitCheckout = async (payload: unknown): Promise<CheckoutResponse | null> => {
  const intakeUrl = checkoutUrl();
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
  const body = await readFondationResponse(response);
  const fallbackRef = typeof (payload as { orderRef?: unknown }).orderRef === "string"
    ? (payload as { orderRef: string }).orderRef
    : orderRef();

  if (!response.ok || body.status !== "created" || !body.checkoutUrl || !body.provider) {
    return {
      status: "failed",
      orderRef: body.orderRef ?? fallbackRef,
      provider: (payload as { provider?: "stripe" | "paypal" }).provider ?? "stripe",
      checkoutUrl: null,
      providerSessionId: body.providerSessionId ?? null,
      safeSummary: body.safeSummary ?? "Checkout non créé.",
      safeError: body.safeError ?? `Fondation a répondu ${response.status}.`,
      customerId: body.customerId ?? null,
      tenantId: body.tenantId ?? null,
      provisioningRequestId: body.provisioningRequestId ?? null,
      tenantSlug: body.tenantSlug ?? null,
      primaryDomain: body.primaryDomain ?? null,
      amountCents: body.amountCents,
      monthlyPriceCents: body.monthlyPriceCents,
      currency: body.currency,
    };
  }

  return {
    status: "created",
    orderRef: body.orderRef ?? fallbackRef,
    provider: body.provider,
    checkoutUrl: body.checkoutUrl,
    providerSessionId: body.providerSessionId ?? null,
    safeSummary: body.safeSummary ?? "Checkout créé.",
    safeError: body.safeError ?? null,
    customerId: body.customerId ?? null,
    tenantId: body.tenantId ?? null,
    provisioningRequestId: body.provisioningRequestId ?? null,
    tenantSlug: body.tenantSlug ?? null,
    primaryDomain: body.primaryDomain ?? null,
    amountCents: body.amountCents,
    monthlyPriceCents: body.monthlyPriceCents,
    currency: body.currency,
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
        provider: "stripe",
        checkoutUrl: null,
        safeSummary: "Panier invalide.",
        safeError: formatOrderIssues(parsed.error),
      } satisfies CheckoutResponse,
      { status: 400 },
    );
  }

  const ref = orderRef();
  const cart = buildPricingCart(parsed.data.plan, parsed.data.estimatedUsers);
  const baseUrl = publicSiteUrl();
  const checkoutPayload = {
    provider: parsed.data.paymentProvider,
    companyName: parsed.data.companyName,
    contactName: parsed.data.contactName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    plan: parsed.data.plan,
    seatCount: cart.seatCount,
    desiredSubdomain: parsed.data.desiredSubdomain,
    message: parsed.data.message,
    source: `vitrine:fichero.cloud:checkout:${parsed.data.paymentProvider}`,
    orderRef: ref,
    successUrl:
      parsed.data.paymentProvider === "stripe"
        ? `${baseUrl}/paiement/retour?provider=stripe&session_id={CHECKOUT_SESSION_ID}`
        : `${baseUrl}/paiement/retour?provider=paypal`,
    cancelUrl: `${baseUrl}/commander?plan=${parsed.data.plan}&payment=cancelled`,
  };

  const result = await submitCheckout(checkoutPayload);
  if (!isCheckoutResponse(result)) {
    return Response.json(
      {
        status: "failed",
        orderRef: ref,
        provider: parsed.data.paymentProvider,
        checkoutUrl: null,
        safeSummary: "Paiement indisponible.",
        safeError: "Fondation checkout n'est pas configuré.",
      } satisfies CheckoutResponse,
      { status: 503 },
    );
  }

  return Response.json(result, { status: result.status === "created" ? 201 : 422 });
}
