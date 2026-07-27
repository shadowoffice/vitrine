import "server-only";

import { isAbsolute } from "node:path";

import { z } from "zod";

const emptyToUndefined = (value: unknown): unknown => {
  if (typeof value !== "string") {
    return value;
  }

  const normalized = value.trim();
  return normalized.length > 0 ? normalized : undefined;
};

const optionalUrl = z.preprocess(
  emptyToUndefined,
  z.string().url().max(2_000).optional(),
);

const optionalAbsolutePath = (fallback: string) =>
  z.preprocess(
    emptyToUndefined,
    z
      .string()
      .max(1_024)
      .refine((value) => isAbsolute(value) && !value.includes("\0"), {
        message: "must be an absolute filesystem path",
      })
      .default(fallback),
  );

const optionalInteger = (fallback: number, minimum: number, maximum: number) =>
  z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(minimum).max(maximum).default(fallback),
  );

const optionalBoolean = (fallback: boolean) =>
  z.preprocess((value) => {
    const normalized = emptyToUndefined(value);
    if (normalized === undefined) {
      return fallback;
    }
    if (normalized === "true" || normalized === "1") {
      return true;
    }
    if (normalized === "false" || normalized === "0") {
      return false;
    }
    return normalized;
  }, z.boolean());

const rawServerEnvSchema = z.object({
  NEXT_PUBLIC_SITE_URL: z.preprocess(
    emptyToUndefined,
    z.string().url().max(2_000).default("https://fichero.cloud"),
  ),
  FONDATION_ORDER_INTAKE_URL: optionalUrl,
  FONDATION_PROPOSAL_INTAKE_URL: optionalUrl,
  FONDATION_CHECKOUT_URL: optionalUrl,
  FONDATION_CHECKOUT_CAPTURE_URL: optionalUrl,
  FONDATION_CHECKOUT_STATUS_URL: optionalUrl,
  FONDATION_ORDER_INTAKE_TOKEN: z.preprocess(
    emptyToUndefined,
    z.string().min(16).max(4_096).optional(),
  ),
  FONDATION_ALLOWED_HOSTS: z.preprocess(
    emptyToUndefined,
    z.string().max(2_000).optional(),
  ),
  FONDATION_REQUEST_TIMEOUT_MS: optionalInteger(8_000, 1_000, 30_000),
  VITRINE_ALLOWED_ORIGINS: z.preprocess(
    emptyToUndefined,
    z.string().max(4_000).optional(),
  ),
  VITRINE_TRUST_PROXY_HOPS: optionalInteger(0, 0, 8),
  VITRINE_ENABLE_PROPOSALS: optionalBoolean(false),
  VITRINE_PRIVACY_OFFICER_NAME: z.preprocess(
    emptyToUndefined,
    z.string().trim().min(2).max(200).optional(),
  ),
  VITRINE_PRIVACY_CONTACT_EMAIL: z.preprocess(
    emptyToUndefined,
    z.string().trim().email().max(320).optional(),
  ),
  VITRINE_PROPOSAL_RETENTION_DAYS: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(1).max(3_650).optional(),
  ),
  VITRINE_ENABLE_CHECKOUT: optionalBoolean(false),
  VITRINE_REQUIRE_SIGNED_QUOTE: optionalBoolean(false),
  VITRINE_QUOTE_SIGNING_SECRET: z.preprocess(
    emptyToUndefined,
    z.string().min(32).max(4_096).optional(),
  ),
  VITRINE_ORDER_INBOX_PATH: optionalAbsolutePath("/app/data/erp-orders.jsonl"),
  VITRINE_PROPOSAL_INBOX_PATH: optionalAbsolutePath("/app/data/proposals.jsonl"),
  VITRINE_ANALYTICS_INBOX_PATH: optionalAbsolutePath(
    "/app/data/analytics-events.jsonl",
  ),
  VITRINE_ANALYTICS_MAX_FILE_BYTES: optionalInteger(
    5 * 1024 * 1024,
    64 * 1024,
    100 * 1024 * 1024,
  ),
  VITRINE_ANALYTICS_ROTATION_FILES: optionalInteger(5, 1, 20),
});

export type FoundationEndpointName =
  | "order"
  | "proposal"
  | "checkout"
  | "capture"
  | "status";

export type ServerEnv = {
  siteUrl: URL;
  orderIntakeUrl: URL | null;
  proposalIntakeUrl: URL | null;
  checkoutUrl: URL | null;
  checkoutCaptureUrl: URL | null;
  checkoutStatusUrl: URL | null;
  foundationToken: string | null;
  foundationAllowedHosts: ReadonlySet<string>;
  foundationRequestTimeoutMs: number;
  allowedOrigins: ReadonlySet<string>;
  trustedProxyHops: number;
  enableProposals: boolean;
  privacyOfficerName: string | null;
  privacyContactEmail: string | null;
  proposalRetentionDays: number | null;
  enableCheckout: boolean;
  requireSignedQuote: boolean;
  quoteSigningSecret: string | null;
  orderInboxPath: string;
  proposalInboxPath: string;
  analyticsInboxPath: string;
  analyticsMaxFileBytes: number;
  analyticsRotationFiles: number;
};

