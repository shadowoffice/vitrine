import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Conditions d’utilisation",
  description:
    "Conditions générales d’utilisation de la vitrine, de la démonstration et des contenus publics ProJD.",
  alternates: {
    canonical: "/conditions",
  },
};

const conditions = [
  {
    code: "01",
    title: "Contenu public",
    text: "Les pages décrivent le périmètre démontrable de ProJD au moment de leur publication. Une proposition écrite confirme toujours les fonctions, intégrations, délais et coûts applicables à un client.",
  },
  {
    code: "02",
    title: "Environnement de démo",
    text: "La démonstration utilise des données fictives et sert à l’évaluation. Elle ne constitue ni un environnement de production ni une preuve d’activation, de paiement ou de conformité.",
  },
  {
    code: "03",
    title: "Intégrations externes",
    text: "Procore, Microsoft 365, SharePoint et les autres services demeurent soumis à leurs licences, permissions, disponibilités et conditions respectives.",
  },
  {
    code: "04",
    title: "Décisions sensibles",
    text: "Les rapports, suivis de conformité et données financières soutiennent le travail humain. Ils ne remplacent pas une validation comptable, juridique ou réglementaire qualifiée.",
  },
] as const;

export default function TermsPage() {
  return (
    <main id="contenu">
      <section className="page-hero policy-hero">
        <p className="eyebrow">Conditions d’utilisation</p>
        <h1>Un cadre simple pour les surfaces publiques ProJD.</h1>
        <p>
          Ces conditions résument l’usage de la vitrine et de la démo. Les
          engagements commerciaux finaux sont ceux de la proposition et du
          contrat acceptés par le client.
        </p>
      </section>

      <section className="compact-section policy-grid">
        {conditions.map((condition) => (
          <article key={condition.code}>
            <span>{condition.code}</span>
            <div>
              <h2>{condition.title}</h2>
              <p>{condition.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="compact-section policy-action">
        <div>
          <p className="eyebrow">Périmètre client</p>
          <h2>Faire confirmer les conditions de votre implantation.</h2>
          <p>
            La demande de proposition sert à documenter les modules, les accès,
            les intégrations et les responsabilités à valider.
          </p>
        </div>
        <Link className="button primary" href="/commander">
          Configurer une proposition
        </Link>
      </section>
    </main>
  );
}
