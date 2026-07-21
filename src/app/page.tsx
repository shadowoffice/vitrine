import Link from "next/link";

import { ErpPreview } from "./_components/ErpPreview";
import { MarketingCta } from "./_components/MarketingCta";
import { ProductShowcaseSlider } from "./_components/ProductShowcaseSlider";
import { SiteHeader } from "./_components/SiteHeader";
import {
  decisionCards,
  demoErpUrl,
  faqItems,
  indicators,
  integrations,
  mainMessage,
  modules,
  packages,
  salesPainPoints,
  securityItems,
  workflow,
} from "@/lib/site-content";

export default function Home() {
  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Acheter ProJD" />

      <section className="sales-hero" aria-labelledby="hero-title">
        <div className="hero-product-scene" aria-hidden="true">
          <div className="workspace-window workspace-window-main">
            <div className="workspace-topbar">
              <span>ProJD</span>
              <strong>Projet Centre-ville</strong>
            </div>
            <div className="workspace-metrics">
              <span className="metric-fill-1"></span>
              <span className="metric-fill-2"></span>
              <span className="metric-fill-3"></span>
            </div>
            <div className="workspace-table">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="workspace-window workspace-window-side">
            <span className="pipeline-chip ready">Budget suivi</span>
            <span className="pipeline-chip warning">7 factures à valider</span>
            <span className="pipeline-chip active">24 soumissions</span>
          </div>
        </div>

        <div className="hero-content">
          <p className="eyebrow">ERP construction Québec</p>
          <h1 id="hero-title">ProJD ERP construction</h1>
          <p className="hero-lead">{mainMessage}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/commander">
              Acheter ProJD
            </Link>
            <Link className="button secondary" href={demoErpUrl}>
              Visiter la démo
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
          <p className="eyebrow">Pourquoi ProJD</p>
          <h2>Un ERP pour arrêter de gérer les chantiers dans dix outils séparés.</h2>
          <p>
            ProJD met les coûts, soumissions, documents, factures et partenaires dans un
            environnement pensé pour la construction. L’objectif est simple: savoir où va l’argent,
            ce qui bloque et quoi relancer.
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

      <section className="section product-showcase-section">
        <div className="section-heading">
          <p className="eyebrow">Vue produit</p>
          <h2>Un slider vivant pour montrer ce que ProJD rend visible.</h2>
          <p>
            Chaque module ramène une partie critique du chantier dans le même fil: budget,
            soumissions, factures, documents et décisions.
          </p>
        </div>
        <ProductShowcaseSlider />
      </section>

      <section className="section preview-section" aria-labelledby="preview-title">
        <div className="section-heading">
          <p className="eyebrow">Tableau de bord</p>
          <h2 id="preview-title">Une lecture concrète du projet, pas une promesse abstraite.</h2>
          <p>
            L’interface montre les budgets engagés, les lots BID actifs, les factures à valider et
            les documents importants au même endroit.
          </p>
        </div>
        <ErpPreview />
        <div className="section-actions">
          <Link className="button primary" href={demoErpUrl}>
            Ouvrir la démo
          </Link>
          <Link className="button secondary" href="/modules">
            Voir les modules
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Pour chaque équipe</p>
          <h2>La même information utile, adaptée au rôle de chacun.</h2>
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

      <section id="modules" className="section">
        <div className="section-heading">
          <p className="eyebrow">Modules</p>
          <h2>Les blocs essentiels pour un ERP construction qui suit le vrai travail.</h2>
        </div>
        <div className="module-grid">
          {modules.map((module) => (
            <Link key={module.name} href="/modules">
              <strong>{module.name}</strong>
              <span>{module.text}</span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section workflow-section">
        <div className="section-heading">
          <p className="eyebrow">Implantation</p>
          <h2>Une mise en route progressive, sans tout casser d’un coup.</h2>
        </div>
        <ol className="workflow-list">
          {workflow.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section id="forfaits" className="section">
        <div className="section-heading">
          <p className="eyebrow">Forfaits</p>
          <h2>Un point de départ clair pour vendre et implanter ProJD.</h2>
        </div>
        <div className="pricing-grid">
          {packages.map((plan) => (
            <article className={plan.featured ? "card pricing-card featured" : "card pricing-card"} key={plan.name}>
              <p>{plan.name}</p>
              <h3>{plan.price}</h3>
              <small>{plan.setup}</small>
              <span>{plan.description}</span>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className="button secondary" href={`/commander?plan=${plan.code}`}>
                Choisir ce forfait
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section two-column-section">
        <div>
          <p className="eyebrow">Intégrations</p>
          <h2>ProJD cohabite avec les outils déjà utilisés par l’équipe.</h2>
          <div className="stack-list">
            {integrations.map((integration) => (
              <article className="card" key={integration.name}>
                <h3>{integration.name}</h3>
                <p>{integration.text}</p>
              </article>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">Contrôle</p>
          <h2>Des accès et validations qui respectent les données sensibles.</h2>
          <ul className="check-list">
            {securityItems.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section two-column-section">
        <div>
          <p className="eyebrow">FAQ</p>
          <h2>Les objections commerciales qui arrivent vite.</h2>
          <div className="faq-list">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
        <div className="closing-panel">
          <p className="eyebrow">Démo</p>
          <h2>Voir ProJD avant de choisir le forfait.</h2>
          <p>
            La démo publique donne une première lecture du produit. Le formulaire d’achat sert
            ensuite à cadrer le forfait, les utilisateurs et le premier espace de travail.
          </p>
          <div className="section-actions">
            <Link className="button primary" href={demoErpUrl}>
              Visiter la démo
            </Link>
            <Link className="button secondary" href="/commander">
              Acheter ProJD
            </Link>
          </div>
        </div>
      </section>

      <MarketingCta
        title="Prêt à vendre et implanter ProJD?"
        text="Choisis un forfait, indique le nombre d'utilisateurs et prépare le premier environnement de travail pour ton équipe."
        primaryHref="/commander"
        primaryLabel="Acheter ProJD"
        secondaryHref={demoErpUrl}
        secondaryLabel="Visiter la démo"
      />
    </main>
  );
}