export class ServerConfigurationError extends Error {
  readonly issues: readonly string[];

  constructor(issues: readonly string[]) {
    super(`Invalid server configuration: ${issues.join(", ")}`);
    this.name = "ServerConfigurationError";
    this.issues = issues;
  }
}

const parseHttpUrl = (value: string | undefined, key: string): URL | null => {
  if (!value) {
    return null;
  }

  const parsed = new URL(value);
  if (
    (parsed.protocol !== "http:" && parsed.protocol !== "https:") ||
    parsed.username ||
    parsed.password ||
    parsed.hash
  ) {
    throw new ServerConfigurationError([key]);
  }

  return parsed;
};

const parseOriginList = (raw: string | undefined, siteUrl: URL): ReadonlySet<string> => {
  const origins = new Set<string>([siteUrl.origin]);
  if (!raw) {
    return origins;
  }

  for (const value of raw.split(",")) {
    const candidate = value.trim();
    if (!candidate) {
      continue;
    }

    const parsed = parseHttpUrl(candidate, "VITRINE_ALLOWED_ORIGINS");
    if (!parsed || parsed.pathname !== "/" || parsed.search) {
      throw new ServerConfigurationError(["VITRINE_ALLOWED_ORIGINS"]);
    }
    origins.add(parsed.origin);
  }

  return origins;
};

const parseAllowedHosts = (
  raw: string | undefined,
  orderIntakeUrl: URL | null,
): ReadonlySet<string> => {
  const hosts = new Set<string>();
  if (orderIntakeUrl) {
    hosts.add(orderIntakeUrl.host.toLowerCase());
  }

  for (const value of raw?.split(",") ?? []) {
    const host = value.trim().toLowerCase();
    if (!host) {
      continue;
    }
    if (!/^[a-z0-9.-]+(?::\d{1,5})?$/u.test(host)) {
      throw new ServerConfigurationError(["FONDATION_ALLOWED_HOSTS"]);
    }
    hosts.add(host);
  }

  return hosts;
};

/**
 * Parse the server environment only when a request needs it. This intentionally
 * does not run at module import time, so `next build` never requires production
 * secrets.
 */
export const getServerEnv = (): ServerEnv => {
  const parsed = rawServerEnvSchema.safeParse(process.env);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.path.join("."));
    throw new ServerConfigurationError(issues);
  }

  const raw = parsed.data;
  const siteUrl = parseHttpUrl(raw.NEXT_PUBLIC_SITE_URL, "NEXT_PUBLIC_SITE_URL");
  if (!siteUrl) {
    throw new ServerConfigurationError(["NEXT_PUBLIC_SITE_URL"]);
  }

  const orderIntakeUrl = parseHttpUrl(
    raw.FONDATION_ORDER_INTAKE_URL,
    "FONDATION_ORDER_INTAKE_URL",
  );

  return {
    siteUrl,
    orderIntakeUrl,
    proposalIntakeUrl: parseHttpUrl(
      raw.FONDATION_PROPOSAL_INTAKE_URL,
      "FONDATION_PROPOSAL_INTAKE_URL",
    ),
    checkoutUrl: parseHttpUrl(
      raw.FONDATION_CHECKOUT_URL,
      "FONDATION_CHECKOUT_URL",
    ),
    checkoutCaptureUrl: parseHttpUrl(
      raw.FONDATION_CHECKOUT_CAPTURE_URL,
      "FONDATION_CHECKOUT_CAPTURE_URL",
    ),
    checkoutStatusUrl: parseHttpUrl(
      raw.FONDATION_CHECKOUT_STATUS_URL,
      "FONDATION_CHECKOUT_STATUS_URL",
    ),
    foundationToken: raw.FONDATION_ORDER_INTAKE_TOKEN ?? null,
    foundationAllowedHosts: parseAllowedHosts(
      raw.FONDATION_ALLOWED_HOSTS,
      orderIntakeUrl,
    ),
    foundationRequestTimeoutMs: raw.FONDATION_REQUEST_TIMEOUT_MS,
    allowedOrigins: parseOriginList(raw.VITRINE_ALLOWED_ORIGINS, siteUrl),
    trustedProxyHops: raw.VITRINE_TRUST_PROXY_HOPS,
    enableProposals: raw.VITRINE_ENABLE_PROPOSALS,
    privacyOfficerName: raw.VITRINE_PRIVACY_OFFICER_NAME ?? null,
    privacyContactEmail: raw.VITRINE_PRIVACY_CONTACT_EMAIL ?? null,
    proposalRetentionDays: raw.VITRINE_PROPOSAL_RETENTION_DAYS ?? null,
    enableCheckout: raw.VITRINE_ENABLE_CHECKOUT,
    requireSignedQuote: raw.VITRINE_REQUIRE_SIGNED_QUOTE,
    quoteSigningSecret: raw.VITRINE_QUOTE_SIGNING_SECRET ?? null,
    orderInboxPath: raw.VITRINE_ORDER_INBOX_PATH,
    proposalInboxPath: raw.VITRINE_PROPOSAL_INBOX_PATH,
    analyticsInboxPath: raw.VITRINE_ANALYTICS_INBOX_PATH,
    analyticsMaxFileBytes: raw.VITRINE_ANALYTICS_MAX_FILE_BYTES,
    analyticsRotationFiles: raw.VITRINE_ANALYTICS_ROTATION_FILES,
  };
};

