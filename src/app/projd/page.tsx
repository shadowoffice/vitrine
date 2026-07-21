import Link from "next/link";

import { ErpPreview } from "../_components/ErpPreview";
import { MarketingCta } from "../_components/MarketingCta";
import { ProductShowcaseSlider } from "../_components/ProductShowcaseSlider";
import { SiteHeader } from "../_components/SiteHeader";
import { demoErpUrl, decisionCards, integrations, modules } from "@/lib/site-content";

export const metadata = {
  title: "ProJD",
  description: "ERP construction pour projets, budgets, soumissions, factures, documents et rapports.",
};

const productHighlights = [
  "Suivi projet, budget, engagements et coûts réels.",
  "Assistant BID pour sélectionner, inviter, relancer et suivre les partenaires.",
  "Documents Procore et SharePoint avec politiques de synchronisation.",
  "Factures et OCR avec validation humaine avant posting.",
];

export default function ProjdPage() {
  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Acheter ProJD" />

      <section className="page-hero">
        <p className="eyebrow">Produit ERP</p>
        <h1>ProJD pour la construction</h1>
        <p>
          ProJD rassemble projets, budgets, estimation, appels d’offres, factures, documents et
          rapports dans une interface pensée pour les entrepreneurs québécois.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href={demoErpUrl}>
            Visiter la démo publique
          </Link>
          <Link className="button secondary" href="/modules">
            Voir les modules
          </Link>
        </div>
      </section>

      <section className="section two-column-section">
        <div>
          <p className="eyebrow">Workflow métier</p>
          <h2>Un ERP conçu autour du cycle construction.</h2>
          <ul className="check-list">
            {productHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <ErpPreview />
      </section>

      <section className="section product-showcase-section">
        <div className="section-heading">
          <p className="eyebrow">Modules animés</p>
          <h2>Voir les informations qui changent vraiment la gestion d’un chantier.</h2>
        </div>
        <ProductShowcaseSlider />
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Modules ProJD</p>
          <h2>Les blocs qui forment le coeur de l’ERP.</h2>
        </div>
        <div className="module-grid">
          {modules.slice(0, 6).map((module) => (
            <Link key={module.slug} href={`/modules/${module.slug}`}>
              <strong>{module.name}</strong>
              <span>{module.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Équipes</p>
          <h2>Une même base de données, plusieurs lectures métier.</h2>
        </div>
        <div className="decision-grid">
          {decisionCards.map((card) => (
            <article className="card decision-card" key={card.title}>
              <span>{card.title}</span>
              <p>{card.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Connecteurs</p>
          <h2>ProJD dialogue avec les outils déjà présents.</h2>
        </div>
        <div className="pillar-grid">
          {integrations.map((integration) => (
            <article className="card" key={integration.name}>
              <h3>{integration.name}</h3>
              <p>{integration.text}</p>
            </article>
          ))}
        </div>
      </section>

      <MarketingCta
        title="Acheter ProJD pour une première équipe"
        text="La démo publique donne un aperçu immédiat. Le formulaire d'achat sert ensuite à choisir le forfait, le nombre d'utilisateurs et le contexte projet."
        primaryHref={demoErpUrl}
        primaryLabel="Visiter la démo publique"
        secondaryHref="/commander"
        secondaryLabel="Acheter ProJD"
      />
    </main>
  );
}
