import Link from "next/link";

import { siteUrl } from "@/lib/site-content";

type BreadcrumbItem = {
  label: string;
  href?: string;
};

type BreadcrumbsProps = {
  currentPath?: string;
  items: BreadcrumbItem[];
};

export function Breadcrumbs({ currentPath, items }: BreadcrumbsProps) {
  const breadcrumbItems = [
    { label: "Accueil", href: "/" },
    ...items.map((item, index) => ({
      label: item.label,
      href:
        item.href ??
        (index === items.length - 1 && currentPath ? currentPath : undefined),
    })),
  ].filter(
    (item): item is { label: string; href: string } =>
      typeof item.href === "string",
  );
  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: breadcrumbItems.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.label,
      item: new URL(item.href, siteUrl).toString(),
    })),
  };

  return (
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd).replace(/</g, "\\u003c"),
        }}
        type="application/ld+json"
      />
      <nav className="breadcrumbs" aria-label="Fil d’Ariane">
        <Link href="/">Accueil</Link>
        {items.map((item) => (
          <span key={`${item.href ?? "current"}-${item.label}`}>
            <span aria-hidden="true">/</span>
            {item.href ? (
              <Link href={item.href}>{item.label}</Link>
            ) : (
              <strong>{item.label}</strong>
            )}
          </span>
        ))}
      </nav>
    </>
  );
}
