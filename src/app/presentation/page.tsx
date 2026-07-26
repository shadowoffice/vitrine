import type { Metadata } from "next";

import { PresentationDeck } from "./PresentationDeck";

export const metadata: Metadata = {
  title: "Présentation commerciale de ProJD",
  description:
    "Découvrez en six diapositives les flux démontrables, les intégrations encadrées et le mode d’implantation de l’ERP de construction ProJD.",
  alternates: {
    canonical: "/presentation",
  },
  openGraph: {
    title: "Présentation commerciale de ProJD",
    description:
      "Un aperçu compact de ProJD : projets, finance construction, appels d’offres, partenaires, rapports et intégrations.",
    url: "/presentation",
    type: "website",
  },
};

export default function PresentationPage() {
  return (
    <main className="presentation-page" id="contenu">
      <PresentationDeck />
    </main>
  );
}
