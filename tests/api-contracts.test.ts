import { mkdtemp, readdir, rm } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";

import { afterEach, describe, expect, it, vi } from "vitest";

import { POST as postAnalytics } from "@/app/api/analytics/route";
import { POST as captureCheckout } from "@/app/api/checkout/capture/route";
import { POST as createCheckout } from "@/app/api/checkout/route";
import { POST as createOrder } from "@/app/api/erp-orders/route";
import { POST as createProposal } from "@/app/api/proposals/route";
import { GET as getHealth } from "@/app/healthz/route";
import { GET as getReadiness } from "@/app/readyz/route";

const jsonRequest = (
  path: string,
  body: unknown,
  headers: Record<string, string> = {},
): Request =>
  new Request(`https://fichero.cloud${path}`, {
    body: JSON.stringify(body),
    headers: {
      "content-type": "application/json",
      "idempotency-key": "vitrine-test-0001",
      origin: "https://fichero.cloud",
      ...headers,
    },
    method: "POST",
  });

const validOrder = {
  acceptsContact: true,
  companyName: "Construction Boréale",
  contactName: "Marie Tremblay",
  email: "marie@example.test",
  estimatedUsers: 12,
  paymentProvider: "stripe",
  plan: "croissance",
  requestType: "software_purchase",
} as const;

const validProposal = {
  acceptsContact: true,
  companyName: "Construction Boréale",
  contactName: "Marie Tremblay",
  currentTools: ["Excel"],
  email: "marie@example.test",
  priority: "projects",
  teamSize: "6-15",
} as const;

const checkoutSecret =
  "checkout-test-secret-with-at-least-thirty-two-characters";

const enableCheckoutConfiguration = (): void => {
  vi.stubEnv("VITRINE_ENABLE_CHECKOUT", "true");
  vi.stubEnv("VITRINE_REQUIRE_SIGNED_QUOTE", "true");
  vi.stubEnv("VITRINE_QUOTE_SIGNING_SECRET", checkoutSecret);
  vi.stubEnv(
    "FONDATION_CHECKOUT_URL",
    "https://fondation.example.test/api/public/checkout-sessions",
  );
  vi.stubEnv("FONDATION_ORDER_INTAKE_URL", "");
  vi.stubEnv("FONDATION_ALLOWED_HOSTS", "fondation.example.test");
  vi.stubEnv(
    "FONDATION_ORDER_INTAKE_TOKEN",
    "fondation-test-token-0000000000000000",
  );
};

const enableProposalConfiguration = (): void => {
  vi.stubEnv("VITRINE_ENABLE_PROPOSALS", "true");
  vi.stubEnv("VITRINE_PRIVACY_OFFICER_NAME", "Responsable vie privée Test");
  vi.stubEnv(
    "VITRINE_PRIVACY_CONTACT_EMAIL",
    "confidentialite@example.test",
  );
  vi.stubEnv("VITRINE_PROPOSAL_RETENTION_DAYS", "365");
  vi.stubEnv(
    "FONDATION_PROPOSAL_INTAKE_URL",
    "https://fondation.example.test/api/public/proposals",
  );
  vi.stubEnv("FONDATION_ORDER_INTAKE_URL", "");
  vi.stubEnv("FONDATION_ALLOWED_HOSTS", "fondation.example.test");
  vi.stubEnv(
    "FONDATION_ORDER_INTAKE_TOKEN",
    "fondation-test-token-0000000000000000",
  );
};

afterEach(() => {
  vi.restoreAllMocks();
  vi.unstubAllEnvs();
});

