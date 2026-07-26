import type { Metadata } from "next";
import Link from "next/link";

import { MarketingCta } from "../_components/MarketingCta";
import { guides } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Guides pratiques",
  description:
    "Guides courts pour démarrer un projet, lancer un appel d’offres, suivre un budget et traiter une facture dans ProJD.",
  alternates: {
    canonical: "/guides",
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
        <div className="guide-index-grid">
          {guides.map((guide) => (
            <Link href={`/guides/${guide.slug}`} key={guide.slug}>
              <div className="guide-card-meta">
                <span>{guide.code}</span>
                <small>{guide.category}</small>
                <strong>{guide.duration}</strong>
              </div>
              <h2>{guide.title}</h2>
              <p>{guide.summary}</p>
              <div className="guide-audience">
                <span>Pour</span>
                <strong>{guide.audience}</strong>
              </div>
              <small className="guide-card-action">
                Lire le guide <span aria-hidden="true">→</span>
              </small>
            </Link>
          ))}
        </div>
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
