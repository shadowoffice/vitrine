import Link from "next/link";

export default function NotFound() {
  return (
    <main id="contenu">
      <section className="page-hero centered-page-hero">
        <p className="eyebrow">Erreur 404</p>
        <h1>Cette page n’existe pas.</h1>
        <p>
          Le lien est peut-être périmé ou la ressource a été déplacée. Revenez
          à l’accueil ou consultez les ressources ProJD.
        </p>
        <div className="hero-actions">
          <Link className="button primary" href="/">
            Retour à l’accueil
          </Link>
          <Link className="button secondary" href="/ressources">
            Voir les ressources
          </Link>
        </div>
      </section>
    </main>
  );
}
