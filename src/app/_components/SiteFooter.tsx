import Link from "next/link";

import { demoErpUrl } from "@/lib/site-content";

const productLinks = [
  { label: "Présentation", href: "/projd" },
  { label: "Solutions par équipe", href: "/solutions" },
  { label: "Solutions par secteur", href: "/secteurs" },
  { label: "Modules", href: "/modules" },
  { label: "Tarifs", href: "/tarifs" },
];

const resourceLinks = [
  { label: "Centre de ressources", href: "/ressources" },
  { label: "Présentation interactive", href: "/presentation" },
  { label: "Documentation", href: "/documentation" },
  { label: "Guides pratiques", href: "/guides" },
  { label: "Comparaisons", href: "/comparer" },
  { label: "Glossaire", href: "/glossaire" },
  { label: "Scénarios vérifiables", href: "/scenarios" },
  { label: "Sécurité et données", href: "/securite" },
];

export function SiteFooter() {
  return (
    <footer className="site-footer">
      <div className="footer-inner">
        <div className="footer-brand">
          <Link className="brand brand-on-dark" href="/" aria-label="ProJD — accueil">
            <span className="brand-mark" aria-hidden="true">
              <span />
              <span />
              <span />
            </span>
            <span className="brand-copy">
              <strong>ProJD</strong>
              <small>ERP construction</small>
            </span>
          </Link>
          <p>
            Un environnement de gestion pensé pour les entrepreneurs québécois,
            de l&apos;estimation au suivi financier.
          </p>
        </div>

        <div className="footer-column">
          <strong>Produit</strong>
          {productLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <strong>Ressources</strong>
          {resourceLinks.map((item) => (
            <Link href={item.href} key={item.href}>
              {item.label}
            </Link>
          ))}
        </div>

        <div className="footer-column">
          <strong>Accès</strong>
          <a href={demoErpUrl} rel="noreferrer" target="_blank">
            Démo ERP
          </a>
          <Link href="/commander">Configurer ProJD</Link>
          <Link href="/statut">Points d&apos;accès</Link>
          <Link href="/confidentialite">Confidentialité</Link>
          <Link href="/conditions">Conditions d&apos;utilisation</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <span>© {new Date().getFullYear()} ProJD</span>
        <span>Conçu pour la construction au Québec.</span>
      </div>
    </footer>
  );
}
