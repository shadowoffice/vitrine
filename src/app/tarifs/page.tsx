import type { Metadata } from "next";
import Link from "next/link";

import { MarketingCta } from "../_components/MarketingCta";
import { PricingExplorer } from "./PricingExplorer";
import {
  pricingCommercialNotes,
  pricingComparisonRows,
  pricingPlans,
} from "@/lib/pricing";
import { faqItems, packages } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Tarifs et forfaits",
  description:
    "Forfaits de référence ProJD pour une équipe pilote, une entreprise multi-projets ou plusieurs équipes métier.",
  alternates: {
    canonical: "/tarifs",
  },
  openGraph: {
    title: "Tarifs ProJD — forfaits ERP construction",
    description:
      "Comparez les accès, la mise en route et le périmètre des forfaits ProJD, puis estimez un coût catalogue.",
    url: "/tarifs",
    type: "website",
  },
};

const implementationSteps = [
  {
    code: "01",
    title: "Cadrage",
    text: "Rôles, projet pilote, modules, sources et risques d’intégration.",
  },
  {
    code: "02",
    title: "Configuration",
    text: "Instance, accès, données de départ et règles de fonctionnement.",
  },
  {
    code: "03",
    title: "Validation",
    text: "Scénarios métier, ajustements et décision d’élargir le périmètre.",
  },
] as const;

const faqJsonLd = {
  "@context": "https://schema.org",
  "@type": "FAQPage",
  mainEntity: faqItems.map((item) => ({
    "@type": "Question",
    name: item.question,
    acceptedAnswer: {
      "@type": "Answer",
      text: item.answer,
    },
  })),
};

export default function PricingPage() {
  return (
    <main id="contenu">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(faqJsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <section className="page-hero pricing-hero">
        <p className="eyebrow">Forfaits de référence</p>
        <h1>Un point de départ clair. Une proposition adaptée ensuite.</h1>
        <p>
          Les forfaits cadrent le nombre d&apos;accès et l&apos;ampleur de
          l&apos;implantation. La proposition finale confirme les modules, les
          intégrations et le calendrier avant l&apos;activation.
        </p>
        <div className="pricing-disclaimer">
          <span aria-hidden="true">i</span>
          <p>
            Le paiement prépare un dossier commercial. Il ne déclenche jamais
            une activation instantanée ou une conformité automatique.
          </p>
        </div>
      </section>

      <section className="compact-section pricing-section">
        <div className="pricing-grid">
          {packages.map((plan) => (
            <article
              className={
                plan.featured ? "pricing-card pricing-card-featured" : "pricing-card"
              }
              key={plan.code}
            >
              <div className="pricing-card-heading">
                <div>
                  <span>{plan.featured ? "Recommandé" : "Forfait"}</span>
                  <h2>{plan.name}</h2>
                </div>
                <small>{plan.includedSeats} accès inclus</small>
              </div>
              <div className="pricing-amount">
                <strong>{plan.price.replace("/mois", "")}</strong>
                <span>/ mois</span>
              </div>
              <p>{plan.description}</p>
              <small className="setup-price">{plan.setup}</small>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className="button secondary" href={`/commander?plan=${plan.code}`}>
                Configurer ce forfait
              </Link>
            </article>
          ))}
        </div>
        <p className="pricing-footnote">
          Accès additionnels facturés selon le forfait. Les imports historiques
          et connecteurs spécifiques sont évalués dans la proposition.
        </p>
      </section>

      <PricingExplorer />

      <section
        className="compact-section pricing-comparison-section"
        aria-labelledby="pricing-comparison-title"
      >
        <div className="section-intro">
          <p className="eyebrow">Comparer les forfaits</p>
          <h2 id="pricing-comparison-title">
            Les différences qui changent réellement le périmètre.
          </h2>
          <p>
            Le tableau compare le catalogue public. Une intégration n’est
            jamais présumée active avant la validation des licences, accès et
            responsabilités.
          </p>
        </div>
        <div className="comparison-table-scroll" tabIndex={0}>
          <table className="pricing-comparison-table">
            <caption className="visually-hidden">
              Comparaison des forfaits ProJD
            </caption>
            <thead>
              <tr>
                <th scope="col">Critère</th>
                {pricingPlans.map((plan) => (
                  <th scope="col" key={plan.code}>
                    {plan.publicName}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {pricingComparisonRows.map((row) => (
                <tr key={row.label}>
                  <th scope="row">{row.label}</th>
                  {pricingPlans.map((plan) => (
                    <td key={plan.code}>{row.values[plan.code]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      <section
        className="compact-section pricing-terms"
        aria-labelledby="pricing-terms-title"
      >
        <div>
          <p className="eyebrow">Lecture commerciale</p>
          <h2 id="pricing-terms-title">
            Ce que le calcul inclut — et ce qu’il ne décide pas.
          </h2>
        </div>
        <ul>
          {Object.values(pricingCommercialNotes).map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <section className="compact-section implementation-section">
        <div className="section-intro">
          <p className="eyebrow">Mise en service</p>
          <h2>L’implantation fait partie du produit.</h2>
        </div>
        <div className="implementation-grid">
          {implementationSteps.map((step) => (
            <article key={step.code}>
              <span>{step.code}</span>
              <h3>{step.title}</h3>
              <p>{step.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="compact-section faq-section">
        <div className="section-intro narrow">
          <p className="eyebrow">Questions fréquentes</p>
          <h2>Avant de choisir un forfait.</h2>
        </div>
        <div className="faq-list">
          {faqItems.map((item) => (
            <details key={item.question}>
              <summary>{item.question}</summary>
              <p>{item.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <MarketingCta
        title="Recevoir une proposition qui correspond au vrai périmètre."
        text="Le formulaire conserve les forfaits publics, puis ajoute le contexte nécessaire pour cadrer l’implantation et les intégrations."
        primaryHref="/commander"
        primaryLabel="Configurer ProJD"
        secondaryHref="/demo"
        secondaryLabel="Voir la démo"
      />
    </main>
  );
}
