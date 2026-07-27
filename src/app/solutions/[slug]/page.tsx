import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Breadcrumbs } from "../../_components/Breadcrumbs";
import { MarketingCta } from "../../_components/MarketingCta";
import {
  getModuleBySlug,
  solutionRoleDetails,
  solutionRoles,
  type ModuleContent,
} from "@/lib/site-content";

type SolutionRolePageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export function generateStaticParams() {
  return solutionRoles.map((solution) => ({ slug: solution.slug }));
}

const getSolution = (slug: string) =>
  solutionRoles.find((solution) => solution.slug === slug);

export async function generateMetadata({
  params,
}: SolutionRolePageProps): Promise<Metadata> {
  const { slug } = await params;
  const solution = getSolution(slug);

  if (!solution) {
    return {
      title: "Solution introuvable",
      robots: { index: false },
    };
  }

  return {
    title: `ProJD pour ${solution.role}`,
    description: solution.description,
    alternates: { canonical: `/solutions/${solution.slug}` },
    openGraph: {
      title: `ProJD pour ${solution.role}`,
      description: solution.description,
      url: `/solutions/${solution.slug}`,
      type: "website",
    },
  };
}

export default async function SolutionRolePage({
  params,
}: SolutionRolePageProps) {
  const { slug } = await params;
  const solution = getSolution(slug);

  if (!solution) {
    notFound();
  }

  const detail = solutionRoleDetails[solution.slug];
  const roleModules = solution.modules
    .map((moduleSlug) => getModuleBySlug(moduleSlug))
    .filter((module): module is ModuleContent => Boolean(module));
  const query = new URLSearchParams({
    context: `role-${solution.slug}`,
  });
  solution.modules.forEach((moduleSlug) => query.append("module", moduleSlug));
  const proposalHref = `/commander?${query.toString()}`;

  return (
    <main id="contenu">
      <section className="page-hero solution-detail-hero">
        <Breadcrumbs
          currentPath={`/solutions/${solution.slug}`}
          items={[
            { label: "Solutions", href: "/solutions" },
            { label: solution.role },
          ]}
        />
        <p className="eyebrow">{solution.code} · Solution par rôle</p>
        <h1>{solution.headline}</h1>
        <p>{solution.description}</p>
        <div className="hero-actions">
          <Link className="button primary" href={proposalHref}>
            Préparer ce parcours
          </Link>
          <Link className="button secondary" href="/demo">
            Le vérifier dans la démo
          </Link>
        </div>
      </section>

      <section className="compact-section role-problem-section">
        <div>
          <p className="eyebrow">Contexte courant</p>
          <h2>Les ruptures que ce parcours cherche à réduire.</h2>
        </div>
        <ul className="content-check-grid">
          {detail.problems.map((problem) => (
            <li key={problem}>{problem}</li>
          ))}
        </ul>
      </section>

      <section className="compact-section workflow-section">
        <div className="section-intro">
          <p className="eyebrow">Parcours vérifiable</p>
          <h2>Une boucle de travail courte pour {solution.role.toLowerCase()}.</h2>
        </div>
        <ol className="workflow-rail workflow-rail-four">
          {detail.workflow.map((step, index) => (
            <li key={step}>
              <span>{String(index + 1).padStart(2, "0")}</span>
              <strong>{step}</strong>
            </li>
          ))}
        </ol>
        <div className="scenario-verification-note">
          <strong>Résultat recherché</strong>
          <p>{detail.expectedOutcome}</p>
          <small>{detail.verification}</small>
        </div>
      </section>

      <section className="compact-section related-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Modules du parcours</p>
            <h2>Ouvrir seulement les espaces utiles.</h2>
          </div>
          <Link className="text-link" href="/modules">
            Tous les modules <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="related-module-grid">
          {roleModules.map((module) => (
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
        title={`Cadrer ProJD pour ${solution.role.toLowerCase()}.`}
        text="La proposition conserve les modules de ce parcours et sert à confirmer l’équipe, le projet pilote et les intégrations."
        primaryHref={proposalHref}
        primaryLabel="Configurer ce parcours"
        secondaryHref="/scenarios"
        secondaryLabel="Voir les scénarios"
      />
    </main>
  );
}
