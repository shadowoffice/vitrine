import { z } from "zod";

import { appendJsonLine } from "@/lib/server/jsonl";
import { logServerEvent } from "@/lib/server/logging";
import {
  failureResponseHeaders,
  readPublicJsonRequest,
  requestResponseHeaders,
} from "@/lib/server/request";

export const runtime = "nodejs";

export const funnelEvents = [
  "proposal_started",
  "proposal_step",
  "proposal_submit",
  "proposal_success",
  "proposal_error",
  "pricing_calculated",
  "plan_recommended",
  "checkout_return",
  "checkout_status",
] as const;

const analyticsPath = z
  .string()
  .trim()
  .min(1)
  .max(300)
  .regex(/^\/[^?\s#]*$/u);

const attributionValue = z
  .string()
  .trim()
  .min(1)
  .max(80)
  .regex(/^[a-z0-9][a-z0-9._~-]*$/iu)
  .optional();

const referrerOrigin = z
  .string()
  .url()
  .max(300)
  .refine((value) => {
    try {
      return new URL(value).origin === value;
    } catch {
      return false;
    }
  });

const pageViewSchema = z
  .object({
    type: z.literal("page_view"),
    path: analyticsPath,
    referrerOrigin: referrerOrigin.optional(),
    viewport: z.enum(["small", "medium", "large", "wide"]).optional(),
    source: attributionValue,
    medium: attributionValue,
    campaign: attributionValue,
    variant: z.enum(["control", "clarity"]).optional(),
  })
  .strict();

const funnelEventSchema = z
  .object({
    type: z.literal("funnel"),
    event: z.enum(funnelEvents),
    path: analyticsPath,
    context: z
      .string()
      .trim()
      .min(1)
      .max(80)
      .regex(/^[a-z0-9][a-z0-9:/_.-]*$/iu)
      .optional(),
    variant: z.enum(["control", "clarity"]).optional(),
  })
  .strict();

const webVitalSchema = z
  .object({
    type: z.literal("web_vital"),
    name: z.enum(["LCP", "INP", "CLS"]),
    value: z.number().finite().min(0).max(120_000),
    path: analyticsPath,
  })
  .strict();

const analyticsEventSchema = z.discriminatedUnion("type", [
  pageViewSchema,
  funnelEventSchema,
  webVitalSchema,
]);

const emptyResponse = (
  status: number,
  headers: HeadersInit,
): Response => new Response(null, { status, headers });

export async function POST(request: Request): Promise<Response> {
  const input = await readPublicJsonRequest(request, {
    scope: "analytics",
    limit: 120,
    windowMs: 60 * 1_000,
    maxBytes: 8_192,
    requireOrigin: true,
    honeypotFields: [],
  });

  if (!input.ok) {
    return emptyResponse(input.status, failureResponseHeaders(input));
  }

  const parsed = analyticsEventSchema.safeParse(input.payload);
  if (!parsed.success) {
    return emptyResponse(
      400,
      requestResponseHeaders(input.requestId, input.idempotencyKey),
    );
  }

  try {
    await appendJsonLine(
      input.env.analyticsInboxPath,
      {
        ...parsed.data,
        receivedAt: new Date().toISOString(),
        collector: "vitrine:first-party",
        requestId: input.requestId,
      },
      {
        maxFileBytes: input.env.analyticsMaxFileBytes,
        rotationFiles: input.env.analyticsRotationFiles,
      },
    );
  } catch (error) {
    logServerEvent("error", "analytics.store_failed", {
      requestId: input.requestId,
      eventType: parsed.data.type,
      error,
    });
    return emptyResponse(
      503,
      requestResponseHeaders(input.requestId, input.idempotencyKey),
    );
  }

  return emptyResponse(
    204,
    requestResponseHeaders(input.requestId, input.idempotencyKey),
  );
}
