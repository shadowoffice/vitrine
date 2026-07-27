import {
  getServerConfigurationIssues,
  getServerEnv,
  ServerConfigurationError,
} from "@/lib/server/env";
import { verifyJsonlPathWritable } from "@/lib/server/jsonl";
import { logServerEvent } from "@/lib/server/logging";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type ReadinessCheck = {
  name: string;
  status: "ok" | "failed";
};

export async function GET(): Promise<Response> {
  const checks: ReadinessCheck[] = [];
  const issues: string[] = [];

  try {
    const env = getServerEnv();
    const configurationIssues = getServerConfigurationIssues(env);
    checks.push({
      name: "configuration",
      status: configurationIssues.length === 0 ? "ok" : "failed",
    });
    issues.push(...configurationIssues);

    const writablePaths: Array<readonly [string, string]> = [
      ["order_spool", env.orderInboxPath],
      ["analytics_spool", env.analyticsInboxPath],
    ];
    if (env.enableProposals) {
      writablePaths.push(["proposal_spool", env.proposalInboxPath]);
    }
    for (const [name, path] of writablePaths) {
      try {
        await verifyJsonlPathWritable(path);
        checks.push({ name, status: "ok" });
      } catch (error) {
        checks.push({ name, status: "failed" });
        issues.push(`${name}_not_writable`);
        logServerEvent("error", "readiness.path_failed", {
          check: name,
          error,
        });
      }
    }
  } catch (error) {
    checks.push({ name: "configuration", status: "failed" });
    issues.push(
      ...(error instanceof ServerConfigurationError
        ? error.issues
        : ["configuration_unavailable"]),
    );
  }

  const ready = issues.length === 0;
  return Response.json(
    {
      status: ready ? "ready" : "not_ready",
      service: "vitrine",
      check: "readiness",
      checks,
      issues,
      timestamp: new Date().toISOString(),
    },
    {
      status: ready ? 200 : 503,
      headers: {
        "cache-control": "no-store",
      },
    },
  );
}
