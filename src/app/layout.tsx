import type { Metadata } from "next";
import { Manrope } from "next/font/google";

import { PrivacyAnalytics } from "./_components/PrivacyAnalytics";
import { SiteFooter } from "./_components/SiteFooter";
import { SiteHeader } from "./_components/SiteHeader";
import "./globals.css";

const manrope = Manrope({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-manrope",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://fichero.cloud"),
  applicationName: "ProJD",
  title: {
    default: "ProJD — ERP construction pour entrepreneurs québécois",
    template: "%s | ProJD",
  },
  description:
    "ProJD réunit projets, finances, contrats, appels d'offres, partenaires et documents dans un ERP construction adapté aux entrepreneurs québécois.",
  keywords: [
    "ERP construction Québec",
    "ProJD",
    "logiciel construction",
    "gestion projet construction",
    "gestion chantier Québec",
    "estimation construction",
    "portail sous-traitants",
    "appel d'offres construction",
    "comptes fournisseurs construction",
    "finance construction",
    "Procore",
    "SharePoint",
  ],
  openGraph: {
    title: "ProJD — l’ERP construit pour la construction",
    description:
      "Projets, coûts, contrats, appels d’offres, partenaires et documents dans un seul environnement de gestion.",
    url: "https://fichero.cloud",
    siteName: "ProJD",
    locale: "fr_CA",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "ProJD — ERP construction",
    description:
      "Un environnement de gestion pour les projets, les finances, les appels d’offres et les partenaires.",
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
    <html className={manrope.variable} lang="fr-CA">
      <body>
        <a className="skip-link" href="#contenu">
          Aller au contenu
        </a>
        <SiteHeader />
        {children}
        <SiteFooter />
        <PrivacyAnalytics />
      </body>
    </html>
  );
}
