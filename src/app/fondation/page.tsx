import Link from "next/link";

import { MarketingCta } from "../_components/MarketingCta";
import { SiteHeader } from "../_components/SiteHeader";
import { statusTargets } from "@/lib/site-content";

export const metadata = {
  title: "Fondation",
  description: "Control plane SaaS pour clients, tenants, domaines, TLS, licences, runtime et audit.",
};

const foundationCapabilities = [
  "Dossiers clients, contacts, support et portefeuille de tenants.",
  "Domaines, routage, certificats TLS et état d'expiration.",
  "Licences, plans, abonnements et miroirs de facturation.",
  "Runtime Docker/Kubernetes préparé avec actions contrôlées et auditables.",
  "Permissions séparées pour owner, billing, ops et support.",
];

export default function FondationPage() {
  return (
    <main>
      <SiteHeader ctaHref="/commander" ctaLabel="Acheter ProJD" />

      <section className="page-hero">
        <p className="eyebrow">Control plane SaaS</p>
        <h1>Fondation</h1>
        <p>
          Fondation garde la gouvernance de la plateforme: clients, tenants ERP, DNS, TLS,
          licences, opérations runtime, audit et préparation de provisioning.
        </p>
        <div className="hero-actions">
          <a className="button primary" href="https://login.fichero.cloud/login">
            Connexion SaaS
          </a>
          <Link className="button secondary" href="/statut">
            Voir le statut
          </Link>
        </div>
      </section>

      <section className="section two-column-section">
        <div>
          <p className="eyebrow">Responsabilité</p>
          <h2>Fondation contrôle l’environnement, pas le métier chantier.</h2>
          <p>
            ProJD reste l’ERP. Fondation orchestre les accès, les tenants, le domaine, les licences
            et les opérations nécessaires pour livrer l’ERP de façon structurée.
          </p>
        </div>
        <ul className="check-list">
          {foundationCapabilities.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="section">
        <div className="section-heading">
          <p className="eyebrow">Surveillance</p>
          <h2>Les points d’entrée importants restent visibles.</h2>
        </div>
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

      <MarketingCta
        title="Brancher la vitrine à Fondation"
        text="Les achats ProJD peuvent devenir des dossiers client, des licences, des sous-domaines et des demandes de tenant à activer."
        primaryHref="/commander"
        primaryLabel="Acheter ProJD"
      />
    </main>
  );
}
