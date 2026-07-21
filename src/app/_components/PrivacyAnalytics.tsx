"use client";

import { useEffect } from "react";

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
  useEffect(() => {
    const nav = navigator as Navigator & { msDoNotTrack?: string };
    if (nav.doNotTrack === "1" || nav.msDoNotTrack === "1") {
      return;
    }

    const payload = JSON.stringify({
      type: "page_view",
      path: window.location.pathname,
      referrerOrigin: getReferrerOrigin(),
      viewport: getViewportBucket(),
    });

    if (navigator.sendBeacon) {
      navigator.sendBeacon("/api/analytics", new Blob([payload], { type: "application/json" }));
      return;
    }

    void fetch("/api/analytics", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: payload,
      keepalive: true,
    });
  }, []);

  return null;
}
