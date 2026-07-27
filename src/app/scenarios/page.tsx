import type { Metadata } from "next";
import Link from "next/link";

import { MarketingCta } from "../_components/MarketingCta";
import { verifiedScenarios } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Scénarios ProJD vérifiables",
  description:
    "Reproduisez des parcours précis dans la démo ProJD avec des données fictives, sans témoignage ni résultat client inventé.",
  alternates: { canonical: "/scenarios" },
  openGraph: {
    title: "Scénarios vérifiables dans la démo ProJD",
    description:
      "Revue de projet, appel d’offres et facture fournisseur : des parcours concrets à vérifier avec des données fictives.",
    url: "/scenarios",
    type: "website",
  },
};

export default function VerifiedScenariosPage() {
  return (
    <main id="contenu">
      <section className="page-hero centered-page-hero">
        <p className="eyebrow">Preuve produit</p>
        <h1>Des scénarios reproductibles, pas de faux résultats clients.</h1>
        <p>
          Chaque scénario décrit ce qui peut être observé dans l’environnement
          fictif. Il ne prétend pas démontrer un gain, une conformité ou une
          adoption chez un client réel.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/demo">
            Ouvrir le parcours démo
          </Link>
          <Link className="button secondary" href="/guides">
            Lire les procédures
          </Link>
        </div>
      </section>

      <section className="compact-section scenario-list">
        {verifiedScenarios.map((scenario) => {
          const query = new URLSearchParams({
            context: `scenario-${scenario.slug}`,
          });
          scenario.moduleSlugs.forEach((moduleSlug) =>
            query.append("module", moduleSlug),
          );

          return (
            <article key={scenario.slug}>
              <header>
                <span>{scenario.code}</span>
                <div>
                  <p className="eyebrow">Données fictives</p>
                  <h2>{scenario.title}</h2>
                  <p>{scenario.context}</p>
                </div>
              </header>
              <ol>
                {scenario.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <aside>
                <strong>Ce que le scénario permet d’affirmer</strong>
                <p>{scenario.evidence}</p>
              </aside>
              <div className="scenario-actions">
                <Link className="text-link" href="/demo">
                  Vérifier dans la démo <span aria-hidden="true">→</span>
                </Link>
                <Link
                  className="text-link"
                  href={`/commander?${query.toString()}`}
                >
                  Reprendre ce contexte <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          );
        })}
      </section>

      <MarketingCta
        title="Un vrai cas client demande une validation et une autorisation."
        text="Lorsque des résultats vérifiés seront disponibles, ils pourront compléter ces scénarios sans remplacer leur caractère reproductible."
        primaryHref="/commander?context=verified-scenarios"
        primaryLabel="Préparer mon scénario"
        secondaryHref="/securite"
        secondaryLabel="Voir les garde-fous"
      />
    </main>
  );
}
