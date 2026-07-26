import Link from "next/link";

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
  eyebrow = "Passer à l’action",
  title,
  text,
  primaryHref = "/commander",
  primaryLabel = "Configurer ProJD",
  secondaryHref = "/demo",
  secondaryLabel = "Voir la démo",
}: MarketingCtaProps) {
  return (
    <section className="conversion-panel" aria-label={title}>
      <div>
        <p className="eyebrow">{eyebrow}</p>
        <h2>{title}</h2>
        <p>{text}</p>
      </div>
      <div className="conversion-actions">
        <Link className="button primary" href={primaryHref}>
          {primaryLabel}
        </Link>
        <Link className="button secondary" href={secondaryHref}>
          {secondaryLabel}
        </Link>
      </div>
    </section>
  );
}
