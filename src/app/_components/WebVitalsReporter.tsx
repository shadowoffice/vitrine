"use client";

import { useReportWebVitals } from "next/web-vitals";

import {
  trackWebVital,
  type WebVitalName,
} from "./PrivacyAnalytics";

const supportedMetrics = new Set<WebVitalName>(["LCP", "INP", "CLS"]);

type ReportWebVitalsCallback = Parameters<typeof useReportWebVitals>[0];

const reportWebVital: ReportWebVitalsCallback = (metric) => {
  if (supportedMetrics.has(metric.name as WebVitalName)) {
    trackWebVital(metric.name as WebVitalName, metric.value);
  }
};

export function WebVitalsReporter() {
  useReportWebVitals(reportWebVital);
  return null;
}
