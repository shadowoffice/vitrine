import type { Metadata } from "next";

import { MarketingCta } from "../_components/MarketingCta";
import { statusTargets } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Points d’accès",
  description:
    "Raccourcis publics vers la vitrine, la démo fictive et le parcours de configuration ProJD.",
  alternates: {
    canonical: "/statut",
  },
};

export default function StatusPage() {
  return (
    <main id="contenu">
      <section className="page-hero centered-page-hero">
        <p className="eyebrow">Points d’accès</p>
        <h1>Les portes d’entrée publiques de ProJD.</h1>
        <p>
          Cette page fournit des raccourcis. Elle ne remplace pas une plateforme
          de surveillance temps réel ni une confirmation de paiement.
        </p>
      </section>

      <section className="compact-section access-grid-section">
        <div className="access-grid">
          {statusTargets.map((target) => (
            <a href={target.href} key={target.label}>
              <span>{target.status}</span>
              <strong>{target.label}</strong>
              <small>{target.detail}</small>
              <i aria-hidden="true">↗</i>
            </a>
          ))}
        </div>
      </section>

      <section className="compact-section status-note-section">
        <div>
          <p className="eyebrow">Transparence</p>
          <h2>Un lien accessible n’est pas une activation confirmée.</h2>
        </div>
        <p>
          Les paiements, licences, domaines, connecteurs et accès ERP sont
          confirmés par les services serveur et l’équipe d’implantation, jamais
          par un paramètre visible dans l’URL.
        </p>
      </section>

      <MarketingCta
        title="Besoin de vérifier un parcours avant de commencer?"
        text="Utilisez la démo fictive pour découvrir les écrans, puis configurez une proposition pour cadrer le projet pilote."
        primaryHref="/demo"
        primaryLabel="Ouvrir la page Démo"
        secondaryHref="/commander"
        secondaryLabel="Configurer ProJD"
      />
    </main>
  );
}
