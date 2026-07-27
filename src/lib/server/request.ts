import "server-only";

import { createHash, randomUUID } from "node:crypto";

import {
  getServerEnv,
  type ServerEnv,
  ServerConfigurationError,
} from "./env";

const idempotencyKeyPattern = /^[A-Za-z0-9][A-Za-z0-9._:/-]{7,127}$/u;
const requestIdPattern = /^[A-Za-z0-9][A-Za-z0-9._:/-]{7,127}$/u;
const jsonContentTypePattern =
  /^application\/(?:json|[A-Za-z0-9!#$&^_.+-]+\+json)(?:\s*;|$)/iu;
const maxRateLimitEntries = 5_000;

type RateLimitEntry = {
  count: number;
  resetAt: number;
};

const rateLimits = new Map<string, RateLimitEntry>();

export type RequestFailureCode =
  | "configuration_error"
  | "invalid_origin"
  | "invalid_idempotency_key"
  | "invalid_json"
  | "payload_too_large"
  | "rate_limited"
  | "unsupported_media_type";

export type RequestFailure = {
  ok: false;
  code: RequestFailureCode;
  requestId: string;
  status: number;
  safeError: string;
  retryAfterSeconds?: number;
};

export type PublicRequestContext = {
  ok: true;
  requestId: string;
  idempotencyKey: string;
  clientKey: string;
  env: ServerEnv;
};

export type PublicJsonRequest = PublicRequestContext & {
  payload: unknown;
  isHoneypot: boolean;
};

type PublicRequestOptions = {
  scope: string;
  limit: number;
  windowMs: number;
  requireOrigin?: boolean;
  requireIdempotencyKey?: boolean;
};

type PublicJsonRequestOptions = PublicRequestOptions & {
  maxBytes: number;
  honeypotFields?: readonly string[];
};

const requestIdFrom = (request: Request): string => {
  const candidate = request.headers.get("x-request-id")?.trim();
  return candidate && requestIdPattern.test(candidate) ? candidate : randomUUID();
};

const idempotencyKeyFrom = (
  request: Request,
  scope: string,
  required: boolean,
): string | null => {
  const candidate = (
    request.headers.get("idempotency-key") ??
    request.headers.get("x-idempotency-key")
  )?.trim();
  if (!candidate) {
    return required ? null : `${scope}:${randomUUID()}`;
  }
  return idempotencyKeyPattern.test(candidate) ? candidate : null;
};

const hasAllowedOrigin = (
  request: Request,
  env: ServerEnv,
  required: boolean,
): boolean => {
  const origin = request.headers.get("origin");
  if (!origin) {
    return !required;
  }

  let normalized: string;
  try {
    normalized = new URL(origin).origin;
  } catch {
    return false;
  }

  // Host and forwarded-host are request-controlled at this boundary. Only the
  // canonical origin and explicit configuration may authorize a browser POST.
  return env.allowedOrigins.has(normalized);
};

const clientKeyFrom = (request: Request, env: ServerEnv): string => {
  const forwardedFor = request.headers
    .get("x-forwarded-for")
    ?.split(",")
    .map((value) => value.trim())
    .filter(Boolean);

  if (
    forwardedFor &&
    forwardedFor.length > 0 &&
    env.trustedProxyHops > 0
  ) {
    const clientIndex = Math.max(
      0,
      forwardedFor.length - env.trustedProxyHops,
    );
    const client = forwardedFor[clientIndex];
    if (client) {
      return createHash("sha256").update(client).digest("hex").slice(0, 24);
    }
  }

  // Request does not expose the direct socket address. When proxy headers are
  // not explicitly trusted, use a coarse anonymous fingerprint to avoid one
  // global bucket while never treating spoofable headers as an IP identity.
  const fingerprint = [
    request.headers.get("user-agent") ?? "unknown",
    request.headers.get("accept-language") ?? "unknown",
    request.headers.get("sec-ch-ua-platform") ?? "unknown",
  ].join("|");
  return createHash("sha256").update(fingerprint).digest("hex").slice(0, 24);
};

const consumeRateLimit = (
  scope: string,
  clientKey: string,
  limit: number,
  windowMs: number,
): { allowed: true } | { allowed: false; retryAfterSeconds: number } => {
  const now = Date.now();
  const key = `${scope}:${clientKey}`;
  const current = rateLimits.get(key);

  if (!current || current.resetAt <= now) {
    if (rateLimits.size >= maxRateLimitEntries) {
      for (const [entryKey, entry] of rateLimits) {
        if (entry.resetAt <= now) {
          rateLimits.delete(entryKey);
        }
      }
      while (rateLimits.size >= maxRateLimitEntries) {
        const oldestKey = rateLimits.keys().next().value as string | undefined;
        if (!oldestKey) {
          break;
        }
        rateLimits.delete(oldestKey);
      }
    }

    rateLimits.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true };
  }

  if (current.count >= limit) {
    return {
      allowed: false,
      retryAfterSeconds: Math.max(1, Math.ceil((current.resetAt - now) / 1_000)),
    };
  }

  current.count += 1;
  return { allowed: true };
};

export const inspectPublicRequest = (
  request: Request,
  options: PublicRequestOptions,
): PublicRequestContext | RequestFailure => {
  const requestId = requestIdFrom(request);
  let env: ServerEnv;
  try {
    env = getServerEnv();
  } catch (error) {
    return {
      ok: false,
      code: "configuration_error",
      requestId,
      status: 503,
      safeError:
        error instanceof ServerConfigurationError
          ? "La configuration du service est invalide."
          : "La configuration du service est indisponible.",
    };
  }

  if (!hasAllowedOrigin(request, env, options.requireOrigin ?? true)) {
    return {
      ok: false,
      code: "invalid_origin",
      requestId,
      status: 403,
      safeError: "Origine de la demande invalide.",
    };
  }

  const idempotencyKey = idempotencyKeyFrom(
    request,
    options.scope,
    options.requireIdempotencyKey ?? false,
  );
  if (!idempotencyKey) {
    return {
      ok: false,
      code: "invalid_idempotency_key",
      requestId,
      status: 400,
      safeError: options.requireIdempotencyKey
        ? "Une clé d’idempotence valide est requise."
        : "La clé d’idempotence est invalide.",
    };
  }

  const clientKey = clientKeyFrom(request, env);
  const rateLimit = consumeRateLimit(
    options.scope,
    clientKey,
    options.limit,
    options.windowMs,
  );
  if (!rateLimit.allowed) {
    return {
      ok: false,
      code: "rate_limited",
      requestId,
      status: 429,
      safeError: "Trop de demandes. Réessayez plus tard.",
      retryAfterSeconds: rateLimit.retryAfterSeconds,
    };
  }

  return {
    ok: true,
    requestId,
    idempotencyKey,
    clientKey,
    env,
  };
};

const readJsonStream = async (
  request: Request,
  maxBytes: number,
): Promise<
  | { ok: true; payload: unknown }
  | { ok: false; code: "invalid_json" | "payload_too_large" }
> => {
  const contentLengthHeader = request.headers.get("content-length");
  if (contentLengthHeader) {
    const contentLength = Number(contentLengthHeader);
    if (Number.isFinite(contentLength) && contentLength > maxBytes) {
      return { ok: false, code: "payload_too_large" };
    }
  }

  if (!request.body) {
    return { ok: false, code: "invalid_json" };
  }

  const reader = request.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const result = await reader.read();
      if (result.done) {
        break;
      }
      totalBytes += result.value.byteLength;
      if (totalBytes > maxBytes) {
        await reader.cancel("payload_too_large");
        return { ok: false, code: "payload_too_large" };
      }
      chunks.push(result.value);
    }

    const bytes = new Uint8Array(totalBytes);
    let offset = 0;
    for (const chunk of chunks) {
      bytes.set(chunk, offset);
      offset += chunk.byteLength;
    }

    const text = new TextDecoder("utf-8", { fatal: true }).decode(bytes);
    if (!text.trim()) {
      return { ok: false, code: "invalid_json" };
    }
    return { ok: true, payload: JSON.parse(text) as unknown };
  } catch {
    return { ok: false, code: "invalid_json" };
  } finally {
    reader.releaseLock();
  }
};

