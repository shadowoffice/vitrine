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
    "ProJD est un ERP construction SaaS pour entrepreneurs québécois: projets, sous-traitants, appels d'offres, portail, documents, API et instance dédiée.",
  keywords: [
    "ERP construction Québec",
    "ProJD",
    "logiciel construction",
    "gestion projet construction",
    "gestion chantier Québec",
    "estimation construction",
    "portail sous-traitants construction",
    "appel d'offres construction",
    "API ERP construction",
    "Procore",
    "SharePoint",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "ProJD | ERP construction pour entrepreneurs québécois",
    description:
      "ERP construction pour piloter projets, coûts, sous-traitants, appels d'offres, documents, portail et API.",
    url: "https://fichero.cloud",
    siteName: "ProJD",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProJD",
    description: "ERP construction Québec avec projets, portail sous-traitants, appels d'offres, documents et API.",
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
