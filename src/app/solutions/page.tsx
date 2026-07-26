import type { Metadata } from "next";
import Link from "next/link";

import { MarketingCta } from "../_components/MarketingCta";
import {
  getModuleBySlug,
  solutionRoles,
  type ModuleContent,
} from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Solutions par équipe",
  description:
    "Découvrez les parcours ProJD pour la direction, la gestion de projets, l’estimation et la comptabilité construction.",
  alternates: {
    canonical: "/solutions",
  },
};

export default function SolutionsPage() {
  return (
    <main id="contenu">
      <section className="page-hero centered-page-hero">
        <p className="eyebrow">Solutions par équipe</p>
        <h1>Une même donnée. Une lecture adaptée à chaque métier.</h1>
        <p>
          ProJD ne force pas la direction, l&apos;estimation et la comptabilité
          dans le même écran. Chaque équipe voit le contexte dont elle a besoin,
          relié au même projet.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/demo">
            Préparer une démo
          </Link>
          <Link className="button secondary" href="/modules">
            Parcourir les modules
          </Link>
        </div>
      </section>

      <section className="compact-section solution-grid-section">
        <div className="solution-role-grid">
          {solutionRoles.map((solution) => {
            const roleModules = solution.modules
              .map((slug) => getModuleBySlug(slug))
              .filter((module): module is ModuleContent => Boolean(module));

            return (
              <article className="solution-role-card" id={solution.slug} key={solution.slug}>
                <div className="solution-role-heading">
                  <span>{solution.code}</span>
                  <small>{solution.role}</small>
                </div>
                <h2>{solution.headline}</h2>
                <p>{solution.description}</p>
                <ul>
                  {solution.priorities.map((priority) => (
                    <li key={priority}>{priority}</li>
                  ))}
                </ul>
                <div className="solution-module-links">
                  {roleModules.map((module) => (
                    <Link href={`/modules/${module.slug}`} key={module.slug}>
                      {module.name}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="compact-section handoff-section">
        <div>
          <p className="eyebrow">Passage de relais</p>
          <h2>Le workflow continue quand une équipe a terminé sa partie.</h2>
        </div>
        <div className="handoff-flow" aria-label="Exemple de workflow interéquipe">
          <span>Estimation</span>
          <i aria-hidden="true">→</i>
          <span>Appel d’offres</span>
          <i aria-hidden="true">→</i>
          <span>Contrat et budget</span>
          <i aria-hidden="true">→</i>
          <span>Facture et rapport</span>
        </div>
      </section>

      <MarketingCta
        title="Construire une démonstration autour de vos rôles."
        text="Indiquez les équipes présentes, le projet pilote et les outils déjà utilisés. Nous cadrons ensuite un parcours court et vérifiable."
        primaryHref="/commander"
        primaryLabel="Configurer une proposition"
        secondaryHref="/demo"
        secondaryLabel="Voir le parcours démo"
      />
    </main>
  );
}
