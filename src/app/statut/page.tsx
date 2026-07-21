import { MarketingCta } from "../_components/MarketingCta";
import { SiteHeader } from "../_components/SiteHeader";
import { statusTargets } from "@/lib/site-content";

export const metadata = {
  title: "Statut",
  description: "Points de statut publics pour le site ProJD, la démo ERP, le paiement et le support.",
};

export default function StatusPage() {
  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Acheter ProJD" />

      <section className="page-hero">
        <p className="eyebrow">Statut</p>
        <h1>Statut ProJD</h1>
        <p>
          Cette page donne les raccourcis publics utiles: vitrine, démo ERP, paiement et support
          d’activation.
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
          <h2>Le public voit les portes d’entrée. Les opérations restent contrôlées.</h2>
          <p>
            Les opérations sensibles comme paiement, activation, accès et intégrations doivent
            rester validées par l’équipe ProJD.
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
        title="Besoin d'un espace ProJD?"
        text="Le formulaire d'achat crée le point de départ; l'équipe ProJD prend ensuite le relais côté paiement, licence et activation."
        primaryHref="/commander"
        primaryLabel="Acheter ProJD"
      />
    </main>
  );
}
