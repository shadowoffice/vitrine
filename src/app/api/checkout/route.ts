import {
  erpOrderSchema,
  formatOrderIssues,
  foundationCheckoutResponseSchema,
  type CheckoutResponse,
} from "@/lib/erp-order";
import { buildPricingCart } from "@/lib/pricing";
import { getCheckoutConfigurationIssues } from "@/lib/server/env";
import {
  foundationFailureHttpStatus,
  requestFoundation,
} from "@/lib/server/foundation-client";
import { createStableReference } from "@/lib/server/idempotency";
import { logServerEvent } from "@/lib/server/logging";
import { verifySignedQuote } from "@/lib/server/quote";
import {
  failureResponseHeaders,
  readPublicJsonRequest,
  requestResponseHeaders,
} from "@/lib/server/request";

export const runtime = "nodejs";

type PaymentProvider = "stripe" | "paypal";

const payloadPaymentProvider = (payload: unknown): PaymentProvider => {
  if (payload && typeof payload === "object") {
    const provider = (payload as { paymentProvider?: unknown }).paymentProvider;
    return provider === "paypal" ? "paypal" : "stripe";
  }
  return "stripe";
};

const respond = (
  body: CheckoutResponse,
  status: number,
  requestId: string,
  idempotencyKey?: string,
): Response =>
  Response.json(body, {
    status,
    headers: requestResponseHeaders(requestId, idempotencyKey),
  });

const isSecureCheckoutUrl = (value: string): boolean => {
  try {
    const parsed = new URL(value);
    return (
      parsed.protocol === "https:" &&
      !parsed.username &&
      !parsed.password &&
      !parsed.hash
    );
  } catch {
    return false;
  }
};

