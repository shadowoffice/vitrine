import Link from "next/link";

import { saasLoginUrl } from "@/lib/site-content";

type MarketingCtaProps = {
  eyebrow?: string;
  title: string;
  text: string;
  primaryHref?: string;
  primaryLabel?: string;
  secondaryHref?: string;
  secondaryLabel?: string;
};

export function MarketingCta({
  eyebrow = "Prochaine étape",
  title,
  text,
  primaryHref = "/commander",
  primaryLabel = "Acheter ProJD",
  secondaryHref = saasLoginUrl,
  secondaryLabel = "Connexion SaaS",
}: MarketingCtaProps) {
  return (
    <section className="contact-section" aria-label={title}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="contact-actions">
        <Link className="button primary" href={primaryHref}>
          {primaryLabel}
        </Link>
        <a className="button secondary" href={secondaryHref}>
          {secondaryLabel}
        </a>
      </div>
    </section>
  );
}
