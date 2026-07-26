import type { Metadata } from "next";
import Link from "next/link";

import { AvailabilityBadge } from "../_components/AvailabilityBadge";
import { MarketingCta } from "../_components/MarketingCta";
import {
  availabilityLabels,
  modules,
  type AvailabilityCode,
} from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Modules ERP construction",
  description:
    "Explorez les modules ProJD pour les projets, la finance, les contrats, l’estimation, les partenaires, les factures et les rapports.",
  alternates: {
    canonical: "/modules",
  },
};

const availabilityOrder = [
  "available",
  "evolving",
  "activation",
] satisfies AvailabilityCode[];

const availabilityDescriptions = {
  available: "Flux démontrable dans le produit actuel.",
  evolving: "Premier périmètre disponible, fonctions additionnelles en cours.",
  activation: "Dépend des accès, licences ou permissions du client.",
} satisfies Record<AvailabilityCode, string>;

export default function ModulesPage() {
  return (
    <main id="contenu">
      <section className="page-hero centered-page-hero">
        <p className="eyebrow">Modules ProJD</p>
        <h1>Choisissez un flux métier, pas une liste de promesses.</h1>
        <p>
          Chaque module affiche son état réel. Vous voyez ce qui est
          démontrable aujourd&apos;hui, ce qui évolue et ce qui demande une
          activation spécifique.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/demo">
            Voir le produit
          </Link>
          <Link className="button secondary" href="/solutions">
            Choisir par équipe
          </Link>
        </div>
      </section>

      <section className="compact-section catalog-section">
        {availabilityOrder.map((availability) => {
          const matchingModules = modules.filter(
            (module) => module.availability === availability,
          );

          if (matchingModules.length === 0) {
            return null;
          }

          return (
            <div className="catalog-group" key={availability}>
              <div className="catalog-group-heading">
                <div>
                  <AvailabilityBadge availability={availability} />
                  <h2>{availabilityLabels[availability]}</h2>
                </div>
                <p>{availabilityDescriptions[availability]}</p>
              </div>
              <div className="module-catalog-grid">
                {matchingModules.map((module) => (
                  <Link
                    className="module-catalog-card"
                    href={`/modules/${module.slug}`}
                    key={module.slug}
                  >
                    <span className="module-code">{module.code}</span>
                    <div>
                      <small>{module.eyebrow}</small>
                      <h3>{module.name}</h3>
                      <p>{module.text}</p>
                    </div>
                    <strong>
                      Détails <span aria-hidden="true">→</span>
                    </strong>
                  </Link>
                ))}
              </div>
            </div>
          );
        })}
      </section>

      <MarketingCta
        title="Composer un périmètre ProJD réaliste."
        text="Sélectionnez une équipe pilote, les modules prioritaires et les intégrations à évaluer. Le déploiement se fait ensuite par étapes vérifiables."
        primaryHref="/commander"
        primaryLabel="Configurer les modules"
        secondaryHref="/documentation"
        secondaryLabel="Lire la documentation"
      />
    </main>
  );
}
