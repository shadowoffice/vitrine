import { randomUUID } from "node:crypto";

import {
  proposalIntakeResponseSchema,
  proposalRequestSchema,
  type ProposalResponse,
} from "@/lib/proposal";
import {
  getProposalConfigurationIssues,
  getServerEnv,
} from "@/lib/server/env";
import { requestFoundation } from "@/lib/server/foundation-client";
import { createStableReference } from "@/lib/server/idempotency";
import { appendJsonLine } from "@/lib/server/jsonl";
import { logServerEvent } from "@/lib/server/logging";
import {
  failureResponseHeaders,
  readPublicJsonRequest,
  requestResponseHeaders,
  type RequestFailure,
} from "@/lib/server/request";

export const runtime = "nodejs";

const maxPayloadBytes = 32_000;
const proposalSpoolOptions = {
  maxFileBytes: 20 * 1024 * 1024,
  rotationFiles: 10,
} as const;

const jsonResponse = (
  body: ProposalResponse,
  status: number,
  requestId: string,
  idempotencyKey?: string,
  extraHeaders?: HeadersInit,
): Response =>
  Response.json(body, {
    status,
    headers: requestResponseHeaders(
      requestId,
      idempotencyKey,
      extraHeaders,
    ),
  });

const failureSummary = (failure: RequestFailure): string => {
  switch (failure.code) {
    case "payload_too_large":
      return "Demande trop volumineuse.";
    case "rate_limited":
      return "Trop de demandes.";
    case "invalid_origin":
      return "Demande refusée.";
    default:
      return "Demande invalide.";
  }
};

export async function POST(request: Request): Promise<Response> {
  const gateRequestId = randomUUID();
  try {
    const env = getServerEnv();
    const configurationIssues = getProposalConfigurationIssues(env);
    if (!env.enableProposals || configurationIssues.length > 0) {
      logServerEvent(
        configurationIssues.length > 0 ? "error" : "info",
        "proposal.collection_blocked",
        {
          requestId: gateRequestId,
          enabled: env.enableProposals,
          issues: configurationIssues,
        },
      );
      return jsonResponse(
        {
          status: "failed",
          reference: createStableReference("pro", gateRequestId),
          safeSummary: "Réception des propositions indisponible.",
          safeError:
            "Le formulaire public est fermé tant que sa configuration de confidentialité et de livraison n’est pas complète.",
        },
        503,
        gateRequestId,
      );
    }
  } catch (error) {
    logServerEvent("error", "proposal.configuration_unavailable", {
      requestId: gateRequestId,
      error,
    });
    return jsonResponse(
      {
        status: "failed",
        reference: createStableReference("pro", gateRequestId),
        safeSummary: "Réception des propositions indisponible.",
        safeError: "La configuration sécurisée du formulaire est invalide.",
      },
      503,
      gateRequestId,
    );
  }

  const input = await readPublicJsonRequest(request, {
    scope: "proposals",
    limit: 8,
    windowMs: 10 * 60 * 1_000,
    maxBytes: maxPayloadBytes,
    requireOrigin: true,
    honeypotFields: ["websiteConfirmation"],
  });

  if (!input.ok) {
    const response = Response.json(
      {
        status: "failed",
        reference: createStableReference("pro", input.requestId),
        safeSummary: failureSummary(input),
        safeError: input.safeError,
      } satisfies ProposalResponse,
      {
        status: input.status,
        headers: failureResponseHeaders(input),
      },
    );
    return response;
  }

  const reference = createStableReference("pro", input.idempotencyKey);
  if (input.isHoneypot) {
    logServerEvent("info", "proposal.honeypot", {
      requestId: input.requestId,
    });
    return jsonResponse(
      {
        status: "accepted",
        reference,
        safeSummary: "Demande reçue.",
        safeError: null,
      },
      202,
      input.requestId,
      input.idempotencyKey,
    );
  }

  const parsed = proposalRequestSchema.safeParse(input.payload);
  if (!parsed.success) {
    return jsonResponse(
      {
        status: "failed",
        reference,
        safeSummary: "Demande incomplète.",
        safeError: parsed.error.issues.map((issue) => issue.message).join(" "),
      },
      400,
      input.requestId,
      input.idempotencyKey,
    );
  }

  const { websiteConfirmation, ...proposal } = parsed.data;
  void websiteConfirmation;
  const storedProposal = {
    ...proposal,
    reference,
    idempotencyKey: input.idempotencyKey,
    source: "vitrine:fichero.cloud:proposal",
    receivedAt: new Date().toISOString(),
    retentionDays: input.env.proposalRetentionDays,
  };

  const foundation = await requestFoundation({
    env: input.env,
    endpoint: "proposal",
    method: "POST",
    responseSchema: proposalIntakeResponseSchema,
    requestId: input.requestId,
    idempotencyKey: input.idempotencyKey,
    body: storedProposal,
  });

  if (
    foundation.ok &&
    (foundation.data.status === "accepted" ||
      foundation.data.status === "queued")
  ) {
    logServerEvent("info", "proposal.accepted", {
      requestId: input.requestId,
      reference,
      delivery: "fondation",
    });
    return jsonResponse(
      {
        status: "accepted",
        reference: foundation.data.reference ?? reference,
        safeSummary:
          foundation.data.safeSummary ??
          "Votre demande est enregistrée pour suivi par l’équipe ProJD.",
        safeError: null,
        delivery: "fondation",
      },
      202,
      input.requestId,
      input.idempotencyKey,
    );
  }

  const fallbackReason = foundation.ok
    ? foundation.data.safeError ?? "fondation_rejected"
    : foundation.code;
  try {
    await appendJsonLine(
      input.env.proposalInboxPath,
      {
        ...storedProposal,
        delivery: "local_backup",
        fallbackReason,
      },
      proposalSpoolOptions,
    );
  } catch (error) {
    logServerEvent("error", "proposal.spool_failed", {
      requestId: input.requestId,
      reference,
      error,
    });
    return jsonResponse(
      {
        status: "failed",
        reference,
        safeSummary: "La demande n’a pas été enregistrée.",
        safeError: "Le service de réception est temporairement indisponible.",
      },
      503,
      input.requestId,
      input.idempotencyKey,
    );
  }

  logServerEvent("warn", "proposal.local_backup", {
    requestId: input.requestId,
    reference,
    fallbackReason,
  });
  return jsonResponse(
    {
      status: "accepted",
      reference,
      safeSummary:
        "Votre demande est sauvegardée localement pour révision par l’équipe ProJD.",
      safeError: null,
      delivery: "local_backup",
    },
    202,
    input.requestId,
    input.idempotencyKey,
  );
}
