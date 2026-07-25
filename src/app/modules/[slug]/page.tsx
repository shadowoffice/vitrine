import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { MarketingCta } from "../../_components/MarketingCta";
import { SiteHeader } from "../../_components/SiteHeader";
import {
  demoErpUrl,
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

export async function generateMetadata({ params }: ModulePageProps): Promise<Metadata> {
  const { slug } = await params;
  const moduleContent = getModuleBySlug(slug);

  if (!moduleContent) {
    return {
      title: "Module introuvable",
    };
  }

  return {
    title: `${moduleContent.name} | Modules ProJD`,
    description: moduleContent.summary,
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
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Acheter ProJD" />

      <section className="page-hero module-hero">
        <p className="eyebrow">{moduleContent.eyebrow}</p>
        <h1>{moduleContent.name}</h1>
        <p>{moduleContent.summary}</p>
        <div className="hero-actions">
          <Link className="button primary" href="/commander">
            Acheter ProJD
          </Link>
          <Link className="button secondary" href="/modules">
            Tous les modules
          </Link>
        </div>
      </section>

      <section className="section module-story-section">
        <div>
          <p className="eyebrow">Pour qui</p>
          <h2>{moduleContent.audience}</h2>
          <p>{moduleContent.siteSignal}</p>
        </div>
        <div className="module-site-panel">
          <span>{moduleContent.metricLabel}</span>
          <strong>{moduleContent.metric}</strong>
          <small>Signal chantier à surveiller</small>
        </div>
      </section>

      <section className="section module-explain-grid">
        <div>
          <p className="eyebrow">Ce que ça règle</p>
          <h2>Moins de suivi manuel, plus de contexte projet.</h2>
          <ul className="check-list">
            {moduleContent.outcomes.map((outcome) => (
              <li key={outcome}>{outcome}</li>
            ))}
          </ul>
        </div>
        <div>
          <p className="eyebrow">Dans ProJD</p>
          <h2>Fonctions incluses dans le module.</h2>
          <ul className="check-list">
            {moduleContent.features.map((feature) => (
              <li key={feature}>{feature}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="section start-section module-workflow-section">
        <div>
          <p className="eyebrow">Parcours simple</p>
          <h2>La mise en route reste courte.</h2>
        </div>
        <ol className="start-list">
          {moduleContent.workflow.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
      </section>

      <section className="section">
        <div className="section-heading compact-heading">
          <p className="eyebrow">Modules reliés</p>
          <h2>Les autres blocs qui complètent souvent ce module.</h2>
        </div>
        <div className="pillar-grid">
          {relatedModules.map((relatedModule) => (
            <Link className="card link-card module-related-card" href={`/modules/${relatedModule.slug}`} key={relatedModule.slug}>
              <span>{relatedModule.eyebrow}</span>
              <h3>{relatedModule.name}</h3>
              <p>{relatedModule.text}</p>
            </Link>
          ))}
        </div>
      </section>

      <MarketingCta
        title={`Voir ${moduleContent.name} dans un parcours ProJD`}
        text="La démo publique montre le produit. Le formulaire d'achat sert à cadrer les modules et le premier chantier à préparer."
        primaryHref={demoErpUrl}
        primaryLabel="Visiter la démo"
        secondaryHref="/commander"
        secondaryLabel="Acheter ProJD"
      />
    </main>
  );
}
