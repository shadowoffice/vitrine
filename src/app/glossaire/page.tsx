import type { Metadata } from "next";
import Link from "next/link";

import { Breadcrumbs } from "../_components/Breadcrumbs";
import { glossaryTerms, siteUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Glossaire ERP construction",
  description:
    "Définitions claires des principaux objets de gestion de projets, contrats, coûts et appels d’offres utilisés dans ProJD.",
  alternates: { canonical: "/glossaire" },
  openGraph: {
    title: "Glossaire ERP construction ProJD",
    description:
      "Addenda, avenants, codes de coût, engagements, RFIs et autres termes utilisés dans les workflows ProJD.",
    url: "/glossaire",
    type: "website",
  },
};

const glossaryJsonLd = {
  "@context": "https://schema.org",
  "@type": "DefinedTermSet",
  name: "Glossaire ERP construction ProJD",
  url: `${siteUrl}/glossaire`,
  inLanguage: "fr-CA",
  hasDefinedTerm: glossaryTerms.map((item) => ({
    "@type": "DefinedTerm",
    name: item.term,
    description: item.definition,
  })),
};

export default function GlossaryPage() {
  return (
    <main id="contenu">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(glossaryJsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <section className="page-hero glossary-hero">
        <Breadcrumbs currentPath="/glossaire" items={[{ label: "Glossaire" }]} />
        <p className="eyebrow">Référence métier</p>
        <h1>Les mots du workflow, définis sans jargon commercial.</h1>
        <p>
          Ces définitions décrivent l’usage général dans ProJD. Les règles
          contractuelles, comptables et réglementaires de votre organisation
          demeurent celles à confirmer.
        </p>
      </section>

      <section className="compact-section glossary-section">
        <dl className="glossary-grid">
          {glossaryTerms.map((item) => (
            <div id={item.term.toLowerCase().replace(/\s+/g, "-")} key={item.term}>
              <dt>{item.term}</dt>
              <dd>{item.definition}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section className="compact-section policy-action">
        <div>
          <p className="eyebrow">Voir le contexte</p>
          <h2>Une définition devient utile dans un parcours.</h2>
          <p>
            Les guides montrent comment ces objets s’enchaînent, avec leurs
            contrôles et résultats attendus.
          </p>
        </div>
        <Link className="button primary" href="/guides">
          Parcourir les guides
        </Link>
      </section>
    </main>
  );
}
