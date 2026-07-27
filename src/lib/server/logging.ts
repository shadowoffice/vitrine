import "server-only";

import { getActiveTraceIds } from "./observability";

const sensitiveKeyPattern =
  /(authorization|cookie|email|phone|token|secret|password|address|message|payload|body|gst|qst)/iu;
const emailPattern = /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}\b/giu;
const bearerPattern = /\bBearer\s+[A-Za-z0-9._~+/=-]+/giu;

const sanitizeText = (value: string): string =>
  value
    .replace(emailPattern, "[redacted-email]")
    .replace(bearerPattern, "Bearer [redacted]")
    .slice(0, 1_000);

const redactValue = (
  value: unknown,
  depth = 0,
  seen = new WeakSet<object>(),
): unknown => {
  if (depth > 5) {
    return "[truncated]";
  }
  if (typeof value === "string") {
    return sanitizeText(value);
  }
  if (
    value === null ||
    typeof value === "number" ||
    typeof value === "boolean" ||
    typeof value === "undefined"
  ) {
    return value;
  }
  if (value instanceof Error) {
    return {
      name: value.name,
      message: sanitizeText(value.message),
    };
  }
  if (Array.isArray(value)) {
    return value.slice(0, 25).map((item) => redactValue(item, depth + 1, seen));
  }
  if (typeof value !== "object") {
    return String(value);
  }
  if (seen.has(value)) {
    return "[circular]";
  }
  seen.add(value);

  const output: Record<string, unknown> = {};
  for (const [key, item] of Object.entries(value).slice(0, 50)) {
    output[key] = sensitiveKeyPattern.test(key)
      ? "[redacted]"
      : redactValue(item, depth + 1, seen);
  }
  return output;
};

export type ServerLogLevel = "info" | "warn" | "error";

export const logServerEvent = (
  level: ServerLogLevel,
  event: string,
  context: Record<string, unknown> = {},
): void => {
  const redactedContext = redactValue(context);
  const traceContext = getActiveTraceIds();
  const entry = JSON.stringify({
    timestamp: new Date().toISOString(),
    level,
    service: "vitrine",
    event,
    ...traceContext,
    ...(redactedContext &&
    typeof redactedContext === "object" &&
    !Array.isArray(redactedContext)
      ? redactedContext
      : {}),
  });

  if (level === "error") {
    console.error(entry);
    return;
  }
  if (level === "warn") {
    console.warn(entry);
    return;
  }
  console.info(entry);
};
