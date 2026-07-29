import Link from "next/link";

import { navigation } from "@/lib/site-content";

const NavLinks = () => (
  <>
    {navigation.map((item) => (
      <Link key={item.href} href={item.href}>
        {item.label}
      </Link>
    ))}
  </>
);

export function SiteHeader() {
  return (
    <header className="site-header">
      <div className="header-inner">
        <Link className="brand" href="/" aria-label="ProJD — accueil">
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

        <nav className="desktop-navigation" aria-label="Navigation principale">
          <NavLinks />
        </nav>

        <div className="header-actions">
          <a
            className="header-link"
            href="https://login.fichero.cloud/login"
          >
            Login SaaS
          </a>
          <Link className="header-link" href="/demo">
            Voir la démo
          </Link>
          <Link className="header-cta" href="/commander">
            Configurer ProJD
          </Link>
        </div>

        <details className="mobile-navigation">
          <summary aria-label="Ouvrir le menu">
            <span />
            <span />
            <span />
          </summary>
          <nav aria-label="Navigation mobile">
            <NavLinks />
            <a href="https://login.fichero.cloud/login">Login SaaS</a>
            <Link href="/demo">Voir la démo</Link>
            <Link className="mobile-nav-cta" href="/commander">
              Configurer ProJD
            </Link>
          </nav>
        </details>
      </div>
    </header>
  );
}
