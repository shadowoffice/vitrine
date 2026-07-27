import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { AvailabilityBadge } from "../../_components/AvailabilityBadge";
import { Breadcrumbs } from "../../_components/Breadcrumbs";
import { MarketingCta } from "../../_components/MarketingCta";
import {
  getModuleBySlug,
  modules,
  type ModuleContent,
} from "@/lib/site-content";

type ModulePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return modules.map((module) => ({
    slug: module.slug,
  }));
}

export async function generateMetadata({
  params,
}: ModulePageProps): Promise<Metadata> {
  const { slug } = await params;
  const moduleContent = getModuleBySlug(slug);

  if (!moduleContent) {
    return {
      title: "Module introuvable",
      robots: {
        index: false,
      },
    };
  }

  return {
    title: moduleContent.name,
    description: moduleContent.summary,
    alternates: {
      canonical: `/modules/${moduleContent.slug}`,
    },
    openGraph: {
      title: `${moduleContent.name} — module ProJD`,
      description: moduleContent.summary,
      url: `/modules/${moduleContent.slug}`,
      type: "website",
    },
  };
}

const getRelatedModules = (module: ModuleContent): ModuleContent[] =>
  module.related
    .map((slug) => getModuleBySlug(slug))
    .filter((item): item is ModuleContent => Boolean(item));

export default async function ModuleDetailPage({ params }: ModulePageProps) {
  const { slug } = await params;
  const moduleContent = getModuleBySlug(slug);

  if (!moduleContent) {
    notFound();
  }

  const relatedModules = getRelatedModules(moduleContent);

  return (
    <main id="contenu">
      <section className="module-detail-hero">
        <Breadcrumbs
          currentPath={`/modules/${moduleContent.slug}`}
          items={[
            { label: "Modules", href: "/modules" },
            { label: moduleContent.name },
          ]}
        />
        <div className="module-detail-heading">
          <div>
            <div className="module-title-row">
              <span className="module-code module-code-large">
                {moduleContent.code}
              </span>
              <AvailabilityBadge
                availability={moduleContent.availability}
                note={moduleContent.availabilityNote}
              />
            </div>
            <p className="eyebrow">{moduleContent.eyebrow}</p>
            <h1>{moduleContent.name}</h1>
            <p>{moduleContent.summary}</p>
            <div className="hero-actions">
              <Link className="button primary" href="/demo">
                Voir dans la démo
              </Link>
              <Link
                className="button secondary"
                href={`/commander?module=${moduleContent.slug}&context=module`}
              >
                Ajouter à ma proposition
              </Link>
            </div>
          </div>
          <aside className="module-proof-card">
            <span>État du module</span>
            <strong>{moduleContent.availabilityNote}</strong>
            <p>{moduleContent.proof}</p>
          </aside>
        </div>
      </section>

      <section className="compact-section module-value-section">
        <div>
          <p className="eyebrow">Pour qui</p>
          <h2>{moduleContent.audience}</h2>
        </div>
        <div className="module-value-grid">
          <article>
            <span>Résultats recherchés</span>
            <ul className="check-list">
              {moduleContent.outcomes.map((outcome) => (
                <li key={outcome}>{outcome}</li>
              ))}
            </ul>
          </article>
          <article>
            <span>Dans ProJD</span>
            <ul className="check-list">
              {moduleContent.features.map((feature) => (
                <li key={feature}>{feature}</li>
              ))}
            </ul>
          </article>
        </div>
      </section>

      <section className="compact-section workflow-section">
        <div className="section-intro">
          <p className="eyebrow">Parcours type</p>
          <h2>Quatre étapes pour garder le flux lisible.</h2>
        </div>
        <ol className="workflow-rail workflow-rail-four">
          {moduleContent.workflow.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="compact-section related-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Modules reliés</p>
            <h2>Compléter le même workflow.</h2>
          </div>
          <Link className="text-link" href="/modules">
            Tous les modules <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="related-module-grid">
          {relatedModules.map((relatedModule) => (
            <Link
              href={`/modules/${relatedModule.slug}`}
              key={relatedModule.slug}
            >
              <span className="module-code">{relatedModule.code}</span>
              <div>
                <strong>{relatedModule.name}</strong>
                <p>{relatedModule.text}</p>
              </div>
              <small aria-hidden="true">↗</small>
            </Link>
          ))}
        </div>
      </section>

      <MarketingCta
        title={`Évaluer ${moduleContent.name} avec votre équipe.`}
        text="La démo utilise des données fictives. Une proposition sert ensuite à cadrer vos rôles, vos sources et les règles de mise en service."
        primaryHref={`/commander?module=${moduleContent.slug}&context=module`}
        primaryLabel="Configurer une proposition"
        secondaryHref="/demo"
        secondaryLabel="Préparer la démo"
      />
    </main>
  );
}
