import Link from "next/link";

import { ErpPreview } from "./_components/ErpPreview";
import { MarketingCta } from "./_components/MarketingCta";
import { SiteHeader } from "./_components/SiteHeader";
import {
  faqItems,
  demoErpUrl,
  indicators,
  integrations,
  mainMessage,
  modules,
  packages,
  productPillars,
  securityItems,
  statusTargets,
  workflow,
  whyFichero,
} from "@/lib/site-content";

export default function Home() {
  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Acheter ProJD" />

      <section id="top" className="hero" aria-labelledby="hero-title">
        <div className="hero-scene" aria-hidden="true">
          <div className="scene-board scene-board-main">
            <div className="scene-topline">
              <span>Fondation</span>
              <strong>Command Center</strong>
            </div>
            <div className="scene-grid">
              <span className="scene-stat strong"></span>
              <span className="scene-stat"></span>
              <span className="scene-stat accent"></span>
              <span className="scene-stat wide"></span>
            </div>
            <div className="scene-table">
              <span></span>
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
          <div className="scene-board scene-board-side">
            <span className="scene-chip green">erp.client-1</span>
            <span className="scene-chip amber">tls actif</span>
            <span className="scene-chip red">audit</span>
          </div>
        </div>

        <div className="hero-content">
          <p className="eyebrow">ERP construction Québec</p>
          <h1 id="hero-title">Fichero</h1>
          <p className="hero-lead">{mainMessage}</p>
          <div className="hero-actions">
            <Link className="button primary" href="/commander">
              Acheter ProJD
            </Link>
            <Link className="button secondary" href={demoErpUrl}>
              Visiter la démo ERP
            </Link>
          </div>
        </div>
      </section>

      <section id="plateforme" className="signal-strip" aria-label="Indicateurs Fichero">
        {indicators.map((indicator) => (
          <article key={indicator.label}>
            <strong>{indicator.value}</strong>
            <span>{indicator.label}</span>
          </article>
        ))}
      </section>

      <section className="section split-section">
        <div>
          <p className="eyebrow">Pourquoi Fichero</p>
          <h2>Une vitrine qui mène vers une vraie opération SaaS.</h2>
          <p>
            Fichero ne sert pas seulement à être joli. Le site présente l’offre, qualifie l’achat,
            ouvre un dossier exploitable et garde le fil avec Fondation avant l’activation d’un
            tenant ProJD payé.
          </p>
        </div>
        <div className="pillar-grid why-grid">
          {whyFichero.map((item) => (
            <article className="card" key={item.title}>
              <h3>{item.title}</h3>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section preview-section" aria-labelledby="preview-title">
        <div className="section-heading">
          <p className="eyebrow">Maquette ERP</p>
          <h2 id="preview-title">Une première vue concrète du tableau de bord ProJD.</h2>
          <p>
            La vitrine montre le type d’expérience attendue: coûts par division, suivi BID,
            documents, factures et intégrations autour d’un projet de construction.
          </p>
        </div>
        <ErpPreview />
        <div className="section-actions">
          <Link className="button primary" href={demoErpUrl}>
            Ouvrir la démo publique
          </Link>
          <Link className="button secondary" href="/projd">
            Voir ProJD
          </Link>
        </div>
      </section>

      <section className="section split-section">
        <div>
          <p className="eyebrow">Architecture claire</p>
          <h2>La bonne app au bon endroit.</h2>
          <p>
            Fichero vend et qualifie. Fondation contrôle les clients, domaines et opérations.
            ProJD exécute les workflows ERP dans les tenants dédiés.
          </p>
        </div>
        <div className="pillar-grid">
          {productPillars.map((pillar) => (
            <Link className="card link-card" href={pillar.href} key={pillar.title}>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <section id="modules" className="section">
        <div className="section-heading">
          <p className="eyebrow">Modules</p>
          <h2>Une suite conçue pour suivre les opérations, pas seulement les fichiers.</h2>
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
          <p className="eyebrow">Déploiement</p>
          <h2>Du premier contact à l’instance ERP active.</h2>
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
          <h2>Un positionnement simple pour démarrer les conversations commerciales.</h2>
        </div>
        <div className="pricing-grid">
          {packages.map((plan) => (
            <article className={plan.featured ? "card pricing-card featured" : "card pricing-card"} key={plan.name}>
              <p>{plan.name}</p>
              <h3>{plan.price}</h3>
              <span>{plan.description}</span>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <div className="section-actions">
          <Link className="button primary" href="/tarifs">
            Voir les forfaits
          </Link>
          <Link className="button secondary" href="/commander">
            Acheter le logiciel
          </Link>
        </div>
      </section>

      <section className="section two-column-section">
        <div>
          <p className="eyebrow">Intégrations</p>
          <h2>Procore, SharePoint et Outlook restent connectés au workflow.</h2>
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
          <p className="eyebrow">Sécurité</p>
          <h2>Des promesses sobres, vérifiables et auditables.</h2>
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
          <h2>Les questions commerciales qui reviennent vite.</h2>
          <div className="faq-list">
            {faqItems.map((item) => (
              <details key={item.question}>
                <summary>{item.question}</summary>
                <p>{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
        <div>
          <p className="eyebrow">Statut</p>
          <h2>Des points d’entrée simples pour vérifier l’écosystème.</h2>
          <div className="status-grid compact">
            {statusTargets.map((target) => (
              <a href={target.href} key={target.label}>
                <span>{target.status}</span>
                <strong>{target.label}</strong>
                <small>{target.detail}</small>
              </a>
            ))}
          </div>
        </div>
      </section>

      <MarketingCta
        title="Acheter ProJD et créer le tenant"
        text="Le formulaire d'achat peut être transmis à Fondation ou gardé en sauvegarde locale si l'intégration n'est pas encore configurée."
        primaryHref={demoErpUrl}
        primaryLabel="Visiter la démo publique"
        secondaryHref="/commander"
        secondaryLabel="Acheter ProJD"
      />
    </main>
  );
}
