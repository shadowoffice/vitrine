import Link from "next/link";

import { navigation } from "@/lib/site-content";

type SiteHeaderProps = {
  ctaHref?: string;
  ctaLabel?: string;
};

export function SiteHeader({ ctaHref = "/commander", ctaLabel = "Acheter ProJD" }: SiteHeaderProps) {
  return (
    <header className="site-header" aria-label="Navigation principale">
      <Link className="brand" href="/" aria-label="ProJD accueil">
        <span className="brand-mark">P</span>
        <span>ProJD</span>
      </Link>
      <nav>
        {navigation.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
      <Link className="header-cta" href={ctaHref}>
        {ctaLabel}
      </Link>
    </header>
  );
}