const deriveEndpoint = (
  orderIntakeUrl: URL | null,
  pathname: string,
): URL | null => {
  if (!orderIntakeUrl || !/\/erp-orders\/?$/u.test(orderIntakeUrl.pathname)) {
    return null;
  }

  const derived = new URL(orderIntakeUrl);
  derived.pathname = orderIntakeUrl.pathname.replace(/\/erp-orders\/?$/u, pathname);
  derived.search = "";
  return derived;
};

export const getFoundationEndpoint = (
  env: ServerEnv,
  name: FoundationEndpointName,
): URL | null => {
  switch (name) {
    case "order":
      return env.orderIntakeUrl;
    case "proposal":
      return env.proposalIntakeUrl;
    case "checkout":
      return (
        env.checkoutUrl ??
        deriveEndpoint(env.orderIntakeUrl, "/checkout-sessions")
      );
    case "capture":
      return (
        env.checkoutCaptureUrl ??
        deriveEndpoint(env.orderIntakeUrl, "/checkout-sessions/capture")
      );
    case "status":
      // Fondation does not currently expose a public status endpoint. It must
      // be configured explicitly rather than guessed from another route.
      return env.checkoutStatusUrl;
  }
};

export const isAllowedFoundationUrl = (
  env: ServerEnv,
  url: URL,
): boolean =>
  (url.protocol === "http:" || url.protocol === "https:") &&
  !url.username &&
  !url.password &&
  !url.hash &&
  env.foundationAllowedHosts.has(url.host.toLowerCase());

export const getCheckoutConfigurationIssues = (env: ServerEnv): string[] => {
  if (!env.enableCheckout) {
    return [];
  }

  const issues: string[] = [];
  const checkoutEndpoint = getFoundationEndpoint(env, "checkout");
  if (!env.requireSignedQuote) {
    issues.push("checkout_signed_quote_required");
  }
  if (!env.quoteSigningSecret) {
    issues.push("checkout_quote_signing_secret_missing");
  }
  if (!checkoutEndpoint) {
    issues.push("checkout_endpoint_missing");
  } else if (!isAllowedFoundationUrl(env, checkoutEndpoint)) {
    issues.push("checkout_endpoint_host_not_allowed");
  }
  if (!env.foundationToken) {
    issues.push("checkout_fondation_token_missing");
  }
  return issues;
};

export const getProposalConfigurationIssues = (env: ServerEnv): string[] => {
  if (!env.enableProposals) {
    return [];
  }

  const issues: string[] = [];
  const proposalEndpoint = getFoundationEndpoint(env, "proposal");
  if (!env.privacyOfficerName) {
    issues.push("proposals_privacy_officer_missing");
  }
  if (!env.privacyContactEmail) {
    issues.push("proposals_privacy_contact_email_missing");
  }
  if (env.proposalRetentionDays === null) {
    issues.push("proposals_retention_days_missing");
  }
  if (!proposalEndpoint) {
    issues.push("proposals_endpoint_missing");
  } else if (!isAllowedFoundationUrl(env, proposalEndpoint)) {
    issues.push("proposals_endpoint_host_not_allowed");
  }
  if (!env.foundationToken) {
    issues.push("proposals_fondation_token_missing");
  }
  return issues;
};

export const getServerConfigurationIssues = (env: ServerEnv): string[] => {
  const issues: string[] = [];
  type AlwaysCheckedEndpointName = Exclude<
    FoundationEndpointName,
    "proposal"
  >;
  const endpoints = (
    ["order", "checkout", "capture", "status"] as const
  )
    .map((name) => [name, getFoundationEndpoint(env, name)] as const)
    .filter((entry): entry is readonly [AlwaysCheckedEndpointName, URL] =>
      entry[1] !== null
    );

  if (endpoints.length > 0 && !env.foundationToken) {
    issues.push("fondation_token_missing");
  }

  for (const [name, url] of endpoints) {
    if (!isAllowedFoundationUrl(env, url)) {
      issues.push(`fondation_${name}_host_not_allowed`);
    }
  }

  for (const issue of getCheckoutConfigurationIssues(env)) {
    if (!issues.includes(issue)) {
      issues.push(issue);
    }
  }

  for (const issue of getProposalConfigurationIssues(env)) {
    if (!issues.includes(issue)) {
      issues.push(issue);
    }
  }

  return issues;
};