const hasHoneypotValue = (
  payload: unknown,
  fields: readonly string[],
): boolean => {
  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return false;
  }

  const record = payload as Record<string, unknown>;
  return fields.some((field) => {
    const value = record[field];
    return typeof value === "string" && value.trim().length > 0;
  });
};

export const readPublicJsonRequest = async (
  request: Request,
  options: PublicJsonRequestOptions,
): Promise<PublicJsonRequest | RequestFailure> => {
  const inspected = inspectPublicRequest(request, options);
  if (!inspected.ok) {
    return inspected;
  }

  const contentType = request.headers.get("content-type")?.trim() ?? "";
  if (!jsonContentTypePattern.test(contentType)) {
    return {
      ok: false,
      code: "unsupported_media_type",
      requestId: inspected.requestId,
      status: 415,
      safeError: "Le contenu doit être envoyé en JSON.",
    };
  }

  const body = await readJsonStream(request, options.maxBytes);
  if (!body.ok) {
    return {
      ok: false,
      code: body.code,
      requestId: inspected.requestId,
      status: body.code === "payload_too_large" ? 413 : 400,
      safeError:
        body.code === "payload_too_large"
          ? "La demande est trop volumineuse."
          : "Le contenu JSON est invalide.",
    };
  }

  return {
    ...inspected,
    payload: body.payload,
    isHoneypot: hasHoneypotValue(
      body.payload,
      options.honeypotFields ?? ["websiteConfirmation"],
    ),
  };
};

export const requestResponseHeaders = (
  requestId: string,
  idempotencyKey?: string,
  extra: HeadersInit = {},
): Headers => {
  const headers = new Headers(extra);
  headers.set("cache-control", "no-store");
  headers.set("x-request-id", requestId);
  if (idempotencyKey) {
    headers.set("idempotency-key", idempotencyKey);
  }
  return headers;
};

export const failureResponseHeaders = (failure: RequestFailure): Headers => {
  const headers = requestResponseHeaders(failure.requestId);
  if (failure.retryAfterSeconds) {
    headers.set("retry-after", String(failure.retryAfterSeconds));
  }
  return headers;
};
