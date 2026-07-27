import "server-only";

import { createHash } from "node:crypto";

import type { CheckoutCaptureResponse } from "@/lib/erp-order";

const maxCaptureReplayEntries = 2_000;
const pendingTtlMs = 2 * 60 * 1_000;
const completedTtlMs = 24 * 60 * 60 * 1_000;

type CaptureReplayEntry =
  | {
      state: "pending";
      expiresAt: number;
    }
  | {
      state: "completed";
      expiresAt: number;
      response: CheckoutCaptureResponse;
    };

const captureReplays = new Map<string, CaptureReplayEntry>();

const digest = (value: string): string =>
  createHash("sha256").update(value).digest("hex");

const pruneReplayEntries = (now: number): void => {
  for (const [key, entry] of captureReplays) {
    if (entry.expiresAt <= now) {
      captureReplays.delete(key);
    }
  }
  while (captureReplays.size >= maxCaptureReplayEntries) {
    const oldestKey = captureReplays.keys().next().value as string | undefined;
    if (!oldestKey) {
      break;
    }
    captureReplays.delete(oldestKey);
  }
};

export const createStableReference = (
  prefix: "fic" | "pro",
  idempotencyKey: string,
): string => `${prefix}-${digest(idempotencyKey).slice(0, 20)}`;

export const acquireCaptureReplay = (
  providerOrderId: string,
):
  | { acquired: true; key: string }
  | { acquired: false; state: "pending" }
  | {
      acquired: false;
      state: "completed";
      response: CheckoutCaptureResponse;
    } => {
  const now = Date.now();
  pruneReplayEntries(now);
  const key = digest(`paypal:${providerOrderId}`);
  const existing = captureReplays.get(key);
  if (existing?.state === "pending") {
    return { acquired: false, state: "pending" };
  }
  if (existing?.state === "completed") {
    return {
      acquired: false,
      state: "completed",
      response: existing.response,
    };
  }

  captureReplays.set(key, {
    state: "pending",
    expiresAt: now + pendingTtlMs,
  });
  return { acquired: true, key };
};

export const completeCaptureReplay = (
  key: string,
  response: CheckoutCaptureResponse,
): void => {
  captureReplays.set(key, {
    state: "completed",
    expiresAt: Date.now() + completedTtlMs,
    response,
  });
};

export const releaseCaptureReplay = (key: string): void => {
  const entry = captureReplays.get(key);
  if (entry?.state === "pending") {
    captureReplays.delete(key);
  }
};