export async function POST(request: Request): Promise<Response> {
  const input = await readPublicJsonRequest(request, {
    scope: "checkout",
    limit: 15,
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
        provider: "stripe",
        checkoutUrl: null,
        safeSummary: "Panier invalide.",
        safeError: input.safeError,
      } satisfies CheckoutResponse,
      {
        status: input.status,
        headers: failureResponseHeaders(input),
      },
    );
  }

  let ref = createStableReference("fic", input.idempotencyKey);
  const fallbackProvider = payloadPaymentProvider(input.payload);
  if (!input.env.enableCheckout) {
    return respond(
      {
        status: "failed",
        orderRef: ref,
        provider: fallbackProvider,
        checkoutUrl: null,
        safeSummary: "Checkout direct désactivé.",
        safeError:
          "Le paiement en ligne n’est pas disponible. Demandez une proposition à l’équipe ProJD.",
      },
      503,
      input.requestId,
      input.idempotencyKey,
    );
  }

  const checkoutConfigurationIssues = getCheckoutConfigurationIssues(input.env);
  if (checkoutConfigurationIssues.length > 0) {
    logServerEvent("error", "checkout.configuration_blocked", {
      requestId: input.requestId,
      issues: checkoutConfigurationIssues,
    });
    return respond(
      {
        status: "failed",
        orderRef: ref,
        provider: fallbackProvider,
        checkoutUrl: null,
        safeSummary: "Checkout direct indisponible.",
        safeError:
          "La configuration sécurisée du paiement est incomplète.",
      },
      503,
      input.requestId,
      input.idempotencyKey,
    );
  }

  if (input.isHoneypot) {
    return respond(
      {
        status: "failed",
        orderRef: ref,
        provider: fallbackProvider,
        checkoutUrl: null,
        safeSummary: "Paiement non créé.",
        safeError: "La demande n’a pas pu être traitée.",
      },
      422,
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
        provider: fallbackProvider,
        checkoutUrl: null,
        safeSummary: "Panier invalide.",
        safeError: formatOrderIssues(parsed.error),
      },
      400,
      input.requestId,
      input.idempotencyKey,
    );
  }

  const cart = buildPricingCart(parsed.data.plan, parsed.data.estimatedUsers);
  const quoteToken = parsed.data.quoteToken;
  if (input.env.requireSignedQuote && !input.env.quoteSigningSecret) {
    return respond(
      {
        status: "failed",
        orderRef: ref,
        provider: parsed.data.paymentProvider,
        checkoutUrl: null,
        safeSummary: "Validation du devis indisponible.",
        safeError:
          "La signature des devis est requise, mais le service n’est pas configuré.",
      },
      503,
      input.requestId,
      input.idempotencyKey,
    );
  }
  if (input.env.requireSignedQuote && !quoteToken) {
    return respond(
      {
        status: "failed",
        orderRef: ref,
        provider: parsed.data.paymentProvider,
        checkoutUrl: null,
        safeSummary: "Devis signé requis.",
        safeError:
          "Obtenez un devis approuvé avant de démarrer le paiement.",
      },
      403,
      input.requestId,
      input.idempotencyKey,
    );
  }

  let verifiedQuoteId: string | undefined;
  if (quoteToken) {
    if (!input.env.quoteSigningSecret) {
      return respond(
        {
          status: "failed",
          orderRef: ref,
          provider: parsed.data.paymentProvider,
          checkoutUrl: null,
          safeSummary: "Validation du devis indisponible.",
          safeError: "Le service de signature des devis n’est pas configuré.",
        },
        503,
        input.requestId,
        input.idempotencyKey,
      );
    }

    const verifiedQuote = verifySignedQuote({
      token: quoteToken,
      secret: input.env.quoteSigningSecret,
      plan: parsed.data.plan,
      seatCount: cart.seatCount,
      email: parsed.data.email,
    });
    if (!verifiedQuote.valid) {
      return respond(
        {
          status: "failed",
          orderRef: ref,
          provider: parsed.data.paymentProvider,
          checkoutUrl: null,
          safeSummary: "Devis signé refusé.",
          safeError: verifiedQuote.safeError,
        },
        verifiedQuote.code === "expired"
          ? 410
          : verifiedQuote.code === "mismatch"
            ? 422
            : 403,
        input.requestId,
        input.idempotencyKey,
      );
    }

    ref = verifiedQuote.payload.orderRef;
    verifiedQuoteId = verifiedQuote.payload.quoteId;
  }

  const baseUrl = input.env.siteUrl.toString().replace(/\/+$/gu, "");
  const checkoutPayload = {
    provider: parsed.data.paymentProvider,
    companyName: parsed.data.companyName,
    contactName: parsed.data.contactName,
    email: parsed.data.email,
    phone: parsed.data.phone,
    businessAddressLine1: parsed.data.businessAddressLine1,
    businessAddressLine2: parsed.data.businessAddressLine2,
    businessCity: parsed.data.businessCity,
    businessProvince: parsed.data.businessProvince,
    businessPostalCode: parsed.data.businessPostalCode,
    businessCountry: parsed.data.businessCountry,
    gstNumber: parsed.data.gstNumber,
    qstNumber: parsed.data.qstNumber,
    businessRegistrationNumber: parsed.data.businessRegistrationNumber,
    website: parsed.data.website,
    industry: parsed.data.industry,
    companySize: parsed.data.companySize,
    plan: parsed.data.plan,
    seatCount: cart.seatCount,
    desiredSubdomain: parsed.data.desiredSubdomain,
    promoCode: parsed.data.promoCode,
    message: parsed.data.message,
    source: parsed.data.promoCode
      ? "vitrine:fichero.cloud:checkout:promo_code"
      : `vitrine:fichero.cloud:checkout:${parsed.data.paymentProvider}`,
    orderRef: ref,
    idempotencyKey: input.idempotencyKey,
    quoteId: verifiedQuoteId,
    quoteVerified: Boolean(verifiedQuoteId),
    successUrl:
      parsed.data.paymentProvider === "stripe"
        ? `${baseUrl}/paiement/retour?provider=stripe&session_id={CHECKOUT_SESSION_ID}`
        : `${baseUrl}/paiement/retour?provider=paypal`,
    cancelUrl: `${baseUrl}/commander/achat?plan=${parsed.data.plan}&payment=cancelled`,
  };

  const foundation = await requestFoundation({
    env: input.env,
    endpoint: "checkout",
    method: "POST",
    responseSchema: foundationCheckoutResponseSchema,
    requestId: input.requestId,
    idempotencyKey: input.idempotencyKey,
    body: checkoutPayload,
  });

  if (!foundation.ok) {
    const body = foundation.data;
    logServerEvent("warn", "checkout.failed", {
      requestId: input.requestId,
      orderRef: ref,
      reason: foundation.code,
      status: foundation.status,
    });
    return respond(
      {
        status: "failed",
        orderRef: body?.orderRef ?? ref,
        provider: body?.provider ?? parsed.data.paymentProvider,
        checkoutUrl: null,
        providerSessionId: body?.providerSessionId ?? null,
        safeSummary: body?.safeSummary ?? "Paiement indisponible.",
        safeError: body?.safeError ?? foundation.safeError,
        customerId: body?.customerId ?? null,
        tenantId: body?.tenantId ?? null,
        provisioningRequestId: body?.provisioningRequestId ?? null,
        tenantSlug: body?.tenantSlug ?? null,
        primaryDomain: body?.primaryDomain ?? null,
        amountCents: body?.amountCents,
        monthlyPriceCents: body?.monthlyPriceCents,
        currency: body?.currency,
      },
      foundationFailureHttpStatus(foundation),
      input.requestId,
      input.idempotencyKey,
    );
  }

  const body = foundation.data;
  if (
    body.status === "promo_activated" &&
    body.provider === "promo_code"
  ) {
    return respond(
      {
        status: "promo_activated",
        orderRef: body.orderRef ?? ref,
        provider: "promo_code",
        checkoutUrl: null,
        providerSessionId: body.providerSessionId ?? null,
        safeSummary: body.safeSummary ?? "Commande activée par code promo.",
        safeError: body.safeError ?? null,
        customerId: body.customerId ?? null,
        tenantId: body.tenantId ?? null,
        provisioningRequestId: body.provisioningRequestId ?? null,
        tenantSlug: body.tenantSlug ?? null,
        primaryDomain: body.primaryDomain ?? null,
        amountCents: body.amountCents,
        monthlyPriceCents: body.monthlyPriceCents,
        currency: body.currency,
      },
      202,
      input.requestId,
      input.idempotencyKey,
    );
  }

  if (
    body.status !== "created" ||
    (body.provider !== "stripe" && body.provider !== "paypal") ||
    !body.checkoutUrl ||
    !isSecureCheckoutUrl(body.checkoutUrl)
  ) {
    return respond(
      {
        status: "failed",
        orderRef: body.orderRef ?? ref,
        provider:
          body.provider === "paypal" ? "paypal" : parsed.data.paymentProvider,
        checkoutUrl: null,
        providerSessionId: body.providerSessionId ?? null,
        safeSummary: body.safeSummary ?? "Checkout non créé.",
        safeError:
          body.safeError ??
          "Fondation a retourné une session de paiement invalide.",
      },
      502,
      input.requestId,
      input.idempotencyKey,
    );
  }

  logServerEvent("info", "checkout.created", {
    requestId: input.requestId,
    orderRef: body.orderRef ?? ref,
    provider: body.provider,
  });
  return respond(
    {
      status: "created",
      orderRef: body.orderRef ?? ref,
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
    },
    201,
    input.requestId,
    input.idempotencyKey,
  );
}
