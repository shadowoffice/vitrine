import type { Instrumentation } from "next";

export async function register(): Promise<void> {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  try {
    const { initializeOpenTelemetry } = await import(
      "@/lib/server/observability"
    );
    await initializeOpenTelemetry();
  } catch (error) {
    console.error(
      JSON.stringify({
        timestamp: new Date().toISOString(),
        level: "error",
        service: "vitrine",
        event: "telemetry.initialization_failed",
        error:
          error instanceof Error
            ? {
                name: error.name,
                message: error.message.slice(0, 500),
              }
            : "unknown_error",
      }),
    );
  }
}

export const onRequestError: Instrumentation.onRequestError = async (
  error,
  _request,
  context,
) => {
  if (process.env.NEXT_RUNTIME !== "nodejs") {
    return;
  }

  const { logServerEvent } = await import("@/lib/server/logging");
  logServerEvent("error", "next.request_error", {
    error,
    routerKind: context.routerKind,
    routePath: context.routePath,
    routeType: context.routeType,
    renderSource: context.renderSource,
    revalidateReason: context.revalidateReason,
  });
};
