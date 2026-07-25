import Link from "next/link";

import { ErpPreview } from "../_components/ErpPreview";
import { MarketingCta } from "../_components/MarketingCta";
import { ProductShowcaseSlider } from "../_components/ProductShowcaseSlider";
import { SiteHeader } from "../_components/SiteHeader";
import {
  decisionCards,
  demoErpUrl,
  deploymentSteps,
  integrations,
  modules,
  salesCapabilities,
} from "@/lib/site-content";

export const metadata = {
  title: "ProJD",
  description: "ERP construction pour projets, budgets, soumissions, factures, documents et rapports.",
};

const productHighlights = [
  "Suivi projet, budget, engagements, documents, demandes et coûts réels.",
  "Appels d'offres avec lots, invitations, relances et réponses sous-traitants.",
  "Portail collaboratif pour partager documents, statuts, fichiers et suivis.",
  "API et instance ProJD Docker isolée pour chaque compagnie cliente.",
];

export default function ProjdPage() {
  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Commander ProJD" />

      <section className="page-hero">
        <p className="eyebrow">Produit ERP SaaS</p>
        <h1>Vendre ProJD aux compagnies de construction</h1>
        <p>
          ProJD rassemble projets, suivis, budgets, appels d&apos;offres, sous-traitants, portail,
          documents, factures, API et instance dédiée dans une offre claire pour les entrepreneurs
          québécois.
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
          <p className="eyebrow">Offre commerciale</p>
          <h2>Une plateforme de travail pour projets et partenaires.</h2>
          <ul className="check-list">
            {productHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <ErpPreview />
      </section>

      <section className="section capability-section">
        <div className="section-heading">
          <p className="eyebrow">Fonctions à vendre</p>
          <h2>Tout ce qu&apos;une compagnie veut voir avant d&apos;acheter.</h2>
          <p>
            Le discours doit montrer la valeur terrain: collaborer avec les sous-traitants,
            garder les documents au bon endroit, suivre les projets et connecter l&apos;ERP aux outils
            existants.
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
          <h2>Les blocs qui forment le coeur de l&apos;ERP.</h2>
        </div>
        <div className="module-grid">
          {modules.slice(0, 8).map((module) => (
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
          <h2>Un ERP interne, un portail externe, des accès contrôlés.</h2>
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

      <section className="section deployment-section">
        <div className="section-heading">
          <p className="eyebrow">Déploiement</p>
          <h2>Chaque vente devient une instance ProJD préparée par Fondation.</h2>
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
        title="Commander une instance ProJD"
        text="La démo publique donne un aperçu immédiat. Le formulaire d'achat sert ensuite à choisir le forfait, les utilisateurs, les modules, le portail et le contexte de déploiement."
        primaryHref={demoErpUrl}
        primaryLabel="Visiter la démo publique"
        secondaryHref="/commander"
        secondaryLabel="Commander ProJD"
      />
    </main>
  );
}
