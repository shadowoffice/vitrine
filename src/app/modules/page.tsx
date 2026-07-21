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

      <section className="page-hero">
        <p className="eyebrow">Modules</p>
        <h1>Modules ProJD</h1>
        <p>
          Les modules suivent les responsabilités réelles d’une entreprise de construction:
          projet, budget, estimation, partenaires, documents, factures et rapports.
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
        <div className="module-detail-grid">
          {modules.map((module) => (
            <article className="card module-detail" key={module.name}>
              <span>{module.name}</span>
              <h2>{module.name}</h2>
              <p>{module.text}</p>
            </article>
          ))}
        </div>
      </section>

      <MarketingCta
        title="Choisir les bons modules pour démarrer"
        text="L'achat sert à sélectionner les modules utiles maintenant et ceux à activer plus tard."
        primaryHref="/commander"
        primaryLabel="Acheter ProJD"
      />
    </main>
  );
}
