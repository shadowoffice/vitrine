import { describe, expect, it } from "vitest";

import {
  buildPricingCart,
  formatMoney,
  getPricingPlan,
  pricingPlans,
} from "@/lib/pricing";

const normalizeWhitespace = (value: string): string =>
  value.replace(/\s/gu, " ");

describe("pricing", () => {
  it("uses Croissance as the safe fallback for an unknown plan", () => {
    expect(getPricingPlan("inconnu").code).toBe("croissance");
    expect(getPricingPlan(undefined).code).toBe("croissance");
  });

  it("keeps every public plan code unique", () => {
    const codes = pricingPlans.map((plan) => plan.code);

    expect(new Set(codes).size).toBe(codes.length);
  });

  it("calculates included and extra seats from the canonical plan", () => {
    const cart = buildPricingCart("croissance", 12);

    expect(cart).toMatchObject({
      currency: "CAD",
      extraSeats: 2,
      extraSeatSubtotalCents: 7_800,
      monthlySubtotalCents: 62_700,
      seatCount: 12,
      setupFeeCents: 150_000,
      dueTodayCents: 212_700,
    });
  });

  it("truncates and bounds seat counts before calculating totals", () => {
    expect(buildPricingCart("starter", 0).seatCount).toBe(1);
    expect(buildPricingCart("starter", 8.9).seatCount).toBe(8);
    expect(buildPricingCart("plateforme", 9_000).seatCount).toBe(5_000);
  });

  it("formats whole and fractional Canadian-dollar amounts in fr-CA", () => {
    expect(normalizeWhitespace(formatMoney(24_900))).toBe("249 $");
    expect(normalizeWhitespace(formatMoney(24_950))).toBe("249,50 $");
  });
});
