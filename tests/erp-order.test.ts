import { describe, expect, it } from "vitest";

import {
  erpOrderSchema,
  isCheckoutCaptureResponse,
  isCheckoutResponse,
  isErpOrderResponse,
  normalizeDesiredErpPrefix,
  normalizePromoCode,
} from "@/lib/erp-order";

const validOrder = {
  acceptsContact: true,
  companyName: "Construction Boréale",
  contactName: "Marie Tremblay",
  email: "marie@example.test",
  estimatedUsers: "12",
  paymentProvider: "stripe",
  plan: "croissance",
  requestType: "software_purchase",
} as const;

describe("ERP order normalization", () => {
  it.each([
    [" https://Équipe-Nord.erp.fichero.cloud/projets ", "equipe-nord"],
    ["erp.acme.fichero.cloud", "acme"],
    ["  Les Chantiers & Fils  ", "les-chantiers-fils"],
    ["---A---B---", "a-b"],
  ])("normalizes %s to %s", (input, expected) => {
    expect(normalizeDesiredErpPrefix(input)).toBe(expected);
  });

  it("bounds subdomain prefixes to 44 characters without a trailing dash", () => {
    const normalized = normalizeDesiredErpPrefix(
      `${"entreprise-".repeat(8)}fin-`,
    );

    expect(normalized.length).toBeLessThanOrEqual(44);
    expect(normalized).not.toMatch(/-$/u);
  });

  it("normalizes promotional codes", () => {
    expect(normalizePromoCode("  pro jd 2026 ")).toBe("PROJD2026");
  });
});

describe("ERP order schema", () => {
  it("coerces users, trims fields and removes blank optional values", () => {
    const parsed = erpOrderSchema.parse({
      ...validOrder,
      desiredSubdomain: " Équipe Nord ",
      phone: "   ",
      promoCode: " pro jd ",
    });

    expect(parsed).toMatchObject({
      desiredSubdomain: "equipe-nord",
      estimatedUsers: 12,
      promoCode: "PROJD",
    });
    expect(parsed.phone).toBeUndefined();
  });

  it("accepts a bounded signed quote token", () => {
    const quoteToken = `v1.${"a".repeat(120)}.${"b".repeat(43)}`;
    const parsed = erpOrderSchema.parse({
      ...validOrder,
      quoteToken: `  ${quoteToken}  `,
    });

    expect(parsed.quoteToken).toBe(quoteToken);
    expect(
      erpOrderSchema.safeParse({
        ...validOrder,
        quoteToken: "x".repeat(8_193),
      }).success,
    ).toBe(false);
  });

  it.each([
    [{ ...validOrder, acceptsContact: false }],
    [{ ...validOrder, email: "pas-un-courriel" }],
    [{ ...validOrder, estimatedUsers: 5_001 }],
    [{ ...validOrder, plan: "entreprise" }],
  ])("rejects an invalid order", (payload) => {
    expect(erpOrderSchema.safeParse(payload).success).toBe(false);
  });
});

describe("provider response guards", () => {
  it("accepts complete ERP order responses only", () => {
    expect(
      isErpOrderResponse({
        orderRef: "fic-123",
        safeError: null,
        safeSummary: "Reçue.",
        status: "accepted",
      }),
    ).toBe(true);
    expect(isErpOrderResponse({ status: "accepted" })).toBe(false);
  });

  it("accepts complete checkout responses only", () => {
    expect(
      isCheckoutResponse({
        checkoutUrl: "https://payments.example.test/session",
        orderRef: "fic-123",
        provider: "stripe",
        safeError: null,
        safeSummary: "Créé.",
        status: "created",
      }),
    ).toBe(true);
    expect(
      isCheckoutResponse({
        checkoutUrl: null,
        orderRef: "fic-123",
        provider: "inconnu",
        safeError: null,
        safeSummary: "Créé.",
        status: "created",
      }),
    ).toBe(false);
  });

  it("accepts complete PayPal capture responses only", () => {
    expect(
      isCheckoutCaptureResponse({
        safeError: null,
        safeSummary: "Capturé.",
        status: "captured",
      }),
    ).toBe(true);
    expect(isCheckoutCaptureResponse(null)).toBe(false);
  });
});
