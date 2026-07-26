import type { Metadata } from "next";
import Link from "next/link";

import { MarketingCta } from "../_components/MarketingCta";
import { securityItems } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Sécurité et données",
  description:
    "Découvrez les garde-fous ProJD pour les accès, l’audit, le portail partenaires et les intégrations externes.",
  alternates: {
    canonical: "/securite",
  },
};

const honestLimits = [
  "ProJD ne revendique aucune certification de sécurité non auditée.",
  "Le suivi RBQ, CCQ, CNESST ou Revenu Québec ne constitue pas une validation légale.",
  "L’OCR des factures ne comptabilisera jamais une extraction sans validation humaine.",
  "Les intégrations dépendent des permissions et capacités réelles de l’environnement client.",
] as const;

export default function SecurityPage() {
  return (
    <main id="contenu">
      <section className="page-hero security-hero">
        <p className="eyebrow">Sécurité et données</p>
        <h1>Des garde-fous concrets, des limites dites clairement.</h1>
        <p>
          ProJD protège les flux sensibles par l’autorité serveur, le
          cloisonnement des accès externes et une traçabilité métier. Les
          fonctions encore en évolution sont identifiées comme telles.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/documentation">
            Lire la documentation
          </Link>
          <Link className="button secondary" href="/confidentialite">
            Confidentialité
          </Link>
        </div>
      </section>

      <section className="compact-section security-grid-section">
        <div className="security-grid">
          {securityItems.map((item) => (
            <article key={item.code}>
              <span>{item.code}</span>
              <h2>{item.title}</h2>
              <p>{item.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="compact-section limits-section">
        <div>
          <p className="eyebrow">Ce que nous ne prétendons pas</p>
          <h2>La confiance commence par ne pas survendre.</h2>
          <p>
            Une implantation ProJD est cadrée selon le périmètre réellement
            disponible et validé avec le client.
          </p>
        </div>
        <ul>
          {honestLimits.map((limit) => (
            <li key={limit}>{limit}</li>
          ))}
        </ul>
      </section>

      <MarketingCta
        title="Évaluer les accès et les données avant l’implantation."
        text="La proposition précise les rôles, les sources externes, les permissions requises et les comportements attendus en cas d’échec."
        primaryHref="/commander"
        primaryLabel="Configurer une proposition"
        secondaryHref="/modules/integrations"
        secondaryLabel="Voir les intégrations"
      />
    </main>
  );
}
