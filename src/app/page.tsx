import Link from "next/link";

import { MarketingCta } from "./_components/MarketingCta";
import { ProductShowcaseSlider } from "./_components/ProductShowcaseSlider";
import { SiteHeader } from "./_components/SiteHeader";
import {
  constructionSignals,
  deploymentSteps,
  demoErpUrl,
  indicators,
  mainMessage,
  modules,
  salesCapabilities,
  salesPainPoints,
} from "@/lib/site-content";

const startSteps = [
  "Qualifier la compagnie, les projets et le volume d'utilisateurs.",
  "Monter l'instance ProJD dans notre environnement.",
  "Activer portail, documents, appels d'offres, API et suivis.",
];

export default function Home() {
  const featuredModules = modules.slice(0, 6);

  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Commander ProJD" />

      <section className="sales-hero construction-hero" aria-labelledby="hero-title">
        <div className="hero-product-scene construction-site-scene" aria-hidden="true">
          <div className="site-brief-panel">
            <span>ERP client</span>
            <strong>construction-nord.erp.fichero.cloud</strong>
            <div>
              <small>Projets</small>
              <b>18</b>
            </div>
            <div>
              <small>Appels d&apos;offres</small>
              <b>24</b>
            </div>
            <div>
              <small>Portail</small>
              <b>42</b>
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
          <p className="eyebrow">ERP construction vendu comme service</p>
          <h1 id="hero-title">ProJD pour compagnies de construction</h1>
          <p className="hero-lead">{mainMessage}</p>
          <div className="construction-audience" aria-label="Publics visés">
            {constructionSignals.map((signal) => (
              <span key={signal}>{signal}</span>
            ))}
          </div>
          <div className="hero-actions">
            <Link className="button primary" href="/commander">
              Commander un ERP ProJD
            </Link>
            <Link className="button secondary" href={demoErpUrl}>
              Voir la démo ERP
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
          <p className="eyebrow">Positionnement</p>
          <h2>Une vitrine pour vendre ProJD aux entrepreneurs.</h2>
          <p>
            ProJD n&apos;est pas présenté comme un simple formulaire. C&apos;est un ERP SaaS pour gérer les
            projets, les suivis, les sous-traitants, les appels d&apos;offres, les documents et les
            intégrations d&apos;une compagnie de construction.
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

      <section className="section capability-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Ce qu&apos;on vend</p>
          <h2>Un ERP complet avec portail et environnement dédié.</h2>
          <p>
            Le message public doit montrer ce que la compagnie achète: une plateforme de travail,
            pas seulement une liste de modules.
          </p>
        </div>
        <div className="capability-grid">
          {salesCapabilities.map((capability) => (
            <article className="card capability-card" key={capability.title}>
              <h3>{capability.title}</h3>
              <p>{capability.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section id="modules" className="section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Modules clés</p>
          <h2>Les modules restent simples à comprendre.</h2>
          <p>
            Le site vend l&apos;expérience complète, puis les modules expliquent les blocs: projet,
            budget, appel d&apos;offres, portail, documents, factures et API.
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
          <p className="eyebrow">Mise en service</p>
          <h2>Chaque client obtient son ERP dans notre environnement.</h2>
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

      <section className="section deployment-section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Fondation + Docker</p>
          <h2>Du formulaire d&apos;achat à l&apos;instance ProJD prête à utiliser.</h2>
        </div>
        <div className="deployment-grid">
          {deploymentSteps.map((step, index) => (
            <article className="deployment-card" key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <p>{step}</p>
            </article>
          ))}
        </div>
      </section>

      <MarketingCta
        title="Voir si ProJD convient à ton chantier"
        text="La démo montre le produit. La commande sert à qualifier la compagnie, choisir les modules, préparer le portail et monter l'ERP ProJD du client."
        primaryHref={demoErpUrl}
        primaryLabel="Visiter la démo"
        secondaryHref="/commander"
        secondaryLabel="Commander un ERP"
      />
    </main>
  );
}
