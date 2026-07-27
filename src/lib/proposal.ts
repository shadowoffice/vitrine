import { z } from "zod";

import { pricingPlanCodes } from "./pricing";

export const proposalTeamSizes = [
  "1-5",
  "6-15",
  "16-40",
  "41-100",
  "100+",
] as const;

export const proposalPriorities = [
  "projects",
  "finance",
  "estimation",
  "payables",
  "integrations",
] as const;

export const proposalModuleSlugs = [
  "projets",
  "budgets",
  "contrats",
  "estimation-bid",
  "documents",
  "factures-ocr",
  "partenaires",
  "portail-collaboration",
  "rapports",
  "integrations",
] as const;

export const proposalPriorityLabels = {
  projects: "Gestion de projets",
  finance: "Finance construction",
  estimation: "Estimation et appels d’offres",
  payables: "Comptes fournisseurs",
  integrations: "Procore, Microsoft 365 et API",
} satisfies Record<(typeof proposalPriorities)[number], string>;

const optionalTrimmedString = (maxLength: number) =>
  z.preprocess((value) => {
    if (typeof value !== "string") {
      return value;
    }

    const normalized = value.trim();
    return normalized.length > 0 ? normalized : undefined;
  }, z.string().max(maxLength).optional());

export const proposalRequestSchema = z.object({
  companyName: z.string().trim().min(2, "Le nom de l’entreprise est requis.").max(200),
  contactName: z.string().trim().min(2, "Le nom du contact est requis.").max(160),
  email: z.string().trim().email("Courriel invalide.").max(254),
  phone: optionalTrimmedString(80),
  teamSize: z.enum(proposalTeamSizes),
  priority: z.enum(proposalPriorities),
  currentTools: z.array(z.string().trim().min(1).max(60)).max(8).default([]),
  selectedModules: z.array(z.enum(proposalModuleSlugs)).max(10).default([]),
  sourceContext: optionalTrimmedString(120).refine(
    (value) => value === undefined || /^[a-z0-9][a-z0-9:/_.-]*$/iu.test(value),
    "Le contexte de provenance est invalide.",
  ),
  plan: z.enum(pricingPlanCodes).optional(),
  message: optionalTrimmedString(2000),
  acceptsContact: z.boolean().refine((value) => value, "L’autorisation de contact est requise."),
  websiteConfirmation: optionalTrimmedString(200),
});

export type ProposalRequestInput = z.infer<typeof proposalRequestSchema>;

export type ProposalResponse = {
  status: "accepted" | "failed";
  reference: string;
  safeSummary: string;
  safeError: string | null;
  delivery?: "fondation" | "local_backup";
};

export const proposalIntakeResponseSchema = z.object({
  status: z.enum(["accepted", "queued", "failed"]),
  reference: z.string().trim().min(1).max(160).optional(),
  safeSummary: z.string().trim().min(1).max(500).optional(),
  safeError: z.string().trim().max(1_000).nullable().optional(),
});

export type ProposalIntakeResponse = z.infer<
  typeof proposalIntakeResponseSchema
>;

export const isProposalResponse = (value: unknown): value is ProposalResponse => {
  if (!value || typeof value !== "object") {
    return false;
  }

  const candidate = value as Partial<ProposalResponse>;
  return (
    (candidate.status === "accepted" || candidate.status === "failed") &&
    typeof candidate.reference === "string" &&
    typeof candidate.safeSummary === "string" &&
    (candidate.safeError === null || typeof candidate.safeError === "string") &&
    (candidate.delivery === undefined ||
      candidate.delivery === "fondation" ||
      candidate.delivery === "local_backup")
  );
};
