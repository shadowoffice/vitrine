import { MarketingCta } from "../_components/MarketingCta";
import { SiteHeader } from "../_components/SiteHeader";
import { statusTargets } from "@/lib/site-content";

export const metadata = {
  title: "Statut",
  description: "Points de statut publics pour la vitrine Fichero, Fondation et les tenants ERP.",
};

export default function StatusPage() {
  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Acheter ProJD" />

      <section className="page-hero">
        <p className="eyebrow">Statut</p>
        <h1>Écosystème Fichero</h1>
        <p>
          Cette page donne des raccourcis publics. Les détails opérationnels, incidents et actions
          runtime restent dans Fondation avec les permissions appropriées.
        </p>
      </section>

      <section className="section">
        <div className="status-grid">
          {statusTargets.map((target) => (
            <a href={target.href} key={target.label}>
              <span>{target.status}</span>
              <strong>{target.label}</strong>
              <small>{target.detail}</small>
            </a>
          ))}
        </div>
      </section>

      <section className="section split-section">
        <div>
          <p className="eyebrow">Transparence</p>
          <h2>Le public voit les portes d’entrée. Fondation garde les commandes.</h2>
          <p>
            Les opérations comme redémarrage, inspection runtime, DNS, TLS, sauvegardes et rollback
            doivent rester authentifiées et auditables dans le control plane.
          </p>
        </div>
        <div className="card">
          <h3>Analytics respectueux</h3>
          <p>
            La vitrine utilise une mesure first-party sans cookie, sans identifiant visiteur et sans
            stockage d’adresse IP applicative.
          </p>
        </div>
      </section>

      <MarketingCta
        title="Besoin d'un tenant ProJD?"
        text="Le formulaire d'achat crée le point de départ; Fondation prend ensuite le relais côté paiement, licence et opérations."
        primaryHref="/commander"
        primaryLabel="Acheter ProJD"
      />
    </main>
  );
}
