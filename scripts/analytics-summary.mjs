#!/usr/bin/env node

import { createReadStream } from "node:fs";
import { stat } from "node:fs/promises";
import { resolve } from "node:path";
import { createInterface } from "node:readline";

const MAX_BYTES = 16 * 1024 * 1024;
const MAX_LINES = 250_000;
const MAX_LINE_CHARACTERS = 16_384;
const DEFAULT_DAYS = 30;
const DEFAULT_TIMEZONE = "America/Toronto";
const MAX_DAYS = 366;

const funnelEventNames = [
  "proposal_started",
  "proposal_step",
  "proposal_submit",
  "proposal_success",
  "proposal_error",
  "pricing_calculated",
  "plan_recommended",
  "checkout_return",
  "checkout_status",
];
const funnelEventSet = new Set(funnelEventNames);

const usage = `Usage: npm run analytics:summary -- [options]

Options:
  --days <1-${MAX_DAYS}>     Fenêtre à résumer (défaut: ${DEFAULT_DAYS})
  --file <path>        Fichier JSONL (défaut: VITRINE_ANALYTICS_INBOX_PATH
                       ou data/analytics-events.jsonl)
  --timezone <IANA>    Fuseau des journées (défaut: ${DEFAULT_TIMEZONE})
  --help               Afficher cette aide
`;

const parsePositiveInteger = (value, label, maximum) => {
  const parsed = Number.parseInt(value, 10);
  if (!Number.isInteger(parsed) || String(parsed) !== value || parsed < 1 || parsed > maximum) {
    throw new Error(`${label} doit être un entier entre 1 et ${maximum}.`);
  }

  return parsed;
};

const parseArguments = (argumentsList) => {
  const options = {
    days: DEFAULT_DAYS,
    file:
      process.env.VITRINE_ANALYTICS_INBOX_PATH?.trim() ||
      resolve("data/analytics-events.jsonl"),
    help: false,
    timezone: DEFAULT_TIMEZONE,
  };

  for (let index = 0; index < argumentsList.length; index += 1) {
    const argument = argumentsList[index];
    if (argument === "--help") {
      options.help = true;
      continue;
    }

    const value = argumentsList[index + 1];
    if (!value || value.startsWith("--")) {
      throw new Error(`Valeur manquante pour ${argument}.`);
    }

    if (argument === "--days") {
      options.days = parsePositiveInteger(value, "--days", MAX_DAYS);
    } else if (argument === "--file") {
      options.file = resolve(value);
    } else if (argument === "--timezone") {
      options.timezone = value;
    } else {
      throw new Error(`Option inconnue: ${argument}.`);
    }

    index += 1;
  }

  return options;
};

const isRecord = (value) =>
  value !== null && typeof value === "object" && !Array.isArray(value);

const emptyFunnelCounts = () =>
  Object.fromEntries(funnelEventNames.map((eventName) => [eventName, 0]));

const createDayBucket = (date) => ({
  date,
  funnel: emptyFunnelCounts(),
  pageViews: 0,
});

const createDateKeyFormatter = (timezone) => {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    day: "2-digit",
    month: "2-digit",
    timeZone: timezone,
    year: "numeric",
  });

  return (date) => {
    const parts = Object.fromEntries(
      formatter
        .formatToParts(date)
        .filter((part) => part.type !== "literal")
        .map((part) => [part.type, part.value]),
    );

    return `${parts.year}-${parts.month}-${parts.day}`;
  };
};

const readSummary = async ({ days, file, timezone }) => {
  const fileStats = await stat(file);
  if (!fileStats.isFile()) {
    throw new Error("La source analytics n’est pas un fichier.");
  }

  const now = new Date();
  const cutoffTimestamp = now.getTime() - days * 24 * 60 * 60 * 1_000;
  const startByte = Math.max(0, fileStats.size - MAX_BYTES);
  const dateKey = createDateKeyFormatter(timezone);
  const byDay = new Map();
  const totals = {
    funnel: emptyFunnelCounts(),
    pageViews: 0,
  };
  const scan = {
    ignoredInvalidLines: 0,
    ignoredOutsideWindow: 0,
    linesRead: 0,
    maxBytes: MAX_BYTES,
    maxLines: MAX_LINES,
    sourceBytes: fileStats.size,
    truncatedByBytes: startByte > 0,
    truncatedByLines: false,
  };

  if (fileStats.size > 0) {
    const stream = createReadStream(file, {
      encoding: "utf8",
      end: fileStats.size - 1,
      start: startByte,
    });
    const lines = createInterface({
      crlfDelay: Number.POSITIVE_INFINITY,
      input: stream,
    });
    let discardPartialFirstLine = startByte > 0;

    for await (const line of lines) {
      if (discardPartialFirstLine) {
        discardPartialFirstLine = false;
        continue;
      }

      if (scan.linesRead >= MAX_LINES) {
        scan.truncatedByLines = true;
        lines.close();
        stream.destroy();
        break;
      }

      scan.linesRead += 1;
      if (line.length === 0 || line.length > MAX_LINE_CHARACTERS) {
        scan.ignoredInvalidLines += 1;
        continue;
      }

      let candidate;
      try {
        candidate = JSON.parse(line);
      } catch {
        scan.ignoredInvalidLines += 1;
        continue;
      }

      if (
        !isRecord(candidate) ||
        typeof candidate.receivedAt !== "string"
      ) {
        scan.ignoredInvalidLines += 1;
        continue;
      }

      const receivedAt = new Date(candidate.receivedAt);
      const receivedTimestamp = receivedAt.getTime();
      if (!Number.isFinite(receivedTimestamp)) {
        scan.ignoredInvalidLines += 1;
        continue;
      }
      if (
        receivedTimestamp < cutoffTimestamp ||
        receivedTimestamp > now.getTime() + 5 * 60 * 1_000
      ) {
        scan.ignoredOutsideWindow += 1;
        continue;
      }

      const key = dateKey(receivedAt);
      const bucket = byDay.get(key) ?? createDayBucket(key);

      if (candidate.type === "page_view") {
        bucket.pageViews += 1;
        totals.pageViews += 1;
      } else if (
        candidate.type === "funnel" &&
        typeof candidate.event === "string" &&
        funnelEventSet.has(candidate.event)
      ) {
        bucket.funnel[candidate.event] += 1;
        totals.funnel[candidate.event] += 1;
      } else {
        scan.ignoredInvalidLines += 1;
        continue;
      }

      byDay.set(key, bucket);
    }
  }

  return {
    generatedAt: now.toISOString(),
    privacy:
      "Agrégats fixes uniquement; aucun chemin, référent ou contexte brut n’est affiché.",
    scan,
    timezone,
    totals,
    windowDays: days,
    days: [...byDay.values()].sort((left, right) =>
      left.date.localeCompare(right.date),
    ),
  };
};

const main = async () => {
  const options = parseArguments(process.argv.slice(2));
  if (options.help) {
    process.stdout.write(usage);
    return;
  }

  // Validate the timezone before reading a potentially large file.
  createDateKeyFormatter(options.timezone)(new Date());
  const summary = await readSummary(options);
  process.stdout.write(`${JSON.stringify(summary, null, 2)}\n`);
};

main().catch((error) => {
  const message =
    error instanceof Error ? error.message : "Erreur analytics inconnue.";
  process.stderr.write(`Résumé analytics impossible: ${message}\n`);
  process.exitCode = 1;
});
