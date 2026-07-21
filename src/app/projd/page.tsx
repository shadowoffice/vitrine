import Link from "next/link";

import { ErpPreview } from "../_components/ErpPreview";
import { MarketingCta } from "../_components/MarketingCta";
import { SiteHeader } from "../_components/SiteHeader";
import { demoErpUrl, integrations, modules } from "@/lib/site-content";

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
        <h1>ProJD</h1>
        <p>
          ProJD est le tenant ERP construction: projets, budgets, estimation, appels d’offres,
          factures, documents et rapports dans une couche contrôlée par l’entreprise.
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

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Modules ProJD</p>
          <h2>Les blocs qui forment le coeur de l’ERP.</h2>
        </div>
        <div className="module-grid">
          {modules.slice(1, 6).map((module) => (
            <Link key={module.name} href="/modules">
              <strong>{module.name}</strong>
              <span>{module.text}</span>
            </Link>
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
        title="Acheter ProJD pour un premier tenant"
        text="La démo publique donne un aperçu immédiat. Le formulaire d'achat sert ensuite à créer le dossier, choisir le forfait et réserver le sous-domaine."
        primaryHref={demoErpUrl}
        primaryLabel="Visiter la démo publique"
        secondaryHref="/commander"
        secondaryLabel="Acheter ProJD"
      />
    </main>
  );
}
