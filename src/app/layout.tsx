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
    "ProJD centralise projets, budgets, soumissions, factures, documents et rapports pour les entrepreneurs de la construction au Québec.",
  keywords: [
    "ERP construction Québec",
    "ProJD",
    "logiciel construction",
    "gestion projet construction",
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
      "ERP construction pour piloter projets, coûts, soumissions, factures, documents et rapports.",
    url: "https://fichero.cloud",
    siteName: "ProJD",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProJD",
    description: "ERP construction avec projets, budgets, soumissions, factures, documents et intégrations.",
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
