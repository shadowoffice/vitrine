import Link from "next/link";

import { navigation, saasLoginUrl } from "@/lib/site-content";

type SiteHeaderProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

export function SiteHeader({ ctaHref = saasLoginUrl, ctaLabel = "Connexion SaaS" }: SiteHeaderProps) {
  return (
    <header className="site-header" aria-label="Navigation principale">
      <Link className="brand" href="/" aria-label="Fichero accueil">
        <span className="brand-mark">F</span>
        <span>Fichero</span>
      </Link>
      <nav>
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <a className="header-cta" href={ctaHref}>
        {ctaLabel}
      </a>
    </header>
  );
}
