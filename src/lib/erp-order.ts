import { z } from "zod";

import { pricingPlanCodes } from "./pricing";

export const erpOrderPlans = pricingPlanCodes;
export const erpRequestTypes = ["software_purchase"] as const;
export const paymentProviders = ["stripe", "paypal"] as const;

const optionalTrimmedString = (maxLength: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }, z.string().max(maxLength).optional());

export const erpOrderSchema = z.object({
  requestType: z.enum(erpRequestTypes).default("software_purchase"),
  paymentProvider: z.enum(paymentProviders).default("stripe"),
  companyName: z.string().trim().min(2, "Le nom de l'entreprise est requis.").max(200),
  contactName: z.string().trim().min(2, "Le nom du contact est requis.").max(160),
  email: z.string().trim().email("Courriel invalide.").max(254),
  phone: optionalTrimmedString(80),
  plan: z.enum(erpOrderPlans),
  estimatedUsers: z.coerce.number().int().min(1).max(5000),
  desiredSubdomain: optionalTrimmedString(80),
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
  status: "created" | "local_backup" | "failed";
  orderRef: string;
  provider: "stripe" | "paypal";
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
