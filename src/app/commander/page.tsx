import type { Metadata } from "next";
import Link from "next/link";

import { ProposalForm } from "./ProposalForm";
import {
  getProposalConfigurationIssues,
  getServerEnv,
} from "@/lib/server/env";
import { modules } from "@/lib/site-content";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Configurer une proposition",
  description:
    "Préparez une proposition ProJD autour de votre équipe, de votre priorité métier et de vos outils actuels.",
  alternates: {
    canonical: "/commander",
  },
  openGraph: {
    title: "Configurer une proposition ProJD",
    description:
      "Choisissez un premier workflow, les modules à examiner et le contexte de votre équipe.",
    url: "/commander",
    type: "website",
  },
};

type ProposalPageProps = {
  searchParams?: Promise<{
    context?: string | string[];
    module?: string | string[];
    plan?: string | string[];
  }>;
};

const firstQueryValue = (
  value: string | string[] | undefined,
): string | undefined => (Array.isArray(value) ? value[0] : value);

const preparationPoints = [
  "Un problème métier prioritaire",
  "Une équipe et un projet pilote",
  "Les intégrations à vérifier",
] as const;

const queryValues = (value: string | string[] | undefined): string[] =>
  Array.isArray(value) ? value : value ? [value] : [];

const normalizeSourceContext = (
  value: string | undefined,
): string | undefined => {
  const normalized = value
    ?.trim()
    .replace(/[^a-zA-Z0-9:_-]/g, "-")
    .slice(0, 120);
  return normalized || undefined;
};

const configuredBookingUrl = (): string | undefined => {
  const candidate = process.env.NEXT_PUBLIC_SALES_BOOKING_URL?.trim();
  if (!candidate) {
    return undefined;
  }

  try {
    const parsed = new URL(candidate);
    return parsed.protocol === "https:" ? parsed.toString() : undefined;
  } catch {
    return undefined;
  }
};

const proposalAvailability = (): "enabled" | "disabled" | "misconfigured" => {
  try {
    const env = getServerEnv();
    if (!env.enableProposals) {
      return "disabled";
    }
    return getProposalConfigurationIssues(env).length === 0
      ? "enabled"
      : "misconfigured";
  } catch {
    return "misconfigured";
  }
};

export default async function ProposalPage({
  searchParams,
}: ProposalPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialPlanCode = firstQueryValue(params.plan);
  const requestedModuleSlugs = new Set(queryValues(params.module));
  const initialModuleSlugs = modules
    .filter((module) => requestedModuleSlugs.has(module.slug))
    .map((module) => module.slug);
  const sourceContext = normalizeSourceContext(firstQueryValue(params.context));
  const moduleOptions = modules.map((module) => ({
    slug: module.slug,
    label: module.name,
  }));
  const availability = proposalAvailability();

  return (
    <main id="contenu">
      <section className="proposal-page">
        <div className="proposal-copy">
          <p className="eyebrow">Proposition ProJD</p>
          <h1>Commencer par le bon périmètre.</h1>
          <p>
            Donnez-nous assez de contexte pour préparer une démonstration et
            une proposition cohérentes. Les renseignements fiscaux et le
            paiement viennent seulement après la qualification.
          </p>
          <ul>
            {preparationPoints.map((point) => (
              <li key={point}>{point}</li>
            ))}
          </ul>
          <div className="proposal-assurance">
            <span aria-hidden="true">✓</span>
            <p>
              <strong>Formulaire court</strong>
              Aucun numéro de taxe, adresse complète ou carte de paiement à
              cette étape.
            </p>
          </div>
          <p className="existing-offer-link">
            Une proposition est déjà approuvée? Utilisez uniquement le lien de
            commande sécurisé et expirant transmis avec votre dossier.
          </p>
        </div>
        {availability === "enabled" ? (
          <ProposalForm
            bookingUrl={configuredBookingUrl()}
            initialModuleSlugs={initialModuleSlugs}
            initialPlanCode={initialPlanCode}
            moduleOptions={moduleOptions}
            sourceContext={sourceContext}
          />
        ) : (
          <section className="proposal-success" role="status">
            <span aria-hidden="true">—</span>
            <p className="eyebrow">Collecte fermée</p>
            <h2>Le formulaire public n’accepte aucun renseignement.</h2>
            <p>
              {availability === "misconfigured"
                ? "Une activation a été demandée, mais les garanties de confidentialité ou la livraison vers Fondation sont incomplètes. Le formulaire demeure fermé."
                : "La collecte reste désactivée tant que le responsable officiel, le contact de confidentialité, la durée de conservation et l’intake Fondation ne sont pas confirmés."}
            </p>
            <Link className="text-button" href="/confidentialite">
              Voir l’état de confidentialité
            </Link>
          </section>
        )}
      </section>
    </main>
  );
}
