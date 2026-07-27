import "server-only";

import type { ZodType } from "zod";

import {
  getFoundationEndpoint,
  isAllowedFoundationUrl,
  type FoundationEndpointName,
  type ServerEnv,
} from "./env";
import { logServerEvent } from "./logging";
import { injectTraceHeaders } from "./observability";

const maxFoundationResponseBytes = 128 * 1024;

export type FoundationFailureCode =
  | "configuration_error"
  | "invalid_response"
  | "network_error"
  | "not_configured"
  | "rejected"
  | "timeout";

export type FoundationResult<T> =
  | {
      ok: true;
      data: T;
      status: number;
    }
  | {
      ok: false;
      code: FoundationFailureCode;
      safeError: string;
      status: number | null;
      retryable: boolean;
      data?: T;
    };

export const foundationFailureHttpStatus = (failure: {
  code: FoundationFailureCode;
  status: number | null;
}): number => {
  if (
    failure.code === "not_configured" ||
    failure.code === "configuration_error"
  ) {
    return 503;
  }
  if (failure.status === 429) {
    return 429;
  }
  if (failure.status !== null && failure.status >= 500) {
    return 503;
  }
  return failure.code === "rejected" ? 422 : 502;
};

type FoundationRequestOptions<T> = {
  env: ServerEnv;
  endpoint: FoundationEndpointName;
  method: "GET" | "POST";
  responseSchema: ZodType<T>;
  requestId: string;
  idempotencyKey: string;
  body?: unknown;
  query?: Readonly<Record<string, string | undefined>>;
};

const readBoundedJsonResponse = async (
  response: Response,
): Promise<unknown | null> => {
  const contentType = response.headers.get("content-type") ?? "";
  if (!/^application\/(?:json|[^; ]+\+json)(?:\s*;|$)/iu.test(contentType)) {
    return null;
  }

  const contentLength = Number(response.headers.get("content-length") ?? "0");
  if (
    Number.isFinite(contentLength) &&
    contentLength > maxFoundationResponseBytes
  ) {
    return null;
  }
  if (!response.body) {
    return null;
  }

  const reader = response.body.getReader();
  const chunks: Uint8Array[] = [];
  let totalBytes = 0;

  try {
    while (true) {
      const result = await reader.read();
      if (result.done) {
        break;
      }
      totalBytes += result.value.byteLength;
      if (totalBytes > maxFoundationResponseBytes) {
        await reader.cancel("response_too_large");
        return null;
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
    return text.trim() ? (JSON.parse(text) as unknown) : null;
  } catch {
    return null;
  } finally {
    reader.releaseLock();
  }
};

export const requestFoundation = async <T>(
  options: FoundationRequestOptions<T>,
): Promise<FoundationResult<T>> => {
  const endpoint = getFoundationEndpoint(options.env, options.endpoint);
  const token = options.env.foundationToken;
  if (!endpoint || !token) {
    return {
      ok: false,
      code: "not_configured",
      safeError: "Le service Fondation n’est pas configuré pour cette opération.",
      status: null,
      retryable: false,
    };
  }
  if (!isAllowedFoundationUrl(options.env, endpoint)) {
    logServerEvent("error", "fondation.host_rejected", {
      requestId: options.requestId,
      endpoint: options.endpoint,
      host: endpoint.host,
    });
    return {
      ok: false,
      code: "configuration_error",
      safeError: "La destination Fondation n’est pas autorisée.",
      status: null,
      retryable: false,
    };
  }

  const url = new URL(endpoint);
  for (const [key, value] of Object.entries(options.query ?? {})) {
    if (value !== undefined) {
      url.searchParams.set(key, value);
    }
  }

  const controller = new AbortController();
  const timeout = setTimeout(
    () => controller.abort(new Error("foundation_timeout")),
    options.env.foundationRequestTimeoutMs,
  );

  try {
    const response = await fetch(url, {
      method: options.method,
      headers: injectTraceHeaders({
        accept: "application/json",
        authorization: `Bearer ${token}`,
        "content-type": "application/json",
        "idempotency-key": options.idempotencyKey,
        "x-request-id": options.requestId,
      }),
      body:
        options.method === "POST" ? JSON.stringify(options.body ?? {}) : undefined,
      cache: "no-store",
      redirect: "error",
      signal: controller.signal,
    });

    const payload = await readBoundedJsonResponse(response);
    const parsed = options.responseSchema.safeParse(payload);
    if (!parsed.success) {
      logServerEvent("warn", "fondation.invalid_response", {
        requestId: options.requestId,
        endpoint: options.endpoint,
        status: response.status,
      });
      return {
        ok: false,
        code: "invalid_response",
        safeError: "Fondation a retourné une réponse invalide.",
        status: response.status,
        retryable: response.status >= 500,
      };
    }

    if (!response.ok) {
      return {
        ok: false,
        code: "rejected",
        safeError: "Fondation a refusé la demande.",
        status: response.status,
        retryable: response.status === 429 || response.status >= 500,
        data: parsed.data,
      };
    }

    return {
      ok: true,
      data: parsed.data,
      status: response.status,
    };
  } catch (error) {
    const timedOut = controller.signal.aborted;
    logServerEvent("warn", timedOut ? "fondation.timeout" : "fondation.network_error", {
      requestId: options.requestId,
      endpoint: options.endpoint,
      error,
    });
    return {
      ok: false,
      code: timedOut ? "timeout" : "network_error",
      safeError: timedOut
        ? "Fondation n’a pas répondu dans le délai prévu."
        : "Fondation est temporairement inaccessible.",
      status: null,
      retryable: true,
    };
  } finally {
    clearTimeout(timeout);
  }
};
