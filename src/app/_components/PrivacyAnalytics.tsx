"use client";

import { usePathname, useSearchParams } from "next/navigation";
import { useEffect, useRef } from "react";

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

export type FunnelEvent = (typeof funnelEvents)[number];

type AnalyticsPayload =
  | {
      type: "page_view";
      path: string;
      referrerOrigin?: string;
      viewport: "small" | "medium" | "large" | "wide";
      source?: string;
      medium?: string;
      campaign?: string;
      variant?: MarketingVariant;
    }
  | {
      type: "funnel";
      event: FunnelEvent;
      path: string;
      context?: string;
      variant?: MarketingVariant;
    }
  | {
      type: "web_vital";
      name: WebVitalName;
      path: string;
      value: number;
    };

type MarketingVariant = "control" | "clarity";
export type WebVitalName = "LCP" | "INP" | "CLS";

const configuredVariant: MarketingVariant | undefined =
  process.env.NEXT_PUBLIC_MARKETING_VARIANT === "clarity"
    ? "clarity"
    : process.env.NEXT_PUBLIC_MARKETING_VARIANT === "control"
      ? "control"
      : undefined;

const respectsDoNotTrack = (): boolean => {
  const nav = navigator as Navigator & { msDoNotTrack?: string };
  return nav.doNotTrack === "1" || nav.msDoNotTrack === "1";
};

const sendAnalyticsEvent = (payload: AnalyticsPayload): void => {
  if (respectsDoNotTrack()) {
    return;
  }

  const serializedPayload = JSON.stringify(payload);
  if (navigator.sendBeacon) {
    navigator.sendBeacon(
      "/api/analytics",
      new Blob([serializedPayload], { type: "application/json" }),
    );
    return;
  }

  void fetch("/api/analytics", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: serializedPayload,
    keepalive: true,
  });
};

export const trackFunnelEvent = (
  event: FunnelEvent,
  context?: string,
): void => {
  const normalizedContext = context
    ?.trim()
    .replace(/[^a-zA-Z0-9:_-]/g, "-")
    .slice(0, 80);

  sendAnalyticsEvent({
    type: "funnel",
    event,
    path: window.location.pathname,
    ...(normalizedContext ? { context: normalizedContext } : {}),
    ...(configuredVariant ? { variant: configuredVariant } : {}),
  });
};

export const trackWebVital = (
  name: WebVitalName,
  value: number,
): void => {
  if (!Number.isFinite(value)) {
    return;
  }

  const precision = name === "CLS" ? 1_000 : 1;
  sendAnalyticsEvent({
    type: "web_vital",
    name,
    path: window.location.pathname,
    value: Math.round(value * precision) / precision,
  });
};

const normalizeCampaignValue = (
  value: string | null,
): string | undefined => {
  const normalized = value
    ?.trim()
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
  return normalized || undefined;
};

const getReferrerOrigin = (): string | undefined => {
  if (!document.referrer) {
    return undefined;
  }

  try {
    return new URL(document.referrer).origin;
  } catch {
    return undefined;
  }
};

const getViewportBucket = (): "small" | "medium" | "large" | "wide" => {
  if (window.innerWidth < 640) {
    return "small";
  }

  if (window.innerWidth < 1024) {
    return "medium";
  }

  if (window.innerWidth < 1440) {
    return "large";
  }

  return "wide";
};

export function PrivacyAnalytics() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTrackedPage = useRef<string | null>(null);

  useEffect(() => {
    const source = normalizeCampaignValue(searchParams.get("utm_source"));
    const medium = normalizeCampaignValue(searchParams.get("utm_medium"));
    const campaign = normalizeCampaignValue(searchParams.get("utm_campaign"));
    const pageKey = [pathname, source, medium, campaign]
      .filter((value): value is string => Boolean(value))
      .join("|");

    if (!pathname || pageKey === lastTrackedPage.current) {
      return;
    }

    lastTrackedPage.current = pageKey;
    sendAnalyticsEvent({
      type: "page_view",
      path: pathname,
      referrerOrigin: getReferrerOrigin(),
      viewport: getViewportBucket(),
      ...(source ? { source } : {}),
      ...(medium ? { medium } : {}),
      ...(campaign ? { campaign } : {}),
      ...(configuredVariant ? { variant: configuredVariant } : {}),
    });
  }, [pathname, searchParams]);

  return null;
}
