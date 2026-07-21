import Link from "next/link";

import { MarketingCta } from "../_components/MarketingCta";
import { SiteHeader } from "../_components/SiteHeader";
import { packages } from "@/lib/site-content";

export const metadata = {
  title: "Tarifs et forfaits",
  description: "Forfaits Fichero pour achat ProJD, tenant ERP et operation SaaS Fondation.",
};

const commercialNotes = [
  "Les prix finaux dépendent du nombre d'utilisateurs, des intégrations et du niveau d'accompagnement.",
  "Un tenant pilote permet de valider les workflows avant une activation plus large.",
  "Les modules sensibles comme factures, OCR, runtime et sauvegardes sont activés progressivement.",
];

export default function PricingPage() {
  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Acheter ProJD" />

      <section className="page-hero">
        <p className="eyebrow">Tarifs</p>
        <h1>Forfaits Fichero</h1>
        <p>
          Les forfaits servent à cadrer la discussion commerciale sans promettre une implantation
          uniforme pour toutes les entreprises de construction.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/commander">
            Acheter ProJD
          </Link>
          <Link className="button secondary" href="/projd">
            Voir ProJD
          </Link>
        </div>
      </section>

      <section className="section">
        <div className="pricing-grid">
          {packages.map((plan) => (
            <article className={plan.featured ? "card pricing-card featured" : "card pricing-card"} key={plan.name}>
              <p>{plan.name}</p>
              <h3>{plan.price}</h3>
              <small>{plan.setup}</small>
              <span>{plan.description}</span>
              <ul>
                {plan.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <Link className="button secondary" href={`/commander?plan=${plan.code}`}>
                Ajouter au panier
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="section split-section">
        <div>
          <p className="eyebrow">Cadre commercial</p>
          <h2>Un devis propre vient après la qualification.</h2>
          <p>
            Fichero doit d’abord comprendre le contexte chantier, les outils déjà en place, les
            contraintes de domaine et la maturité des données.
          </p>
        </div>
        <ul className="check-list">
          {commercialNotes.map((note) => (
            <li key={note}>{note}</li>
          ))}
        </ul>
      </section>

      <MarketingCta
        title="Acheter le forfait adapté"
        text="Le formulaire d'achat donne assez de contexte pour créer le dossier Fondation, réserver le sous-domaine et préparer la licence."
        primaryHref="/commander"
        primaryLabel="Acheter ProJD"
      />
    </main>
  );
}
