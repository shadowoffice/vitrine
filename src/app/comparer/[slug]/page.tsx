import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "../../_components/Breadcrumbs";
import { MarketingCta } from "../../_components/MarketingCta";
import {
  comparisons,
  getComparisonBySlug,
  getModuleBySlug,
  type ModuleContent,
} from "@/lib/site-content";

type ComparisonPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return comparisons.map((comparison) => ({ slug: comparison.slug }));
}

export async function generateMetadata({
  params,
}: ComparisonPageProps): Promise<Metadata> {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    return { title: "Comparaison introuvable", robots: { index: false } };
  }

  return {
    title: `ProJD et ${comparison.name}`,
    description: comparison.summary,
    alternates: { canonical: `/comparer/${comparison.slug}` },
    openGraph: {
      title: comparison.title,
      description: comparison.summary,
      url: `/comparer/${comparison.slug}`,
      type: "website",
    },
  };
}

export default async function ComparisonPage({
  params,
}: ComparisonPageProps) {
  const { slug } = await params;
  const comparison = getComparisonBySlug(slug);

  if (!comparison) {
    notFound();
  }

  const relatedModules = comparison.relatedModules
    .map((moduleSlug) => getModuleBySlug(moduleSlug))
    .filter((module): module is ModuleContent => Boolean(module));
  const query = new URLSearchParams({
    context: `compare-${comparison.slug}`,
  });
  comparison.relatedModules.forEach((moduleSlug) =>
    query.append("module", moduleSlug),
  );

  return (
    <main id="contenu">
      <section className="page-hero comparison-detail-hero">
        <Breadcrumbs
          currentPath={`/comparer/${comparison.slug}`}
          items={[
            { label: "Comparaisons", href: "/comparer" },
            { label: comparison.name },
          ]}
        />
        <p className="eyebrow">ProJD + {comparison.name}</p>
        <h1>{comparison.title}</h1>
        <p>{comparison.summary}</p>
      </section>

      <section className="compact-section comparison-columns">
        <article>
          <p className="eyebrow">Forces à préserver</p>
          <h2>{comparison.name}</h2>
          <ul>
            {comparison.sourceStrengths.map((strength) => (
              <li key={strength}>{strength}</li>
            ))}
          </ul>
        </article>
        <article>
          <p className="eyebrow">Rôle proposé</p>
          <h2>ProJD</h2>
          <ul>
            {comparison.projdRole.map((role) => (
              <li key={role}>{role}</li>
            ))}
          </ul>
        </article>
      </section>

      <section className="compact-section comparison-boundaries">
        <div>
          <p className="eyebrow">Avant de connecter</p>
          <h2>Les limites à rendre explicites.</h2>
          <p>{comparison.coexistence}</p>
        </div>
        <ul>
          {comparison.limitsToEvaluate.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </section>

      <section className="compact-section related-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Modules concernés</p>
            <h2>Vérifier les frontières dans le produit.</h2>
          </div>
          <Link className="text-link" href="/modules">
            Tous les modules <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="related-module-grid">
          {relatedModules.map((module) => (
            <Link href={`/modules/${module.slug}`} key={module.slug}>
              <span className="module-code">{module.code}</span>
              <div>
                <strong>{module.name}</strong>
                <p>{module.text}</p>
              </div>
              <small aria-hidden="true">↗</small>
            </Link>
          ))}
        </div>
      </section>

      <MarketingCta
        title={`Cadrer la coexistence avec ${comparison.name}.`}
        text="La proposition sert à confirmer les accès, les données autoritaires, le comportement d’échec et le premier test."
        primaryHref={`/commander?${query.toString()}`}
        primaryLabel="Décrire l’intégration"
        secondaryHref="/guides/cadrer-une-integration"
        secondaryLabel="Suivre le guide"
      />
    </main>
  );
}
