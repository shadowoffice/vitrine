import "server-only";

import { createHmac, timingSafeEqual } from "node:crypto";

import { z } from "zod";

import { pricingPlanCodes } from "@/lib/pricing";

const maxEncodedPayloadLength = 8_192;
const maximumFutureLifetimeSeconds = 366 * 24 * 60 * 60;

export const signedQuotePayloadSchema = z
  .object({
    v: z.literal(1),
    quoteId: z.string().trim().min(8).max(160),
    orderRef: z
      .string()
      .trim()
      .min(8)
      .max(80)
      .regex(/^[A-Za-z0-9][A-Za-z0-9._-]+$/u),
    plan: z.enum(pricingPlanCodes),
    seatCount: z.number().int().min(1).max(5_000),
    email: z.string().trim().email().max(254),
    exp: z.number().int().positive(),
  })
  .strict();

export type SignedQuotePayload = z.infer<typeof signedQuotePayloadSchema>;

export type QuoteVerificationResult =
  | {
      valid: true;
      payload: SignedQuotePayload;
    }
  | {
      valid: false;
      code:
        | "expired"
        | "invalid_claims"
        | "invalid_format"
        | "invalid_signature"
        | "mismatch";
      safeError: string;
    };

type VerifyQuoteOptions = {
  token: string;
  secret: string;
  plan: SignedQuotePayload["plan"];
  seatCount: number;
  email: string;
  now?: Date;
};

const safeEqual = (left: Buffer, right: Buffer): boolean =>
  left.length === right.length && timingSafeEqual(left, right);

/**
 * Token contract:
 * `v1.<base64url(JSON payload)>.<base64url(HMAC-SHA256("v1.<payload>"))>`.
 * The signed payload is versioned and binds quote/order, plan, seats, email and
 * expiry. Issuance belongs to the trusted sales/control-plane service.
 */
export const verifySignedQuote = (
  options: VerifyQuoteOptions,
): QuoteVerificationResult => {
  const parts = options.token.split(".");
  if (
    parts.length !== 3 ||
    parts[0] !== "v1" ||
    !parts[1] ||
    !parts[2] ||
    parts[1].length > maxEncodedPayloadLength
  ) {
    return {
      valid: false,
      code: "invalid_format",
      safeError: "Le devis signé est invalide.",
    };
  }

  const signedValue = `v1.${parts[1]}`;
  const expectedSignature = createHmac("sha256", options.secret)
    .update(signedValue)
    .digest();

  let presentedSignature: Buffer;
  let decodedPayload: string;
  try {
    presentedSignature = Buffer.from(parts[2], "base64url");
    decodedPayload = Buffer.from(parts[1], "base64url").toString("utf8");
  } catch {
    return {
      valid: false,
      code: "invalid_format",
      safeError: "Le devis signé est invalide.",
    };
  }

  if (!safeEqual(expectedSignature, presentedSignature)) {
    return {
      valid: false,
      code: "invalid_signature",
      safeError: "La signature du devis est invalide.",
    };
  }

  let rawPayload: unknown;
  try {
    rawPayload = JSON.parse(decodedPayload) as unknown;
  } catch {
    return {
      valid: false,
      code: "invalid_format",
      safeError: "Le devis signé est invalide.",
    };
  }

  const parsed = signedQuotePayloadSchema.safeParse(rawPayload);
  if (!parsed.success) {
    return {
      valid: false,
      code: "invalid_claims",
      safeError: "Les renseignements du devis signé sont invalides.",
    };
  }

  const nowSeconds = Math.floor((options.now ?? new Date()).getTime() / 1_000);
  if (
    parsed.data.exp <= nowSeconds ||
    parsed.data.exp > nowSeconds + maximumFutureLifetimeSeconds
  ) {
    return {
      valid: false,
      code: "expired",
      safeError: "Le devis signé est expiré ou sa durée est invalide.",
    };
  }

  if (
    parsed.data.plan !== options.plan ||
    parsed.data.seatCount !== options.seatCount ||
    parsed.data.email.toLowerCase() !== options.email.trim().toLowerCase()
  ) {
    return {
      valid: false,
      code: "mismatch",
      safeError: "Le devis signé ne correspond pas à cette commande.",
    };
  }

  return {
    valid: true,
    payload: parsed.data,
  };
};
