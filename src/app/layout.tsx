import type { Metadata } from "next";

import { PrivacyAnalytics } from "./_components/PrivacyAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fichero.cloud"),
  title: {
    default: "ProJD | ERP construction pour entrepreneurs québécois",
    template: "%s | ProJD",
  },
  description:
    "ProJD est un ERP construction pour les entrepreneurs du Québec: projets, chantiers, budgets, soumissions, factures, documents et rapports.",
  keywords: [
    "ERP construction Québec",
    "ProJD",
    "logiciel construction",
    "gestion projet construction",
    "gestion chantier Québec",
    "estimation construction",
    "Procore",
    "SharePoint",
    "Outlook",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ProJD | ERP construction pour entrepreneurs québécois",
    description:
      "ERP construction pour piloter chantiers, coûts, soumissions, factures, documents et rapports.",
    url: "https://fichero.cloud",
    siteName: "ProJD",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProJD",
    description: "ERP construction Québec avec chantiers, budgets, soumissions, factures et documents.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr-CA">
      <body>
        {children}
        <PrivacyAnalytics />
      </body>
    </html>
  );
}
