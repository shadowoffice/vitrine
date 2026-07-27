import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "../../_components/Breadcrumbs";
import { MarketingCta } from "../../_components/MarketingCta";
import {
  getModuleBySlug,
  getSectorBySlug,
  sectors,
  type ModuleContent,
} from "@/lib/site-content";

type SectorPageProps = {
  params: Promise<{ slug: string }>;
};

export function generateStaticParams() {
  return sectors.map((sector) => ({ slug: sector.slug }));
}

export async function generateMetadata({
  params,
}: SectorPageProps): Promise<Metadata> {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);

  if (!sector) {
    return { title: "Secteur introuvable", robots: { index: false } };
  }

  return {
    title: `ERP pour ${sector.name}`,
    description: sector.summary,
    alternates: { canonical: `/secteurs/${sector.slug}` },
    openGraph: {
      title: `ProJD pour ${sector.name}`,
      description: sector.summary,
      url: `/secteurs/${sector.slug}`,
      type: "website",
    },
  };
}

export default async function SectorPage({ params }: SectorPageProps) {
  const { slug } = await params;
  const sector = getSectorBySlug(slug);

  if (!sector) {
    notFound();
  }

  const sectorModules = sector.moduleSlugs
    .map((moduleSlug) => getModuleBySlug(moduleSlug))
    .filter((module): module is ModuleContent => Boolean(module));
  const query = new URLSearchParams({ context: `sector-${sector.slug}` });
  sector.moduleSlugs.forEach((moduleSlug) => query.append("module", moduleSlug));
  const proposalHref = `/commander?${query.toString()}`;

  return (
    <main id="contenu">
      <section className="page-hero sector-detail-hero">
        <Breadcrumbs
          currentPath={`/secteurs/${sector.slug}`}
          items={[
            { label: "Secteurs", href: "/secteurs" },
            { label: sector.name },
          ]}
        />
        <p className="eyebrow">{sector.code} · Construction</p>
        <h1>{sector.headline}</h1>
        <p>{sector.summary}</p>
        <div className="hero-actions">
          <Link className="button primary" href={proposalHref}>
            Cadrer ce point de départ
          </Link>
          <Link className="button secondary" href="/scenarios">
            Voir les scénarios vérifiables
          </Link>
        </div>
      </section>

      <section className="compact-section sector-challenge-section">
        <div>
          <p className="eyebrow">À vérifier avec l’équipe</p>
          <h2>Trois continuités de travail à observer.</h2>
        </div>
        <ul className="content-check-grid">
          {sector.challenges.map((challenge) => (
            <li key={challenge}>{challenge}</li>
          ))}
        </ul>
      </section>

      <section className="compact-section sector-starting-point">
        <div>
          <p className="eyebrow">Périmètre pilote</p>
          <h2>Un point de départ borné.</h2>
        </div>
        <p>{sector.startingPoint}</p>
      </section>

      <section className="compact-section related-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Modules à examiner</p>
            <h2>Un ensemble initial, à réduire ou compléter.</h2>
          </div>
          <Link className="text-link" href="/modules">
            Catalogue complet <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="related-module-grid">
          {sectorModules.map((module) => (
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
        title={`Évaluer ProJD pour ${sector.name.toLowerCase()}.`}
        text="Le formulaire conserve ce contexte et les modules proposés; vous pouvez ensuite corriger le périmètre avec votre réalité."
        primaryHref={proposalHref}
        primaryLabel="Configurer ce parcours"
        secondaryHref="/tarifs"
        secondaryLabel="Estimer un forfait"
      />
    </main>
  );
}
