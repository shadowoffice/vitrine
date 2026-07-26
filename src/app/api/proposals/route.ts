import { randomUUID } from "node:crypto";
import { appendFile, mkdir } from "node:fs/promises";
import { dirname } from "node:path";

import {
  proposalRequestSchema,
  type ProposalResponse,
} from "@/lib/proposal";
import { siteUrl } from "@/lib/site-content";

export const runtime = "nodejs";

const maxPayloadBytes = 32_000;

const proposalReference = (): string => {
  const stamp = new Date().toISOString().replace(/[-:.TZ]/g, "").slice(0, 14);
  return `pro-${stamp}-${randomUUID().slice(0, 8)}`;
};

const jsonResponse = (body: ProposalResponse, status: number): Response =>
  Response.json(body, {
    status,
    headers: {
      "cache-control": "no-store",
    },
  });

const isAllowedOrigin = (request: Request): boolean => {
  const origin = request.headers.get("origin");
  if (!origin) {
    return true;
  }

  let normalizedOrigin: string;
  try {
    normalizedOrigin = new URL(origin).origin;
  } catch {
    return false;
  }

  const requestUrl = new URL(request.url);
  const allowedOrigins = new Set([requestUrl.origin, new URL(siteUrl).origin]);
  const forwardedHost = request.headers
    .get("x-forwarded-host")
    ?.split(",")[0]
    ?.trim();
  const effectiveHost = forwardedHost || request.headers.get("host")?.trim();
  const forwardedProtocol = request.headers
    .get("x-forwarded-proto")
    ?.split(",")[0]
    ?.trim();
  const effectiveProtocol =
    forwardedProtocol || requestUrl.protocol.replace(/:$/u, "");

  if (effectiveHost && (effectiveProtocol === "http" || effectiveProtocol === "https")) {
    try {
      allowedOrigins.add(new URL(`${effectiveProtocol}://${effectiveHost}`).origin);
    } catch {
      return false;
    }
  }

  return allowedOrigins.has(normalizedOrigin);
};

export async function POST(request: Request): Promise<Response> {
  const reference = proposalReference();
  const contentLength = Number(request.headers.get("content-length") ?? "0");

  if (!isAllowedOrigin(request)) {
    return jsonResponse(
      {
        status: "failed",
        reference,
        safeSummary: "Demande refusée.",
        safeError: "Origine de la demande invalide.",
      },
      403,
    );
  }

  if (Number.isFinite(contentLength) && contentLength > maxPayloadBytes) {
    return jsonResponse(
      {
        status: "failed",
        reference,
        safeSummary: "Demande trop volumineuse.",
        safeError: "Réduisez la longueur des notes et réessayez.",
      },
      413,
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    payload = null;
  }

  const parsed = proposalRequestSchema.safeParse(payload);
  if (!parsed.success) {
    return jsonResponse(
      {
        status: "failed",
        reference,
        safeSummary: "Demande incomplète.",
        safeError: parsed.error.issues.map((issue) => issue.message).join(" "),
      },
      400,
    );
  }

  if (parsed.data.websiteConfirmation) {
    return jsonResponse(
      {
        status: "accepted",
        reference,
        safeSummary: "Demande reçue.",
        safeError: null,
      },
      202,
    );
  }

  const inboxPath =
    process.env.VITRINE_PROPOSAL_INBOX_PATH || "/app/data/proposals.jsonl";
  const storedProposal = {
    ...parsed.data,
    websiteConfirmation: undefined,
    reference,
    source: "vitrine:fichero.cloud:proposal",
    receivedAt: new Date().toISOString(),
  };

  try {
    await mkdir(dirname(inboxPath), { recursive: true });
    await appendFile(inboxPath, `${JSON.stringify(storedProposal)}\n`, {
      mode: 0o600,
    });
  } catch {
    return jsonResponse(
      {
        status: "failed",
        reference,
        safeSummary: "La demande n’a pas été enregistrée.",
        safeError: "Le service de réception est temporairement indisponible.",
      },
      503,
    );
  }

  return jsonResponse(
    {
      status: "accepted",
      reference,
      safeSummary:
        "Votre demande est enregistrée. L’équipe pourra préparer le périmètre ProJD à discuter.",
      safeError: null,
    },
    202,
  );
}
