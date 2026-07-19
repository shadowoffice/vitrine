import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL("https://fichero.cloud"),
  title: {
    default: "Fichero | ERP construction pour entrepreneurs québécois",
    template: "%s | Fichero",
  },
  description:
    "Fichero réunit vitrine SaaS, pilotage Fondation et ERP ProJD pour les entrepreneurs de la construction au Québec.",
  openGraph: {
    title: "Fichero",
    description:
      "Une plateforme ERP moderne pour piloter projets, coûts, documents, domaines et instances clients.",
    url: "https://fichero.cloud",
    siteName: "Fichero",
    locale: "fr_CA",
    type: "website",
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
      <body>{children}</body>
    </html>
  );
}
