import type { Metadata } from "next";

import { PrivacyAnalytics } from "./_components/PrivacyAnalytics";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fichero.cloud"),
  title: {
    default: "Fichero | ERP construction pour entrepreneurs québécois",
    template: "%s | Fichero",
  },
  description:
    "Fichero présente l'offre, Fondation opère les tenants SaaS et ProJD livre l'ERP construction pour les entrepreneurs québécois.",
  keywords: [
    "ERP construction Québec",
    "ProJD",
    "Fondation SaaS",
    "Fichero",
    "Procore",
    "SharePoint",
    "Outlook",
  ],
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Fichero | ERP construction pour entrepreneurs québécois",
    description:
      "Vitrine SaaS, contrôle Fondation et ERP ProJD pour piloter projets, coûts, documents, domaines et instances clients.",
    url: "https://fichero.cloud",
    siteName: "Fichero",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Fichero",
    description: "ERP construction, contrôle SaaS et intégrations Procore, SharePoint et Outlook.",
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
