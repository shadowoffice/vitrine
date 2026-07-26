import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "../../_components/Breadcrumbs";
import { MarketingCta } from "../../_components/MarketingCta";
import {
  getGuideBySlug,
  getModuleBySlug,
  guides,
  type ModuleContent,
} from "@/lib/site-content";

type GuidePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return guides.map((guide) => ({
    slug: guide.slug,
  }));
}

export async function generateMetadata({
  params,
}: GuidePageProps): Promise<Metadata> {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    return {
      title: "Guide introuvable",
      robots: {
        index: false,
      },
    };
  }

  return {
    title: guide.title,
    description: guide.summary,
    alternates: {
      canonical: `/guides/${guide.slug}`,
    },
  };
}

export default async function GuidePage({ params }: GuidePageProps) {
  const { slug } = await params;
  const guide = getGuideBySlug(slug);

  if (!guide) {
    notFound();
  }

  const relatedModules = guide.relatedModules
    .map((moduleSlug) => getModuleBySlug(moduleSlug))
    .filter((module): module is ModuleContent => Boolean(module));

  return (
    <main id="contenu">
      <article className="guide-layout">
        <header className="guide-hero">
          <Breadcrumbs
            items={[
              { label: "Guides", href: "/guides" },
              { label: guide.title },
            ]}
          />
          <div className="guide-hero-meta">
            <span>{guide.code}</span>
            <small>{guide.category}</small>
            <strong>{guide.duration}</strong>
          </div>
          <h1>{guide.title}</h1>
          <p>{guide.summary}</p>
          <dl>
            <div>
              <dt>Pour</dt>
              <dd>{guide.audience}</dd>
            </div>
            <div>
              <dt>Résultat attendu</dt>
              <dd>{guide.outcome}</dd>
            </div>
          </dl>
        </header>

        <section className="guide-steps" aria-labelledby="guide-steps-title">
          <div className="section-intro">
            <p className="eyebrow">Étapes</p>
            <h2 id="guide-steps-title">Le parcours recommandé.</h2>
          </div>
          <ol>
            {guide.steps.map((step, index) => (
              <li key={step.title}>
                <span>{String(index + 1).padStart(2, "0")}</span>
                <div>
                  <h3>{step.title}</h3>
                  <p>{step.text}</p>
                  <ul>
                    {step.checks.map((check) => (
                      <li key={check}>{check}</li>
                    ))}
                  </ul>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <aside className="guide-note">
          <span>À retenir</span>
          <p>{guide.note}</p>
        </aside>

        <section className="guide-related">
          <div>
            <p className="eyebrow">Modules reliés</p>
            <h2>Approfondir dans le produit.</h2>
          </div>
          <div>
            {relatedModules.map((module) => (
              <Link href={`/modules/${module.slug}`} key={module.slug}>
                <span className="module-code">{module.code}</span>
                <strong>{module.name}</strong>
                <small aria-hidden="true">→</small>
              </Link>
            ))}
          </div>
        </section>
      </article>

      <MarketingCta
        title="Prêt à reconnaître ce parcours dans ProJD?"
        text="Ouvrez la démo avec des données fictives ou configurez une proposition autour de votre propre équipe."
        primaryHref="/demo"
        primaryLabel="Préparer la démo"
        secondaryHref="/commander"
        secondaryLabel="Configurer une proposition"
      />
    </main>
  );
}
