import type { Metadata } from "next";

import { ContentFilter } from "../_components/ContentFilter";
import { MarketingCta } from "../_components/MarketingCta";
import { guides } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Guides pratiques",
  description:
    "Guides courts pour démarrer un projet, lancer un appel d’offres, suivre un budget et traiter une facture dans ProJD.",
  alternates: {
    canonical: "/guides",
  },
  openGraph: {
    title: "Guides pratiques ProJD",
    description:
      "Douze parcours concrets pour les projets, budgets, contrats, appels d’offres, intégrations et factures.",
    url: "/guides",
    type: "website",
  },
};

export default function GuidesPage() {
  return (
    <main id="contenu">
      <section className="page-hero centered-page-hero">
        <p className="eyebrow">Guides pratiques</p>
        <h1>Une tâche. Quelques étapes. Un résultat vérifiable.</h1>
        <p>
          Les guides ProJD restent courts et indiquent les contrôles importants
          plutôt que de reproduire chaque écran du produit.
        </p>
      </section>

      <section className="compact-section guide-index-section">
        <ContentFilter
          emptyMessage="Aucun guide ne correspond à cette recherche."
          items={guides.map((guide) => ({
            category: guide.category,
            code: guide.code,
            description: guide.summary,
            href: `/guides/${guide.slug}`,
            meta: `${guide.duration} · ${guide.audience}`,
            title: guide.title,
          }))}
          label="Rechercher un guide"
          placeholder="Ex. budget, intégration ou portail"
        />
      </section>

      <MarketingCta
        title="Voir ces workflows dans un environnement ProJD."
        text="La démo distincte utilise des données fictives et permet de reconnaître les écrans décrits dans les guides."
        primaryHref="/demo"
        primaryLabel="Préparer la démo"
        secondaryHref="/documentation"
        secondaryLabel="Documentation générale"
      />
    </main>
  );
}
