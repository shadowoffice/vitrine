import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Confidentialité",
  description:
    "Résumé transparent des données utilisées par la vitrine ProJD, son analytique sans cookie et son formulaire de configuration.",
  alternates: {
    canonical: "/confidentialite",
  },
};

const privacySections = [
  {
    code: "01",
    title: "Mesure d’audience",
    text: "La vitrine utilise une mesure first-party sans cookie et sans identifiant visiteur. L’application ne conserve pas l’adresse IP dans les événements analytiques.",
  },
  {
    code: "02",
    title: "Demande de proposition",
    text: "Les renseignements saisis servent à préparer une démonstration et un dossier commercial. Le formulaire public ne demande ni adresse fiscale ni information de paiement.",
  },
  {
    code: "03",
    title: "Conservation locale",
    text: "La demande est reçue par le serveur de la vitrine et conservée dans une boîte locale à accès restreint. L’accès, la relève et la suppression doivent suivre la politique d’exploitation du service.",
  },
  {
    code: "04",
    title: "Durée et demandes",
    text: "La durée de conservation et les responsabilités finales doivent être précisées dans la proposition ou le contrat client. Une demande liée aux données peut être inscrite dans le formulaire de configuration.",
  },
] as const;

export default function PrivacyPage() {
  return (
    <main id="contenu">
      <section className="page-hero policy-hero">
        <p className="eyebrow">Confidentialité</p>
        <h1>Ce que la vitrine recueille — et pourquoi.</h1>
        <p>
          Cette page décrit le fonctionnement technique actuel de fichero.cloud.
          Elle ne remplace pas les clauses contractuelles applicables à une
          instance ProJD cliente.
        </p>
      </section>

      <section className="compact-section policy-grid">
        {privacySections.map((section) => (
          <article key={section.code}>
            <span>{section.code}</span>
            <div>
              <h2>{section.title}</h2>
              <p>{section.text}</p>
            </div>
          </article>
        ))}
      </section>

      <section className="compact-section policy-action">
        <div>
          <p className="eyebrow">Question sur vos données</p>
          <h2>Inscrire la demande dans le dossier ProJD.</h2>
          <p>
            Utilisez le champ Contexte pour préciser une demande d’accès, de
            correction ou de suppression liée au formulaire public.
          </p>
        </div>
        <Link className="button primary" href="/commander">
          Ouvrir le formulaire
        </Link>
      </section>
    </main>
  );
}
