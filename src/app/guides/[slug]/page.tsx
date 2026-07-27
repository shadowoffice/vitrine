import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "../../_components/Breadcrumbs";
import { MarketingCta } from "../../_components/MarketingCta";
import {
  getGuideBySlug,
  getModuleBySlug,
  guides,
  contentLastModified,
  siteUrl,
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
    openGraph: {
      title: guide.title,
      description: guide.summary,
      url: `/guides/${guide.slug}`,
      type: "article",
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
  const relatedGuides = guides
    .filter(
      (candidate) =>
        candidate.slug !== guide.slug &&
        candidate.relatedModules.some((moduleSlug) =>
          guide.relatedModules.includes(moduleSlug),
        ),
    )
    .slice(0, 3);
  const articleJsonLd = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: guide.title,
    description: guide.summary,
    dateModified: contentLastModified.resources,
    inLanguage: "fr-CA",
    mainEntityOfPage: `${siteUrl}/guides/${guide.slug}`,
    author: {
      "@type": "Organization",
      name: "ProJD",
      url: siteUrl,
    },
    publisher: {
      "@type": "Organization",
      name: "ProJD",
      url: siteUrl,
    },
  };

  return (
    <main id="contenu">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(articleJsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <article className="guide-layout">
        <header className="guide-hero">
          <Breadcrumbs
            currentPath={`/guides/${guide.slug}`}
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

        {relatedGuides.length > 0 && (
          <section className="guide-more">
            <div>
              <p className="eyebrow">Continuer le parcours</p>
              <h2>Guides reliés au même workflow.</h2>
            </div>
            <div>
              {relatedGuides.map((relatedGuide) => (
                <Link
                  href={`/guides/${relatedGuide.slug}`}
                  key={relatedGuide.slug}
                >
                  <span>{relatedGuide.code}</span>
                  <strong>{relatedGuide.title}</strong>
                  <small>{relatedGuide.duration}</small>
                </Link>
              ))}
            </div>
          </section>
        )}
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
