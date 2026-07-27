import type { Metadata } from "next";
import Link from "next/link";

import {
  getProposalConfigurationIssues,
  getServerEnv,
} from "@/lib/server/env";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Confidentialité",
  description:
    "Résumé transparent des données utilisées par la vitrine ProJD, son analytique sans cookie et son formulaire de configuration.",
  alternates: {
    canonical: "/confidentialite",
  },
};

type ProposalDisclosure =
  | { status: "disabled" | "misconfigured" }
  | {
      status: "enabled";
      officerName: string;
      contactEmail: string;
      retentionDays: number;
    };

const proposalDisclosure = (): ProposalDisclosure => {
  try {
    const env = getServerEnv();
    if (!env.enableProposals) {
      return { status: "disabled" };
    }
    if (
      getProposalConfigurationIssues(env).length > 0 ||
      !env.privacyOfficerName ||
      !env.privacyContactEmail ||
      env.proposalRetentionDays === null
    ) {
      return { status: "misconfigured" };
    }
    return {
      status: "enabled",
      officerName: env.privacyOfficerName,
      contactEmail: env.privacyContactEmail,
      retentionDays: env.proposalRetentionDays,
    };
  } catch {
    return { status: "misconfigured" };
  }
};

export default function PrivacyPage() {
  const disclosure = proposalDisclosure();
  const collectionEnabled = disclosure.status === "enabled";
  const privacySections = [
    {
      code: "01",
      title: "Mesure d’audience",
      text: "La vitrine utilise une mesure first-party sans cookie et sans identifiant visiteur. L’application ne conserve pas l’adresse IP dans les événements analytiques.",
    },
    {
      code: "02",
      title: "Demande de proposition",
      text: collectionEnabled
        ? "La collecte est activée. Le formulaire demande uniquement le contexte commercial, l’entreprise, le nom, le courriel, le téléphone facultatif et le consentement de contact; il ne demande aucune donnée de paiement."
        : disclosure.status === "misconfigured"
          ? "Une activation a été demandée, mais la configuration de confidentialité ou de livraison est incomplète. Le formulaire demeure fermé et l’API refuse toute proposition."
          : "La collecte des propositions est désactivée. Le formulaire est fermé et l’API refuse les données sans les enregistrer ni les transmettre à Fondation.",
    },
    {
      code: "03",
      title: "Livraison et secours",
      text: collectionEnabled
        ? "Les propositions sont transmises à l’endpoint Fondation autorisé. Une file locale restreinte peut servir de secours si ce service devient temporairement indisponible."
        : "Aucune proposition n’est ajoutée à la file locale et aucun appel Fondation n’est effectué pendant la fermeture.",
    },
    {
      code: "04",
      title: "Responsabilité et conservation",
      text: collectionEnabled
        ? `Le responsable officiel configuré est ${disclosure.officerName}. La durée déclarée pour les propositions est de ${disclosure.retentionDays} jours; les procédures d’exploitation doivent appliquer cette purge aux données et sauvegardes.`
        : "Aucun nom, contact ni délai provisoire n’est publié comme politique officielle. Ces valeurs doivent être confirmées avant toute réouverture.",
    },
  ] as const;

  return (
    <main id="contenu">
      <section className="page-hero policy-hero">
        <p className="eyebrow">Confidentialité</p>
        <h1>Ce que la vitrine recueille — et pourquoi.</h1>
        <p>
          Cette page décrit le fonctionnement technique actuel de fichero.cloud.
          Elle ne remplace pas les clauses contractuelles applicables à une
          instance ProJD cliente.
        </p>
      </section>

      <section className="compact-section policy-grid">
        {privacySections.map((section) => (
          <article key={section.code}>
            <span>{section.code}</span>
            <div>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="compact-section policy-action">
        <div>
          <p className="eyebrow">
            {collectionEnabled ? "Contact officiel" : "Collecte fermée"}
          </p>
          <h2>
            {collectionEnabled
              ? disclosure.officerName
              : "Aucun renseignement n’est accepté par le formulaire."}
          </h2>
          <p>
            {collectionEnabled
              ? "Pour une demande d’accès, de rectification ou de suppression liée à une proposition, utilisez le contact de confidentialité configuré."
              : "Le formulaire sera offert seulement après confirmation des responsabilités, du contact, de la conservation et de la livraison sécurisée."}
          </p>
        </div>
        {collectionEnabled ? (
          <a
            className="button primary"
            href={`mailto:${disclosure.contactEmail}`}
          >
            {disclosure.contactEmail}
          </a>
        ) : (
          <Link className="button secondary" href="/securite">
            Voir les mesures de sécurité
          </Link>
        )}
      </section>
    </main>
  );
}
