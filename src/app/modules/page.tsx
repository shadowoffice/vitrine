import type { Metadata } from "next";
import Link from "next/link";

import { AvailabilityBadge } from "../_components/AvailabilityBadge";
import { ContentFilter } from "../_components/ContentFilter";
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
  openGraph: {
    title: "Modules ERP construction ProJD",
    description:
      "Filtrez les modules ProJD par workflow et état réel de disponibilité.",
    url: "/modules",
    type: "website",
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
        <div className="availability-legend" aria-label="États des modules">
          {availabilityOrder.map((availability) => (
            <div key={availability}>
              <AvailabilityBadge availability={availability} />
              <p>{availabilityDescriptions[availability]}</p>
            </div>
          ))}
        </div>
        <ContentFilter
          emptyMessage="Aucun module ne correspond à cette recherche."
          items={modules.map((module) => ({
            category: availabilityLabels[module.availability],
            code: module.code,
            description: module.text,
            href: `/modules/${module.slug}`,
            meta: `${module.eyebrow} · ${module.availabilityNote}`,
            title: module.name,
          }))}
          label="Rechercher un module"
          placeholder="Ex. budget, documents ou appels d’offres"
        />
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
