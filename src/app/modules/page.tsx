import Link from "next/link";

import { MarketingCta } from "../_components/MarketingCta";
import { SiteHeader } from "../_components/SiteHeader";
import { modules } from "@/lib/site-content";

export const metadata = {
  title: "Modules",
  description: "Modules ProJD pour projets, budgets, soumissions, factures, documents, partenaires et rapports.",
};

export default function ModulesPage() {
  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Acheter ProJD" />

      <section className="page-hero construction-page-hero">
        <p className="eyebrow">Modules ProJD</p>
        <h1>Les blocs ERP du chantier</h1>
        <p>
          Chaque module couvre une responsabilité concrète: suivre un projet, contrôler les coûts,
          lancer un appel d’offres, classer les documents ou valider les factures.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/commander">
            Acheter ProJD
          </Link>
          <Link className="button secondary" href="/tarifs">
            Voir les forfaits
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Choisir sans se perdre</p>
          <h2>Commencer par les modules qui enlèvent le plus de friction.</h2>
          <p>
            Les pages détaillées restent courtes: problème chantier, fonctions incluses et parcours
            de mise en route.
          </p>
        </div>
        <div className="module-detail-grid">
          {modules.map((module) => (
            <Link className="card module-detail link-card module-summary-card" href={`/modules/${module.slug}`} key={module.slug}>
              <span>{module.eyebrow}</span>
              <h2>{module.name}</h2>
              <p>{module.text}</p>
              <small>Lire le module</small>
            </Link>
          ))}
        </div>
      </section>

      <MarketingCta
        title="Composer un premier périmètre ProJD"
        text="Le bon départ est souvent simple: projets, budgets, partenaires, documents et factures, puis les autres modules selon le rythme de l'équipe."
        primaryHref="/commander"
        primaryLabel="Acheter ProJD"
      />
    </main>
  );
}
