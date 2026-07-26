import type { Metadata } from "next";
import Link from "next/link";

import { ProposalForm } from "./ProposalForm";

export const metadata: Metadata = {
  title: "Configurer une proposition",
  description:
    "Préparez une proposition ProJD autour de votre équipe, de votre priorité métier et de vos outils actuels.",
  alternates: {
    canonical: "/commander",
  },
};

type ProposalPageProps = {
  searchParams?: Promise<{
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

export default async function ProposalPage({
  searchParams,
}: ProposalPageProps) {
  const params = searchParams ? await searchParams : {};
  const initialPlanCode = firstQueryValue(params.plan);

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
            Une proposition est déjà approuvée?{" "}
            <Link href={`/commander/achat${initialPlanCode ? `?plan=${initialPlanCode}` : ""}`}>
              Finaliser la commande
            </Link>
          </p>
        </div>
        <ProposalForm initialPlanCode={initialPlanCode} />
      </section>
    </main>
  );
}
