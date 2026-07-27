import type { Metadata } from "next";
import Link from "next/link";

import { MarketingCta } from "../_components/MarketingCta";
import { sectors } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "ERP construction par secteur",
  description:
    "Découvrez des points de départ ProJD pour les entrepreneurs généraux, entrepreneurs spécialisés et équipes multi-projets.",
  alternates: { canonical: "/secteurs" },
  openGraph: {
    title: "ProJD par secteur de construction",
    description:
      "Des parcours ERP cadrés selon les réalités des entrepreneurs généraux, spécialisés et équipes multi-projets.",
    url: "/secteurs",
    type: "website",
  },
};

export default function SectorsPage() {
  return (
    <main id="contenu">
      <section className="page-hero centered-page-hero">
        <p className="eyebrow">Par secteur</p>
        <h1>Commencer par une réalité opérationnelle reconnaissable.</h1>
        <p>
          Ces parcours ne présument ni votre structure ni vos intégrations.
          Ils proposent un premier périmètre à valider avec les équipes
          concernées.
        </p>
      </section>

      <section className="compact-section sector-grid-section">
        <div className="sector-grid">
          {sectors.map((sector) => (
            <Link href={`/secteurs/${sector.slug}`} key={sector.slug}>
              <span>{sector.code}</span>
              <small>{sector.name}</small>
              <h2>{sector.headline}</h2>
              <p>{sector.summary}</p>
              <strong>
                Examiner ce parcours <span aria-hidden="true">→</span>
              </strong>
            </Link>
          ))}
        </div>
      </section>

      <MarketingCta
        title="Le secteur ne suffit pas pour choisir un ERP."
        text="Le projet pilote, les personnes responsables et le premier flux à valider restent les meilleurs critères de cadrage."
        primaryHref="/commander?context=sector-index"
        primaryLabel="Décrire mon contexte"
        secondaryHref="/solutions"
        secondaryLabel="Choisir par rôle"
      />
    </main>
  );
}
