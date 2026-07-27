import type { Metadata } from "next";
import Link from "next/link";

import { MarketingCta } from "../_components/MarketingCta";
import { comparisons } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Comparer ProJD aux outils existants",
  description:
    "Situez le rôle de ProJD aux côtés d’Excel, Procore et SharePoint, avec les frontières d’autorité et d’intégration à valider.",
  alternates: { canonical: "/comparer" },
  openGraph: {
    title: "ProJD avec Excel, Procore et SharePoint",
    description:
      "Des comparaisons factuelles pour décider quoi conserver, connecter ou structurer dans ProJD.",
    url: "/comparer",
    type: "website",
  },
};

export default function CompareIndexPage() {
  return (
    <main id="contenu">
      <section className="page-hero centered-page-hero">
        <p className="eyebrow">Comparer les rôles</p>
        <h1>Choisir une frontière claire plutôt qu’un remplacement total.</h1>
        <p>
          Ces pages ne déclarent pas un gagnant universel. Elles aident à
          déterminer la source autoritaire, les données à relier et les échecs
          à prévoir.
        </p>
      </section>

      <section className="compact-section comparison-index-section">
        <div className="comparison-index-grid">
          {comparisons.map((comparison) => (
            <Link href={`/comparer/${comparison.slug}`} key={comparison.slug}>
              <small>ProJD + {comparison.name}</small>
              <h2>{comparison.title}</h2>
              <p>{comparison.summary}</p>
              <strong>
                Comparer les responsabilités <span aria-hidden="true">→</span>
              </strong>
            </Link>
          ))}
        </div>
      </section>

      <MarketingCta
        title="Une intégration commence par une décision d’autorité."
        text="Décrivez l’outil actuel, les données concernées et le premier workflow à tester avant d’estimer l’intégration."
        primaryHref="/commander?context=comparison-index"
        primaryLabel="Décrire mon environnement"
        secondaryHref="/guides/cadrer-une-integration"
        secondaryLabel="Lire le guide d’intégration"
      />
    </main>
  );
}