describe("public API contracts", () => {
  it("returns a machine-readable health response", async () => {
    const response = getHealth();

    expect(response.status).toBe(200);
    await expect(response.json()).resolves.toMatchObject({
      service: "vitrine",
      status: "ok",
    });
  });

  it.each([
    ["ERP order", createOrder, "/api/erp-orders"],
    ["checkout", createCheckout, "/api/checkout"],
  ] as const)("rejects an invalid %s payload", async (_label, handler, path) => {
    if (path === "/api/checkout") {
      enableCheckoutConfiguration();
    }
    const response = await handler(jsonRequest(path, {}));
    const body: unknown = await response.json();

    expect(response.status).toBe(400);
    expect(body).toEqual(
      expect.objectContaining({
        safeError: expect.any(String),
        status: "failed",
      }),
    );
  });

  it("keeps checkout disabled by default without calling Fondation", async () => {
    vi.stubEnv("VITRINE_ENABLE_CHECKOUT", "");
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const response = await createCheckout(
      jsonRequest("/api/checkout", validOrder),
    );

    expect(response.status).toBe(503);
    expect(fetchSpy).not.toHaveBeenCalled();
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        checkoutUrl: null,
        status: "failed",
      }),
    );
  });

  it("fails checkout safely when Fondation is not configured", async () => {
    vi.stubEnv("VITRINE_ENABLE_CHECKOUT", "true");
    vi.stubEnv("VITRINE_REQUIRE_SIGNED_QUOTE", "true");
    vi.stubEnv("VITRINE_QUOTE_SIGNING_SECRET", checkoutSecret);
    vi.stubEnv("FONDATION_CHECKOUT_URL", "");
    vi.stubEnv("FONDATION_ORDER_INTAKE_URL", "");
    vi.stubEnv("FONDATION_ORDER_INTAKE_TOKEN", "");

    const response = await createCheckout(
      jsonRequest("/api/checkout", validOrder),
    );
    const body: unknown = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual(
      expect.objectContaining({
        checkoutUrl: null,
        safeError: expect.any(String),
        status: "failed",
      }),
    );
  });

  it("fails checkout safely when signed quotes are required without a secret", async () => {
    enableCheckoutConfiguration();
    vi.stubEnv("FONDATION_ORDER_INTAKE_URL", "");
    vi.stubEnv("VITRINE_QUOTE_SIGNING_SECRET", "");

    const response = await createCheckout(
      jsonRequest("/api/checkout", validOrder),
    );
    const body: unknown = await response.json();

    expect(response.status).toBe(503);
    expect(body).toEqual(
      expect.objectContaining({
        checkoutUrl: null,
        safeError: expect.any(String),
        status: "failed",
      }),
    );
  });

  it("refuses to enable checkout without mandatory signed quotes", async () => {
    enableCheckoutConfiguration();
    vi.stubEnv("VITRINE_REQUIRE_SIGNED_QUOTE", "false");
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const response = await createCheckout(
      jsonRequest("/api/checkout", validOrder),
    );

    expect(response.status).toBe(503);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("requires a quote token before an enabled checkout can call Fondation", async () => {
    enableCheckoutConfiguration();
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const response = await createCheckout(
      jsonRequest("/api/checkout", validOrder),
    );

    expect(response.status).toBe(403);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("marks readiness failed when checkout is enabled insecurely", async () => {
    const spoolDirectory = await mkdtemp(
      join(tmpdir(), "vitrine-ready-checkout-"),
    );
    try {
      vi.stubEnv("VITRINE_ENABLE_CHECKOUT", "true");
      vi.stubEnv("VITRINE_REQUIRE_SIGNED_QUOTE", "false");
      vi.stubEnv("VITRINE_QUOTE_SIGNING_SECRET", "");
      vi.stubEnv("FONDATION_CHECKOUT_URL", "");
      vi.stubEnv("FONDATION_ORDER_INTAKE_URL", "");
      vi.stubEnv("FONDATION_ORDER_INTAKE_TOKEN", "");
      vi.stubEnv("VITRINE_ORDER_INBOX_PATH", join(spoolDirectory, "orders.jsonl"));
      vi.stubEnv(
        "VITRINE_PROPOSAL_INBOX_PATH",
        join(spoolDirectory, "proposals.jsonl"),
      );
      vi.stubEnv(
        "VITRINE_ANALYTICS_INBOX_PATH",
        join(spoolDirectory, "analytics.jsonl"),
      );

      const response = await getReadiness();
      const body: unknown = await response.json();

      expect(response.status).toBe(503);
      expect(body).toEqual(
        expect.objectContaining({
          issues: expect.arrayContaining([
            "checkout_signed_quote_required",
            "checkout_quote_signing_secret_missing",
            "checkout_endpoint_missing",
            "checkout_fondation_token_missing",
          ]),
          status: "not_ready",
        }),
      );
    } finally {
      await rm(spoolDirectory, { force: true, recursive: true });
    }
  });

  it("rejects malformed PayPal captures", async () => {
    const response = await captureCheckout(
      jsonRequest("/api/checkout/capture", {
        provider: "paypal",
        providerOrderId: "x",
      }),
    );

    expect(response.status).toBe(400);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        safeError: expect.any(String),
        status: "failed",
      }),
    );
  });

  it("keeps PayPal capture disabled with the direct checkout", async () => {
    vi.stubEnv("VITRINE_ENABLE_CHECKOUT", "");
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const response = await captureCheckout(
      jsonRequest("/api/checkout/capture", {
        provider: "paypal",
        providerOrderId: "paypal-order-123",
      }),
    );

    expect(response.status).toBe(503);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("fails PayPal capture safely when Fondation is not configured", async () => {
    enableCheckoutConfiguration();
    vi.stubEnv("FONDATION_CHECKOUT_CAPTURE_URL", "");
    vi.stubEnv("FONDATION_ORDER_INTAKE_URL", "");

    const response = await captureCheckout(
      jsonRequest("/api/checkout/capture", {
        provider: "paypal",
        providerOrderId: "paypal-order-123",
      }),
    );

    expect(response.status).toBe(503);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        status: "failed",
      }),
    );
  });

  it("keeps proposal collection disabled by default without calling or persisting", async () => {
    const spoolDirectory = await mkdtemp(
      join(tmpdir(), "vitrine-proposals-disabled-"),
    );
    try {
      vi.stubEnv("VITRINE_ENABLE_PROPOSALS", "");
      vi.stubEnv(
        "VITRINE_PROPOSAL_INBOX_PATH",
        join(spoolDirectory, "proposals.jsonl"),
      );
      const fetchSpy = vi.spyOn(globalThis, "fetch");

      const response = await createProposal(
        jsonRequest("/api/proposals", validProposal),
      );

      expect(response.status).toBe(503);
      expect(fetchSpy).not.toHaveBeenCalled();
      await expect(readdir(spoolDirectory)).resolves.toEqual([]);
      await expect(response.json()).resolves.toEqual(
        expect.objectContaining({
          safeError: expect.any(String),
          status: "failed",
        }),
      );
    } finally {
      await rm(spoolDirectory, { force: true, recursive: true });
    }
  });

  it("blocks partially configured proposal collection before any delivery", async () => {
    vi.stubEnv("VITRINE_ENABLE_PROPOSALS", "true");
    vi.stubEnv("VITRINE_PRIVACY_OFFICER_NAME", "");
    vi.stubEnv("VITRINE_PRIVACY_CONTACT_EMAIL", "");
    vi.stubEnv("VITRINE_PROPOSAL_RETENTION_DAYS", "");
    vi.stubEnv("FONDATION_PROPOSAL_INTAKE_URL", "");
    vi.stubEnv("FONDATION_ORDER_INTAKE_TOKEN", "");
    const fetchSpy = vi.spyOn(globalThis, "fetch");

    const response = await createProposal(
      jsonRequest("/api/proposals", validProposal),
    );

    expect(response.status).toBe(503);
    expect(fetchSpy).not.toHaveBeenCalled();
  });

  it("ignores dormant proposal settings in readiness while collection is disabled", async () => {
    const spoolDirectory = await mkdtemp(
      join(tmpdir(), "vitrine-ready-proposals-disabled-"),
    );
    try {
      vi.stubEnv("VITRINE_ENABLE_PROPOSALS", "");
      vi.stubEnv("VITRINE_PRIVACY_OFFICER_NAME", "");
      vi.stubEnv("VITRINE_PRIVACY_CONTACT_EMAIL", "");
      vi.stubEnv("VITRINE_PROPOSAL_RETENTION_DAYS", "");
      vi.stubEnv(
        "FONDATION_PROPOSAL_INTAKE_URL",
        "https://unapproved.example.test/api/proposals",
      );
      vi.stubEnv("FONDATION_ORDER_INTAKE_URL", "");
      vi.stubEnv("FONDATION_CHECKOUT_URL", "");
      vi.stubEnv("FONDATION_CHECKOUT_CAPTURE_URL", "");
      vi.stubEnv("FONDATION_CHECKOUT_STATUS_URL", "");
      vi.stubEnv("FONDATION_ORDER_INTAKE_TOKEN", "");
      vi.stubEnv("FONDATION_ALLOWED_HOSTS", "");
      vi.stubEnv("VITRINE_ORDER_INBOX_PATH", join(spoolDirectory, "orders.jsonl"));
      vi.stubEnv(
        "VITRINE_PROPOSAL_INBOX_PATH",
        "/proposal-spool-must-not-be-checked/proposals.jsonl",
      );
      vi.stubEnv(
        "VITRINE_ANALYTICS_INBOX_PATH",
        join(spoolDirectory, "analytics.jsonl"),
      );

      const response = await getReadiness();
      const body = (await response.json()) as {
        checks: Array<{ name: string }>;
        issues: string[];
        status: string;
      };

      expect(response.status).toBe(200);
      expect(body.status).toBe("ready");
      expect(body.issues).toEqual([]);
      expect(body.checks.map((check) => check.name)).not.toContain(
        "proposal_spool",
      );
    } finally {
      await rm(spoolDirectory, { force: true, recursive: true });
    }
  });

  it("marks readiness failed only when proposal activation is incomplete", async () => {
    const spoolDirectory = await mkdtemp(
      join(tmpdir(), "vitrine-ready-proposals-enabled-"),
    );
    try {
      vi.stubEnv("VITRINE_ENABLE_PROPOSALS", "true");
      vi.stubEnv("VITRINE_PRIVACY_OFFICER_NAME", "");
      vi.stubEnv("VITRINE_PRIVACY_CONTACT_EMAIL", "");
      vi.stubEnv("VITRINE_PROPOSAL_RETENTION_DAYS", "");
      vi.stubEnv("FONDATION_PROPOSAL_INTAKE_URL", "");
      vi.stubEnv("FONDATION_ORDER_INTAKE_URL", "");
      vi.stubEnv("FONDATION_ORDER_INTAKE_TOKEN", "");
      vi.stubEnv("VITRINE_ORDER_INBOX_PATH", join(spoolDirectory, "orders.jsonl"));
      vi.stubEnv(
        "VITRINE_PROPOSAL_INBOX_PATH",
        join(spoolDirectory, "proposals.jsonl"),
      );
      vi.stubEnv(
        "VITRINE_ANALYTICS_INBOX_PATH",
        join(spoolDirectory, "analytics.jsonl"),
      );

      const response = await getReadiness();
      const body: unknown = await response.json();

      expect(response.status).toBe(503);
      expect(body).toEqual(
        expect.objectContaining({
          issues: expect.arrayContaining([
            "proposals_privacy_officer_missing",
            "proposals_privacy_contact_email_missing",
            "proposals_retention_days_missing",
            "proposals_endpoint_missing",
            "proposals_fondation_token_missing",
          ]),
          status: "not_ready",
        }),
      );
    } finally {
      await rm(spoolDirectory, { force: true, recursive: true });
    }
  });

  it("rejects proposal requests from a foreign origin", async () => {
    enableProposalConfiguration();
    const response = await createProposal(
      jsonRequest("/api/proposals", validProposal, {
        origin: "https://attacker.example",
      }),
    );

    expect(response.status).toBe(403);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("does not trust a forged request host as an allowed origin", async () => {
    enableProposalConfiguration();
    const response = await createProposal(
      new Request("https://attacker.example/api/proposals", {
        body: JSON.stringify(validProposal),
        headers: {
          "content-type": "application/json",
          "idempotency-key": "vitrine-test-forged-host",
          origin: "https://attacker.example",
          "x-forwarded-host": "attacker.example",
          "x-forwarded-proto": "https",
        },
        method: "POST",
      }),
    );

    expect(response.status).toBe(403);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });

  it("acknowledges the proposal honeypot without persisting data", async () => {
    enableProposalConfiguration();
    const response = await createProposal(
      jsonRequest(
        "/api/proposals",
        {
          ...validProposal,
          websiteConfirmation: "bot.example",
        },
        {
          origin: "https://fichero.cloud",
        },
      ),
    );

    expect(response.status).toBe(202);
    await expect(response.json()).resolves.toEqual(
      expect.objectContaining({
        safeError: null,
        status: "accepted",
      }),
    );
  });

  it("rejects invalid analytics events without exposing their payload", async () => {
    const response = await postAnalytics(
      jsonRequest("/api/analytics", {
        path: "not-an-absolute-path",
        type: "page_view",
      }),
    );

    expect(response.status).toBe(400);
    expect(response.headers.get("cache-control")).toBe("no-store");
  });
});
