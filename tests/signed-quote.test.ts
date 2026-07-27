import { createHmac } from "node:crypto";

import { describe, expect, it } from "vitest";

import {
  verifySignedQuote,
  type SignedQuotePayload,
} from "@/lib/server/quote";

const secret = "test-secret-with-at-least-thirty-two-characters";
const now = new Date("2026-07-26T16:00:00.000Z");

const basePayload: SignedQuotePayload = {
  email: "acheteur@example.test",
  exp: Math.floor(now.getTime() / 1_000) + 60 * 60,
  orderRef: "fic-order-0001",
  plan: "croissance",
  quoteId: "quote-0001",
  seatCount: 12,
  v: 1,
};

const signQuote = (
  payload: SignedQuotePayload,
  signingSecret = secret,
): string => {
  const encodedPayload = Buffer.from(JSON.stringify(payload)).toString(
    "base64url",
  );
  const signedValue = `v1.${encodedPayload}`;
  const signature = createHmac("sha256", signingSecret)
    .update(signedValue)
    .digest("base64url");

  return `${signedValue}.${signature}`;
};

const verify = (
  token: string,
  overrides: Partial<{
    email: string;
    plan: SignedQuotePayload["plan"];
    seatCount: number;
  }> = {},
) =>
  verifySignedQuote({
    email: overrides.email ?? basePayload.email,
    now,
    plan: overrides.plan ?? basePayload.plan,
    seatCount: overrides.seatCount ?? basePayload.seatCount,
    secret,
    token,
  });

describe("signed quote verification", () => {
  it("accepts a valid token bound to its checkout claims", () => {
    const result = verify(signQuote(basePayload));

    expect(result).toEqual({
      payload: basePayload,
      valid: true,
    });
  });

  it("rejects an expired token", () => {
    const result = verify(
      signQuote({
        ...basePayload,
        exp: Math.floor(now.getTime() / 1_000) - 1,
      }),
    );

    expect(result).toMatchObject({
      code: "expired",
      valid: false,
    });
  });

  it("rejects an altered token", () => {
    const validToken = signQuote(basePayload);
    const parts = validToken.split(".");
    const alteredPayload = Buffer.from(
      JSON.stringify({
        ...basePayload,
        seatCount: 99,
      }),
    ).toString("base64url");
    const alteredToken = `${parts[0]}.${alteredPayload}.${parts[2]}`;

    expect(verify(alteredToken)).toMatchObject({
      code: "invalid_signature",
      valid: false,
    });
  });

  it.each([
    ["plan", { plan: "starter" as const }],
    ["seat count", { seatCount: 13 }],
    ["email", { email: "autre@example.test" }],
  ])("rejects a valid token used with a different %s", (_label, overrides) => {
    expect(verify(signQuote(basePayload), overrides)).toMatchObject({
      code: "mismatch",
      valid: false,
    });
  });
});
