import "server-only";

import {
  context,
  defaultTextMapSetter,
  metrics,
  trace,
  type Context,
} from "@opentelemetry/api";
import { W3CTraceContextPropagator } from "@opentelemetry/core";
import { OTLPMetricExporter } from "@opentelemetry/exporter-metrics-otlp-http";
import { OTLPTraceExporter } from "@opentelemetry/exporter-trace-otlp-http";
import { HttpInstrumentation } from "@opentelemetry/instrumentation-http";
import { UndiciInstrumentation } from "@opentelemetry/instrumentation-undici";
import { resourceFromAttributes } from "@opentelemetry/resources";
import { PeriodicExportingMetricReader } from "@opentelemetry/sdk-metrics";
import { NodeSDK } from "@opentelemetry/sdk-node";
import {
  ParentBasedSampler,
  TraceIdRatioBasedSampler,
} from "@opentelemetry/sdk-trace-base";
import {
  ATTR_SERVICE_NAME,
  ATTR_SERVICE_VERSION,
} from "@opentelemetry/semantic-conventions";
import { z } from "zod";

const emptyToUndefined = (value: unknown): unknown =>
  typeof value === "string" && value.trim().length === 0
    ? undefined
    : value;

const booleanFromEnvironment = z.preprocess((value) => {
  const normalized =
    typeof value === "string" ? value.trim().toLowerCase() : value;
  if (["1", "true", "yes", "on"].includes(String(normalized))) {
    return true;
  }
  if (["0", "false", "no", "off"].includes(String(normalized))) {
    return false;
  }
  return normalized;
}, z.boolean());

const optionalHttpUrl = z.preprocess(
  emptyToUndefined,
  z
    .string()
    .url()
    .max(2_000)
    .refine((value) => {
      const url = new URL(value);
      return (
        (url.protocol === "http:" || url.protocol === "https:") &&
        !url.username &&
        !url.password &&
        !url.hash
      );
    })
    .optional(),
);

const telemetryEnvironmentSchema = z.object({
  NODE_ENV: z
    .enum(["development", "test", "production"])
    .default("development"),
  OTEL_ENABLED: z.preprocess(
    emptyToUndefined,
    booleanFromEnvironment.default(false),
  ),
  OTEL_SERVICE_NAME: z.preprocess(
    emptyToUndefined,
    z
      .string()
      .trim()
      .min(1)
      .max(120)
      .regex(/^[A-Za-z0-9][A-Za-z0-9._-]*$/u)
      .default("vitrine"),
  ),
  OTEL_EXPORTER_OTLP_ENDPOINT: optionalHttpUrl,
  OTEL_EXPORTER_OTLP_TRACES_ENDPOINT: optionalHttpUrl,
  OTEL_EXPORTER_OTLP_METRICS_ENDPOINT: optionalHttpUrl,
  OTEL_METRIC_EXPORT_INTERVAL_MS: z.preprocess(
    emptyToUndefined,
    z.coerce.number().int().min(5_000).max(10 * 60_000).default(60_000),
  ),
  OTEL_TRACE_SAMPLE_RATIO: z.preprocess(
    emptyToUndefined,
    z.coerce.number().min(0).max(1).default(0.1),
  ),
  VITRINE_RELEASE: z.preprocess(
    emptyToUndefined,
    z.string().trim().min(1).max(120).default("0.1.0"),
  ),
  VITRINE_REVISION: z.preprocess(
    emptyToUndefined,
    z.string().trim().min(1).max(120).default("local"),
  ),
});

export type TelemetryConfiguration = {
  enabled: boolean;
  serviceName: string;
  traceEndpoint: string | null;
  metricEndpoint: string | null;
  metricExportIntervalMs: number;
  traceSampleRatio: number;
  environment: "development" | "test" | "production";
  release: string;
  revision: string;
};

const buildOtlpUrl = (
  base: string | undefined,
  suffix: "/v1/traces" | "/v1/metrics",
): string | null => {
  if (!base) {
    return null;
  }

  const url = new URL(base);
  if (url.pathname === "/" || url.pathname === "") {
    url.pathname = suffix;
  }
  return url.toString();
};

