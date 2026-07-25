import { z } from "zod";

import { pricingPlanCodes } from "./pricing";

export const erpOrderPlans = pricingPlanCodes;
export const erpRequestTypes = ["software_purchase"] as const;
export const paymentProviders = ["stripe", "paypal"] as const;
export const checkoutProviders = ["stripe", "paypal", "promo_code"] as const;
export const ficheroErpDomainSuffix = "erp.fichero.cloud";

const optionalTrimmedString = (maxLength: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }, z.string().max(maxLength).optional());

export const normalizeDesiredErpPrefix = (value: string): string => {
  let candidate = value
    .trim()
    .toLowerCase()
    .replace(/^https?:\/\//, "")
    .replace(/\/.*$/g, "")
    .replace(/\.$/g, "");

  const desiredSuffix = `.${ficheroErpDomainSuffix}`;
  if (candidate.endsWith(desiredSuffix)) {
    candidate = candidate.slice(0, -desiredSuffix.length);
  } else if (candidate.startsWith("erp.") && candidate.endsWith(".fichero.cloud")) {
    candidate = candidate.slice("erp.".length, -".fichero.cloud".length);
  }

  return candidate
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-")
    .slice(0, 44)
    .replace(/-+$/g, "");
};

const optionalDesiredErpPrefix = z.preprocess(
  (value) => {
    if (typeof value !== "string") {
      return value;
    }

    const normalized = normalizeDesiredErpPrefix(value);
    return normalized.length > 0 ? normalized : undefined;
  },
  z
    .string()
    .min(2, "Le préfixe ERP doit contenir au moins 2 caractères.")
    .max(44, "Le préfixe ERP doit contenir 44 caractères ou moins.")
    .regex(
      /^[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/,
      "Le préfixe ERP doit utiliser lettres, chiffres et tirets.",
    )
    .optional(),
);

export const normalizePromoCode = (value: string): string =>
  value.trim().toUpperCase().replace(/\s+/g, "");

const optionalPromoCode = z.preprocess((value) => {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = normalizePromoCode(value);
  return normalized.length > 0 ? normalized : undefined;
}, z.string().min(4, "Le code promo doit contenir au moins 4 caractères.").max(80).optional());

export const erpOrderSchema = z.object({
  requestType: z.enum(erpRequestTypes).default("software_purchase"),
  paymentProvider: z.enum(paymentProviders).default("stripe"),
  companyName: z.string().trim().min(2, "Le nom de l'entreprise est requis.").max(200),
  contactName: z.string().trim().min(2, "Le nom du contact est requis.").max(160),
  email: z.string().trim().email("Courriel invalide.").max(254),
  phone: optionalTrimmedString(80),
  businessAddressLine1: optionalTrimmedString(180),
  businessAddressLine2: optionalTrimmedString(180),
  businessCity: optionalTrimmedString(120),
  businessProvince: optionalTrimmedString(80),
  businessPostalCode: optionalTrimmedString(24),
  businessCountry: optionalTrimmedString(80),
  gstNumber: optionalTrimmedString(40),
  qstNumber: optionalTrimmedString(40),
  businessRegistrationNumber: optionalTrimmedString(80),
  website: optionalTrimmedString(200),
  industry: optionalTrimmedString(120),
  companySize: optionalTrimmedString(80),
  plan: z.enum(erpOrderPlans),
  estimatedUsers: z.coerce.number().int().min(1).max(5000),
  desiredSubdomain: optionalDesiredErpPrefix,
  promoCode: optionalPromoCode,
  message: optionalTrimmedString(4000),
  acceptsContact: z.boolean().refine((value) => value, "L'autorisation de contact est requise."),
});

export type ErpOrderInput = z.infer<typeof erpOrderSchema>;

export type ErpOrderResponse = {
  status: "accepted" | "local_backup" | "failed";
  orderRef: string;
  safeSummary: string;
  safeError: string | null;
  customerId?: string | null;
  tenantId?: string | null;
  provisioningRequestId?: string | null;
  tenantSlug?: string | null;
  primaryDomain?: string | null;
};

export type CheckoutResponse = {
  status: "created" | "promo_activated" | "local_backup" | "failed";
  orderRef: string;
  provider: (typeof checkoutProviders)[number];
  checkoutUrl: string | null;
  providerSessionId?: string | null;
  safeSummary: string;
  safeError: string | null;
  customerId?: string | null;
  tenantId?: string | null;
  provisioningRequestId?: string | null;
  tenantSlug?: string | null;
  primaryDomain?: string | null;
  amountCents?: number;
  monthlyPriceCents?: number;
  currency?: string;
};

export type CheckoutCaptureResponse = {
  status: "captured" | "failed";
  safeSummary: string;
  safeError: string | null;
  primaryDomain?: string | null;
};

export const formatOrderIssues = (error: z.ZodError): string =>
  error.issues.map((issue) => issue.message).join(" ");

export const isErpOrderResponse = (value: unknown): value is ErpOrderResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ErpOrderResponse>;
  return typeof candidate.status === "string" && typeof candidate.orderRef === "string";
};

export const isCheckoutResponse = (value: unknown): value is CheckoutResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CheckoutResponse>;
  return typeof candidate.status === "string" && typeof candidate.orderRef === "string";
};

export const isCheckoutCaptureResponse = (value: unknown): value is CheckoutCaptureResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<CheckoutCaptureResponse>;
  return typeof candidate.status === "string" && typeof candidate.safeSummary === "string";
};
