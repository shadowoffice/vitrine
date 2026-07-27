import type { Metadata } from "next";
import Link from "next/link";

import { ErpPreview } from "./_components/ErpPreview";
import { MarketingCta } from "./_components/MarketingCta";
import {
  operationalProof,
  productPillars,
  solutionRoles,
  siteUrl,
} from "@/lib/site-content";

export const metadata: Metadata = {
  title: "ERP construction pour entrepreneurs québécois",
  description:
    "ProJD relie projets, finances, contrats, appels d’offres, partenaires et documents dans un ERP de construction à implantation accompagnée.",
  alternates: {
    canonical: "/",
  },
};

const productSignals = [
  "Projets",
  "Finance",
  "Contrats",
  "Estimation",
  "Partenaires",
  "Rapports",
] as const;

const productJsonLd = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  name: "ProJD",
  applicationCategory: "BusinessApplication",
  operatingSystem: "Web",
  url: siteUrl,
  description:
    "ERP de construction pour les projets, la finance, les contrats, les appels d’offres et les partenaires.",
  offers: {
    "@type": "AggregateOffer",
    priceCurrency: "CAD",
    lowPrice: "249",
    highPrice: "999",
    offerCount: "3",
  },
};

export default function Home() {
  return (
    <main id="contenu">
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />

      <section className="home-hero" aria-labelledby="home-title">
        <div className="home-hero-copy">
          <div className="release-note">
            <span aria-hidden="true" />
            Produit en évolution · implantation accompagnée
          </div>
          <p className="eyebrow">ERP construction · Québec</p>
          <h1 id="home-title">
            Le chantier sous contrôle.
            <span> Les décisions au même endroit.</span>
          </h1>
          <p className="hero-lead">
            ProJD relie vos projets, vos finances, vos contrats et vos appels
            d&apos;offres dans un environnement de gestion conçu pour la
            construction.
          </p>
          <div className="hero-actions">
            <Link className="button primary" href="/demo">
              Voir la démo
            </Link>
            <Link className="button secondary" href="/modules">
              Explorer les modules
            </Link>
          </div>
          <p className="hero-supporting-copy">
            Procore peut rester sur le terrain. SharePoint peut garder les
            documents. ProJD coordonne le travail ERP du bureau.
          </p>
        </div>
        <div className="home-hero-product">
          <ErpPreview />
        </div>
      </section>

      <section className="product-signal-bar" aria-label="Périmètre ProJD">
        <span>Un seul environnement</span>
        <div>
          {productSignals.map((signal) => (
            <strong key={signal}>{signal}</strong>
          ))}
        </div>
      </section>

      <section className="compact-section outcome-section">
        <div className="section-intro">
          <p className="eyebrow">Un ERP fait pour travailler</p>
          <h2>Moins de ressaisie. Plus de contexte pour décider.</h2>
          <p>
            Chaque bloc répond à un flux réel du chantier et reste relié au
            projet, aux entreprises et aux personnes concernées.
          </p>
        </div>
        <div className="outcome-grid">
          {productPillars.map((pillar) => (
            <article className="outcome-card" key={pillar.code}>
              <span>{pillar.code}</span>
              <h3>{pillar.title}</h3>
              <p>{pillar.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="compact-section role-section">
        <div className="section-heading-row">
          <div>
            <p className="eyebrow">Par équipe</p>
            <h2>La bonne lecture pour chaque rôle.</h2>
          </div>
          <Link className="text-link" href="/solutions">
            Voir toutes les solutions <span aria-hidden="true">→</span>
          </Link>
        </div>
        <div className="role-grid">
          {solutionRoles.map((solution) => (
            <Link
              className="role-card"
              href={`/solutions/${solution.slug}`}
              key={solution.slug}
            >
              <span>{solution.code}</span>
              <div>
                <strong>{solution.role}</strong>
                <p>{solution.headline}</p>
              </div>
              <small aria-hidden="true">↗</small>
            </Link>
          ))}
        </div>
      </section>

      <section className="compact-section evidence-section">
        <div className="evidence-copy">
          <p className="eyebrow">Ce qui est démontrable aujourd’hui</p>
          <h2>Une base opérationnelle, avec des limites affichées clairement.</h2>
          <p>
            ProJD est proposé avec un déploiement accompagné. Les modules
            disponibles sont présentés comme tels; les fonctions en évolution
            ne sont jamais vendues comme terminées.
          </p>
          <Link className="button light" href="/projd">
            Voir la présentation produit
          </Link>
        </div>
        <div className="evidence-lists">
          <div>
            <strong>Disponible</strong>
            <ul>
              {operationalProof.available.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="evolving-list">
            <strong>En évolution</strong>
            <ul>
              {operationalProof.evolving.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <MarketingCta
        eyebrow="Votre contexte"
        title="Voyez ProJD avec vos vrais workflows de construction."
        text="Choisissez les équipes, les modules et les intégrations à présenter. Le déploiement commence par un périmètre pilote clair."
        primaryHref="/commander"
        primaryLabel="Configurer une proposition"
        secondaryHref="/demo"
        secondaryLabel="Préparer la démo"
      />
    </main>
  );
}
