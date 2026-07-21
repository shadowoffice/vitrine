import Link from "next/link";

import { MarketingCta } from "./_components/MarketingCta";
import { ProductShowcaseSlider } from "./_components/ProductShowcaseSlider";
import { SiteHeader } from "./_components/SiteHeader";
import {
  constructionSignals,
  demoErpUrl,
  indicators,
  mainMessage,
  modules,
  salesPainPoints,
} from "@/lib/site-content";

const startSteps = [
  "Choisir les modules utiles au premier chantier.",
  "Préparer l’équipe, les projets et les partenaires.",
  "Activer le suivi budget, BID, factures et documents.",
];

export default function Home() {
  const featuredModules = modules.slice(0, 6);

  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Acheter ProJD" />

      <section className="sales-hero construction-hero" aria-labelledby="hero-title">
        <div className="hero-product-scene construction-site-scene" aria-hidden="true">
          <div className="site-brief-panel">
            <span>Chantier actif</span>
            <strong>Condos Saint-Laurent</strong>
            <div>
              <small>Budget engagé</small>
              <b>68 %</b>
            </div>
            <div>
              <small>Soumissions</small>
              <b>24</b>
            </div>
            <div>
              <small>Factures à valider</small>
              <b>7</b>
            </div>
          </div>
          <div className="site-safety-strip">
            <span></span>
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>

        <div className="hero-content">
          <p className="eyebrow">ERP construction pour le Québec</p>
          <h1 id="hero-title">ProJD ERP Construction</h1>
          <p className="hero-lead">{mainMessage}</p>
          <div className="construction-audience" aria-label="Publics visés">
            {constructionSignals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
          <div className="hero-actions">
            <Link className="button primary" href="/commander">
              Acheter ProJD
            </Link>
            <Link className="button secondary" href="/modules">
              Voir les modules
            </Link>
          </div>
        </div>
      </section>

      <section className="signal-strip" aria-label="Indicateurs ProJD">
        {indicators.map((indicator) => (
          <article key={indicator.label}>
            <strong>{indicator.value}</strong>
            <span>{indicator.label}</span>
          </article>
        ))}
      </section>

      <section className="section split-section">
        <div>
          <p className="eyebrow">Sur le terrain</p>
          <h2>Un ERP qui parle chantier, pas seulement administration.</h2>
          <p>
            ProJD garde l’information essentielle au même endroit: le projet, le coût, le lot, le
            fournisseur, le document et la facture. La page reste simple; le détail se trouve dans
            les pages modules.
          </p>
        </div>
        <div className="pillar-grid why-grid">
          {salesPainPoints.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="modules" className="section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Modules clés</p>
          <h2>Chaque bloc explique une partie du chantier.</h2>
          <p>
            Commence par les modules les plus utiles pour vendre, implanter et suivre le premier
            groupe projet.
          </p>
        </div>
        <div className="module-grid module-grid-featured">
          {featuredModules.map((module) => (
            <Link key={module.slug} href={`/modules/${module.slug}`}>
              <strong>{module.name}</strong>
              <span>{module.text}</span>
            </Link>
          ))}
        </div>
        <div className="section-actions">
          <Link className="button secondary" href="/modules">
            Tous les modules
          </Link>
        </div>
      </section>

      <section className="section product-showcase-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Vue produit</p>
          <h2>Un aperçu rapide des informations à surveiller.</h2>
        </div>
        <ProductShowcaseSlider />
      </section>

      <section className="section start-section">
        <div>
          <p className="eyebrow">Mise en route</p>
          <h2>Simple au départ, plus complet quand l’équipe est prête.</h2>
        </div>
        <ol className="start-list">
          {startSteps.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <MarketingCta
        title="Voir si ProJD convient à ton chantier"
        text="La démo donne une première idée du produit. Le formulaire d'achat sert ensuite à cadrer les modules, les utilisateurs et le premier projet."
        primaryHref={demoErpUrl}
        primaryLabel="Visiter la démo"
        secondaryHref="/commander"
        secondaryLabel="Acheter ProJD"
      />
    </main>
  );
}
