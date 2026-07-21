import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

import { z } from "zod";

export const runtime = "nodejs";

const analyticsEventSchema = z.object({
  type: z.literal("page_view"),
  path: z.string().min(1).max(300).regex(/^\/[^\s]*$/),
  referrerOrigin: z.string().url().max(300).optional(),
  viewport: z.enum(["small", "medium", "large", "wide"]).optional(),
});

const readJson = async (request: Request): Promise<unknown> => {
  try {
    return await request.json();
  } catch {
    return null;
  }
};

const storeAnalyticsEvent = async (event: unknown): Promise<void> => {
  const inboxPath = process.env.VITRINE_ANALYTICS_INBOX_PATH || "/app/data/analytics-events.jsonl";
  await mkdir(dirname(inboxPath), { recursive: true });
  await appendFile(inboxPath, `${JSON.stringify(event)}\n`, { mode: 0o600 });
};

export async function POST(request: Request): Promise<Response> {
  const parsed = analyticsEventSchema.safeParse(await readJson(request));
  if (!parsed.success) {
    return new Response(null, {
      status: 204,
      headers: { "cache-control": "no-store" },
    });
  }

  try {
    await storeAnalyticsEvent({
      ...parsed.data,
      receivedAt: new Date().toISOString(),
      source: "vitrine:first-party",
    });
  } catch {
    return new Response(null, {
      status: 204,
      headers: { "cache-control": "no-store" },
    });
  }

  return new Response(null, {
    status: 204,
    headers: { "cache-control": "no-store" },
  });
}
