import type { Metadata } from "next";
import Link from "next/link";

import { AvailabilityBadge } from "../_components/AvailabilityBadge";
import { ErpPreview } from "../_components/ErpPreview";
import { MarketingCta } from "../_components/MarketingCta";
import {
  getFeaturedModules,
  integrations,
} from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Présentation de l’ERP",
  description:
    "Découvrez comment ProJD relie gestion de projets, finance construction, contrats, appels d’offres, partenaires et rapports.",
  alternates: {
    canonical: "/projd",
  },
};

const operatingPrinciples = [
  {
    code: "01",
    title: "Le projet reste le pivot",
    text: "Les coûts, contrats, actions, documents et partenaires gardent le même contexte chantier.",
  },
  {
    code: "02",
    title: "Le serveur garde l’autorité",
    text: "Les totaux financiers, changements d’état et accès externes ne dépendent jamais du navigateur.",
  },
  {
    code: "03",
    title: "Les connecteurs restent des sources",
    text: "Procore et SharePoint peuvent alimenter ProJD sans devenir des miroirs incontrôlés.",
  },
] as const;

const workflow = [
  "Structurer le projet",
  "Charger le budget",
  "Coordonner les partenaires",
  "Suivre les coûts et actions",
  "Produire les rapports",
] as const;

export default function ProjdPage() {
  const featuredModules = getFeaturedModules();

  return (
    <main id="contenu">
      <section className="page-hero product-page-hero">
        <div className="page-hero-copy">
          <p className="eyebrow">Présentation du produit</p>
          <h1>L’ERP qui relie le bureau au chantier.</h1>
          <p>
            ProJD rassemble projets, budgets, contrats, fournisseurs, appels
            d&apos;offres et actions ouvertes dans une lecture adaptée aux
            entrepreneurs québécois.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/demo">
              Préparer une démo
            </Link>
            <Link className="button secondary" href="/modules">
              Voir les modules
            </Link>
          </div>
          <div className="hero-fact-row" aria-label="Positionnement produit">
            <span>Implantation accompagnée</span>
            <span>Données de démo fictives</span>
            <span>Évolution par périmètre</span>
          </div>
        </div>
        <ErpPreview />
      </section>

      <section className="compact-section principle-section">
        <div className="section-intro narrow">
          <p className="eyebrow">Architecture métier</p>
          <h2>Un environnement cohérent, pas une collection d’écrans.</h2>
        </div>
        <div className="principle-grid">
          {operatingPrinciples.map((principle) => (
            <article key={principle.code}>
              <span>{principle.code}</span>
              <h3>{principle.title}</h3>
              <p>{principle.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="compact-section module-proof-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Périmètre démontrable</p>
            <h2>Les flux les plus solides de ProJD.</h2>
          </div>
          <Link className="text-link" href="/modules">
            Catalogue complet <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="module-proof-grid">
          {featuredModules.map((module) => (
            <Link href={`/modules/${module.slug}`} key={module.slug}>
              <span className="module-code">{module.code}</span>
              <div>
                <AvailabilityBadge
                  availability={module.availability}
                  note={module.availabilityNote}
                />
                <h3>{module.name}</h3>
                <p>{module.text}</p>
              </div>
              <small aria-hidden="true">↗</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="compact-section workflow-section">
        <div className="section-intro">
          <p className="eyebrow">Boucle de travail</p>
          <h2>Du premier projet au rapport de direction.</h2>
        </div>
        <ol className="workflow-rail">
          {workflow.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="compact-section integration-section">
        <div className="section-intro narrow">
          <p className="eyebrow">Écosystème</p>
          <h2>Connecter ce qui mérite de l’être.</h2>
          <p>
            Chaque intégration dépend des accès du client, d’un périmètre
            confirmé et d’un test avant activation.
          </p>
        </div>
        <div className="integration-grid">
          {integrations.map((integration) => (
            <article key={integration.code}>
              <span>{integration.code}</span>
              <small>{integration.status}</small>
              <h3>{integration.name}</h3>
              <p>{integration.text}</p>
            </article>
          ))}
        </div>
      </section>

      <MarketingCta
        title="Commencer avec un périmètre qui se mesure."
        text="Un projet pilote, une équipe responsable et un flux prioritaire suffisent pour évaluer ProJD sans bouleverser toutes vos opérations."
        primaryHref="/commander"
        primaryLabel="Configurer une proposition"
        secondaryHref="/documentation"
        secondaryLabel="Lire la documentation"
      />
    </main>
  );
}
