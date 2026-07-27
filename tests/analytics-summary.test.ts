import { execFile } from "node:child_process";
import { mkdtemp, rm, writeFile } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { promisify } from "node:util";

import { describe, expect, it } from "vitest";
import { z } from "zod";

const execFileAsync = promisify(execFile);

const summarySchema = z.object({
  days: z.array(
    z.object({
      date: z.string(),
      funnel: z.record(z.string(), z.number()),
      pageViews: z.number(),
    }),
  ),
  scan: z.object({
    ignoredInvalidLines: z.number(),
    ignoredOutsideWindow: z.number(),
    linesRead: z.number(),
  }),
  totals: z.object({
    funnel: z.record(z.string(), z.number()),
    pageViews: z.number(),
  }),
  windowDays: z.number(),
});

describe("analytics summary CLI", () => {
  it("prints bounded daily counters without raw analytics dimensions", async () => {
    const fixtureDirectory = await mkdtemp(
      join(tmpdir(), "vitrine-analytics-"),
    );
    const fixturePath = join(fixtureDirectory, "analytics.jsonl");
    const now = new Date();
    const oldDate = new Date(now.getTime() - 45 * 24 * 60 * 60 * 1_000);
    const privateContext = "client-secret-context";
    const privatePath = "/client-prive/projet-123";

    await writeFile(
      fixturePath,
      [
        JSON.stringify({
          path: privatePath,
          receivedAt: now.toISOString(),
          referrerOrigin: "https://private.example.test",
          type: "page_view",
        }),
        JSON.stringify({
          context: privateContext,
          event: "proposal_started",
          path: "/commander",
          receivedAt: now.toISOString(),
          type: "funnel",
        }),
        JSON.stringify({
          event: "proposal_started",
          receivedAt: oldDate.toISOString(),
          type: "funnel",
        }),
        JSON.stringify({
          event: "event_inconnu",
          receivedAt: now.toISOString(),
          type: "funnel",
        }),
        "{json-invalide",
      ].join("\n"),
      "utf8",
    );

    try {
      const { stdout } = await execFileAsync(
        process.execPath,
        [
          resolve("scripts/analytics-summary.mjs"),
          "--days",
          "30",
          "--file",
          fixturePath,
        ],
        {
          cwd: process.cwd(),
        },
      );
      const summary = summarySchema.parse(JSON.parse(stdout));

      expect(summary.windowDays).toBe(30);
      expect(summary.totals.pageViews).toBe(1);
      expect(summary.totals.funnel.proposal_started).toBe(1);
      expect(summary.scan.ignoredInvalidLines).toBe(2);
      expect(summary.scan.ignoredOutsideWindow).toBe(1);
      expect(stdout).not.toContain(privateContext);
      expect(stdout).not.toContain(privatePath);
      expect(stdout).not.toContain("private.example.test");
    } finally {
      await rm(fixtureDirectory, {
        force: true,
        recursive: true,
      });
    }
  });
});