export const parseTelemetryEnvironment = (
  environment: NodeJS.ProcessEnv,
): TelemetryConfiguration => {
  const parsed = telemetryEnvironmentSchema.safeParse(environment);
  if (!parsed.success) {
    const issues = parsed.error.issues.map((issue) => issue.path.join("."));
    throw new Error(`Invalid telemetry configuration: ${issues.join(", ")}`);
  }

  const raw = parsed.data;
  const traceEndpoint =
    raw.OTEL_EXPORTER_OTLP_TRACES_ENDPOINT ??
    buildOtlpUrl(raw.OTEL_EXPORTER_OTLP_ENDPOINT, "/v1/traces");
  const metricEndpoint =
    raw.OTEL_EXPORTER_OTLP_METRICS_ENDPOINT ??
    buildOtlpUrl(raw.OTEL_EXPORTER_OTLP_ENDPOINT, "/v1/metrics");

  if (raw.OTEL_ENABLED && (!traceEndpoint || !metricEndpoint)) {
    throw new Error(
      "Invalid telemetry configuration: OTLP trace and metric endpoints are required when enabled",
    );
  }

  return {
    enabled: raw.OTEL_ENABLED,
    serviceName: raw.OTEL_SERVICE_NAME,
    traceEndpoint,
    metricEndpoint,
    metricExportIntervalMs: raw.OTEL_METRIC_EXPORT_INTERVAL_MS,
    traceSampleRatio: raw.OTEL_TRACE_SAMPLE_RATIO,
    environment: raw.NODE_ENV,
    release: raw.VITRINE_RELEASE,
    revision: raw.VITRINE_REVISION,
  };
};

let sdk: NodeSDK | null = null;
let shutdownHooksInstalled = false;
let runtimeMetricsRegistered = false;
const traceContextPropagator = new W3CTraceContextPropagator();

export const getActiveTraceIds = (): {
  traceId?: string;
  spanId?: string;
} => {
  const spanContext = trace.getActiveSpan()?.spanContext();
  return spanContext?.traceId && spanContext.spanId
    ? {
        traceId: spanContext.traceId,
        spanId: spanContext.spanId,
      }
    : {};
};

export const injectTraceHeaders = (
  headers: Record<string, string>,
  activeContext: Context = context.active(),
): Record<string, string> => {
  const output = { ...headers };
  traceContextPropagator.inject(
    activeContext,
    output,
    defaultTextMapSetter,
  );
  return output;
};

export const shutdownOpenTelemetry = async (): Promise<void> => {
  const activeSdk = sdk;
  sdk = null;
  if (activeSdk) {
    await activeSdk.shutdown();
  }
};

const installShutdownHooks = (): void => {
  if (shutdownHooksInstalled) {
    return;
  }
  shutdownHooksInstalled = true;
  const flush = (): void => {
    void shutdownOpenTelemetry();
  };
  process.once("SIGTERM", flush);
  process.once("SIGINT", flush);
};

const registerRuntimeMetrics = (config: TelemetryConfiguration): void => {
  if (runtimeMetricsRegistered) {
    return;
  }
  runtimeMetricsRegistered = true;

  const meter = metrics.getMeter(config.serviceName, config.release);
  const buildInfo = meter.createObservableGauge("vitrine.build.info", {
    description: "Static build information for the running Vitrine release.",
  });
  buildInfo.addCallback((result) => {
    result.observe(1, {
      release: config.release,
      revision: config.revision,
    });
  });

  const uptime = meter.createObservableGauge(
    "vitrine.process.uptime.seconds",
    {
      description: "Vitrine Node.js process uptime in seconds.",
      unit: "s",
    },
  );
  uptime.addCallback((result) => {
    result.observe(process.uptime());
  });

  const residentMemory = meter.createObservableGauge(
    "vitrine.process.resident_memory.bytes",
    {
      description: "Vitrine Node.js resident memory size.",
      unit: "By",
    },
  );
  residentMemory.addCallback((result) => {
    result.observe(process.memoryUsage().rss);
  });
};

export const initializeOpenTelemetry = async (): Promise<void> => {
  const config = parseTelemetryEnvironment(process.env);
  if (!config.enabled || sdk) {
    return;
  }

  const candidate = new NodeSDK({
    resource: resourceFromAttributes({
      [ATTR_SERVICE_NAME]: config.serviceName,
      [ATTR_SERVICE_VERSION]: config.release,
      "deployment.environment": config.environment,
      "service.namespace": "fichero",
      "vitrine.revision": config.revision,
    }),
    traceExporter: new OTLPTraceExporter({
      url: config.traceEndpoint ?? undefined,
    }),
    metricReader: new PeriodicExportingMetricReader({
      exporter: new OTLPMetricExporter({
        url: config.metricEndpoint ?? undefined,
      }),
      exportIntervalMillis: config.metricExportIntervalMs,
    }),
    sampler: new ParentBasedSampler({
      root: new TraceIdRatioBasedSampler(config.traceSampleRatio),
    }),
    textMapPropagator: traceContextPropagator,
    instrumentations: [
      new HttpInstrumentation(),
      new UndiciInstrumentation(),
    ],
  });

  sdk = candidate;
  try {
    await candidate.start();
    registerRuntimeMetrics(config);
    installShutdownHooks();
  } catch (error) {
    sdk = null;
    throw error;
  }
};
