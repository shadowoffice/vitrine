import type { Metadata } from "next";
import Link from "next/link";

import { ErpPreview } from "../_components/ErpPreview";
import { MarketingCta } from "../_components/MarketingCta";
import { demoErpUrl } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Démo ERP",
  description:
    "Préparez un parcours court dans l’environnement de démonstration ProJD avec des données de construction fictives.",
  alternates: {
    canonical: "/demo",
  },
};

const demoTracks = [
  {
    code: "01",
    title: "Projet et coordination",
    text: "Ouvrir un projet, lire les risques et actions, puis reconnaître le rapport hebdomadaire.",
  },
  {
    code: "02",
    title: "Estimation et partenaires",
    text: "Suivre un appel d’offres, ses documents, les invitations et la comparaison des réponses.",
  },
  {
    code: "03",
    title: "Finance et fournisseurs",
    text: "Lire budget, engagements, coûts directs, facture PDF et file d’approbation.",
  },
] as const;

export default function DemoPage() {
  return (
    <main id="contenu">
      <section className="demo-hero">
        <div className="demo-hero-copy">
          <p className="eyebrow">Démo ProJD</p>
          <h1>Voyez le produit avant de parler forfait.</h1>
          <p>
            L’environnement de démonstration est distinct du site public et
            utilise des données fictives couvrant les principaux flux ProJD.
          </p>
          <div className="hero-actions">
            <a
              className="button primary"
              href={demoErpUrl}
              rel="noreferrer"
              target="_blank"
            >
              Ouvrir la démo ERP
              <span aria-hidden="true">↗</span>
            </a>
            <Link className="button secondary" href="/guides">
              Consulter les guides
            </Link>
          </div>
          <div className="demo-disclosure">
            <strong>Données fictives</strong>
            <span>
              Aucune information client réelle n&apos;est nécessaire pour
              parcourir le scénario de démonstration.
            </span>
          </div>
        </div>
        <ErpPreview />
      </section>

      <section className="compact-section demo-track-section">
        <div className="section-intro">
          <p className="eyebrow">Parcours conseillé</p>
          <h2>Trois espaces suffisent pour comprendre ProJD.</h2>
        </div>
        <div className="demo-track-grid">
          {demoTracks.map((track) => (
            <article key={track.code}>
              <span>{track.code}</span>
              <h3>{track.title}</h3>
              <p>{track.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="compact-section demo-followup">
        <div>
          <p className="eyebrow">Démo accompagnée</p>
          <h2>Remplacer le scénario fictif par votre réalité.</h2>
        </div>
        <div>
          <p>
            Une présentation ciblée peut reprendre vos rôles, un projet type,
            votre structure de coûts et les connecteurs à évaluer.
          </p>
          <Link className="text-link" href="/commander">
            Configurer une proposition <span aria-hidden="true">→</span>
          </Link>
        </div>
      </section>

      <MarketingCta
        title="Choisir le premier workflow à évaluer."
        text="Projet, finance, estimation ou comptes fournisseurs : commencez par le problème le plus coûteux à gérer aujourd’hui."
        primaryHref="/commander"
        primaryLabel="Configurer une proposition"
        secondaryHref="/modules"
        secondaryLabel="Comparer les modules"
      />
    </main>
  );
}
