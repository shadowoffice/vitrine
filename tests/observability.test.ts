import { describe, expect, it } from "vitest";
import {
  propagation,
  ROOT_CONTEXT,
  trace,
  TraceFlags,
} from "@opentelemetry/api";

import {
  injectTraceHeaders,
  parseTelemetryEnvironment,
} from "@/lib/server/observability";

describe("telemetry environment", () => {
  it("stays disabled without production configuration", () => {
    expect(parseTelemetryEnvironment({ NODE_ENV: "test" })).toMatchObject({
      enabled: false,
      serviceName: "vitrine",
      traceEndpoint: null,
      metricEndpoint: null,
      traceSampleRatio: 0.1,
    });
  });

  it("derives bounded OTLP signal endpoints from the Docker collector", () => {
    expect(
      parseTelemetryEnvironment({
        NODE_ENV: "production",
        OTEL_ENABLED: "true",
        OTEL_EXPORTER_OTLP_ENDPOINT: "http://otel-collector:4318",
        OTEL_SERVICE_NAME: "vitrine",
        OTEL_TRACE_SAMPLE_RATIO: "0.25",
        VITRINE_RELEASE: "2026.07.27",
        VITRINE_REVISION: "abc123",
      }),
    ).toMatchObject({
      enabled: true,
      traceEndpoint: "http://otel-collector:4318/v1/traces",
      metricEndpoint: "http://otel-collector:4318/v1/metrics",
      traceSampleRatio: 0.25,
      release: "2026.07.27",
      revision: "abc123",
    });
  });

  it("refuses incomplete enabled telemetry", () => {
    expect(() =>
      parseTelemetryEnvironment({
        NODE_ENV: "production",
        OTEL_ENABLED: "true",
      }),
    ).toThrow(/endpoints are required/u);
  });

  it("refuses credential-bearing collector URLs", () => {
    expect(() =>
      parseTelemetryEnvironment({
        NODE_ENV: "production",
        OTEL_ENABLED: "true",
        OTEL_EXPORTER_OTLP_ENDPOINT: "http://user:password@collector:4318",
      }),
    ).toThrow(/OTEL_EXPORTER_OTLP_ENDPOINT/u);
  });

  it("propagates trace context without forwarding visitor baggage", () => {
    const traceContext = trace.setSpanContext(ROOT_CONTEXT, {
      traceId: "0123456789abcdef0123456789abcdef",
      spanId: "0123456789abcdef",
      traceFlags: TraceFlags.SAMPLED,
    });
    const contextWithBaggage = propagation.setBaggage(
      traceContext,
      propagation.createBaggage({
        visitorControlled: {
          value: "must-not-reach-fondation",
        },
      }),
    );

    expect(injectTraceHeaders({}, contextWithBaggage)).toEqual({
      traceparent:
        "00-0123456789abcdef0123456789abcdef-0123456789abcdef-01",
    });
  });
});
