import type { Metadata } from "next";
import Link from "next/link";

import { AvailabilityBadge } from "../_components/AvailabilityBadge";
import { MarketingCta } from "../_components/MarketingCta";
import {
  documentationSections,
  modules,
} from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Documentation",
  description:
    "Documentation ProJD organisée par rôle, par workflow et par état réel des modules.",
  alternates: {
    canonical: "/documentation",
  },
};

const documentationPrinciples = [
  "Commencer par le rôle et la tâche à accomplir.",
  "Conserver la provenance des données importées.",
  "Valider humainement toute décision financière sensible.",
] as const;

export default function DocumentationPage() {
  return (
    <main id="contenu">
      <section className="page-hero documentation-hero">
        <p className="eyebrow">Documentation ProJD</p>
        <h1>Des réponses organisées par rôle et par tâche.</h1>
        <p>
          Cette documentation présente les flux disponibles, leurs limites et
          les étapes utiles aux administrateurs, estimateurs, comptables et
          chargés de projets.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/guides">
            Ouvrir les guides
          </Link>
          <Link className="button secondary" href="/modules">
            État des modules
          </Link>
        </div>
      </section>

      <section className="compact-section documentation-section-grid">
        {documentationSections.map((section) => (
          <article key={section.code}>
            <span>{section.code}</span>
            <h2>{section.title}</h2>
            <p>{section.text}</p>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
            <Link href={section.href}>
              Consulter <span aria-hidden="true">→</span>
            </Link>
          </article>
        ))}
      </section>

      <section className="compact-section module-reference-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Référence fonctionnelle</p>
            <h2>État actuel des modules.</h2>
          </div>
          <p className="section-side-note">
            Les statuts sont commerciaux et techniques, pas des garanties de
            conformité réglementaire.
          </p>
        </div>
        <div className="module-reference-list">
          {modules.map((module) => (
            <Link href={`/modules/${module.slug}`} key={module.slug}>
              <span className="module-code">{module.code}</span>
              <div>
                <strong>{module.name}</strong>
                <small>{module.availabilityNote}</small>
              </div>
              <AvailabilityBadge availability={module.availability} />
            </Link>
          ))}
        </div>
      </section>

      <section className="compact-section doc-principles-section">
        <div>
          <p className="eyebrow">Convention de lecture</p>
          <h2>Trois règles avant de configurer.</h2>
        </div>
        <ol>
          {documentationPrinciples.map((principle, index) => (
            <li key={principle}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{principle}</strong>
            </li>
          ))}
        </ol>
      </section>

      <MarketingCta
        title="Passer de la documentation à un parcours ProJD."
        text="Choisissez un guide, ouvrez la démo fictive, puis cadrez un premier projet avec les responsables concernés."
        primaryHref="/guides"
        primaryLabel="Choisir un guide"
        secondaryHref="/demo"
        secondaryLabel="Préparer la démo"
      />
    </main>
  );
}
