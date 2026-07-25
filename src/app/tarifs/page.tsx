import Link from "next/link";

import { MarketingCta } from "../_components/MarketingCta";
import { SiteHeader } from "../_components/SiteHeader";
import { packages } from "@/lib/site-content";

export const metadata = {
  title: "Tarifs et forfaits",
  description:
    "Forfaits ProJD pour lancer un ERP construction avec projets, portail, appels d'offres, documents, API et instance dédiée.",
};

const commercialNotes = [
  "Les prix finaux dépendent du nombre d'utilisateurs, du portail, des intégrations et du niveau d'accompagnement.",
  "Un groupe pilote permet de valider les workflows projets et sous-traitants avant une activation plus large.",
  "Les modules sensibles comme factures, API, documents et intégrations sont activés progressivement.",
];

export default function PricingPage() {
  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Commander ProJD" />

      <section className="page-hero">
        <p className="eyebrow">Tarifs</p>
        <h1>Forfaits ProJD</h1>
        <p>
          Les forfaits donnent un point de départ clair pour acheter ProJD, choisir les
          utilisateurs, cadrer le portail et préparer l&apos;instance ERP de la compagnie.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/commander">
            Commander ProJD
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
            ProJD doit d’abord comprendre le contexte chantier, les outils déjà en place, les
            contraintes de domaine, les sous-traitants à inviter, les besoins API et la maturité
            des données.
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
        text="Le formulaire d'achat donne assez de contexte pour préparer l'espace ProJD, les licences, le portail, l'instance Docker et l'accompagnement."
        primaryHref="/commander"
        primaryLabel="Commander ProJD"
      />
    </main>
  );
}
