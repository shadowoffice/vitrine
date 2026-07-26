import type { Metadata } from "next";
import Link from "next/link";

import { MarketingCta } from "../_components/MarketingCta";
import { guides, resourceCards } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Ressources",
  description:
    "Documentation, guides pratiques, sécurité et démo pour comprendre et évaluer l’ERP construction ProJD.",
  alternates: {
    canonical: "/ressources",
  },
};

export default function ResourcesPage() {
  return (
    <main id="contenu">
      <section className="page-hero centered-page-hero">
        <p className="eyebrow">Centre de ressources</p>
        <h1>Comprendre ProJD sans parcourir une page interminable.</h1>
        <p>
          Choisissez le niveau de détail dont vous avez besoin : vue produit,
          documentation fonctionnelle, guide étape par étape ou environnement
          de démonstration.
        </p>
      </section>

      <section className="compact-section resource-grid-section">
        <div className="resource-grid">
          {resourceCards.map((resource) => (
            <Link className="resource-card" href={resource.href} key={resource.code}>
              <span>{resource.code}</span>
              <div>
                <h2>{resource.title}</h2>
                <p>{resource.text}</p>
                <strong>
                  {resource.action} <span aria-hidden="true">→</span>
                </strong>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="compact-section featured-guides-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Guides recommandés</p>
            <h2>Commencer par une tâche concrète.</h2>
          </div>
          <Link className="text-link" href="/guides">
            Tous les guides <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="guide-card-grid">
          {guides.slice(0, 3).map((guide) => (
            <Link href={`/guides/${guide.slug}`} key={guide.slug}>
              <div>
                <span>{guide.code}</span>
                <small>{guide.duration}</small>
              </div>
              <h3>{guide.title}</h3>
              <p>{guide.summary}</p>
              <strong>
                Lire le guide <span aria-hidden="true">→</span>
              </strong>
            </Link>
          ))}
        </div>
      </section>

      <MarketingCta
        eyebrow="Évaluation"
        title="Besoin de voir le produit plutôt que de lire?"
        text="La page Démo prépare un parcours court autour des projets, de la finance et des appels d’offres avant d’ouvrir l’environnement fictif."
        primaryHref="/demo"
        primaryLabel="Préparer la démo"
        secondaryHref="/projd"
        secondaryLabel="Voir la présentation"
      />
    </main>
  );
}
