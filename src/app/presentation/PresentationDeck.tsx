"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type DeckStatusTone = "available" | "evolving" | "activation";

type DeckHighlight = {
  title: string;
  text: string;
};

type DeckAction = {
  href: string;
  label: string;
  emphasis: "primary" | "secondary";
};

type DeckSlide = {
  code: string;
  shortTitle: string;
  eyebrow: string;
  title: string;
  lead: string;
  status: string;
  statusTone: DeckStatusTone;
  highlights: readonly DeckHighlight[];
  noteTitle: string;
  note: string;
  actions?: readonly DeckAction[];
};

const slides: readonly DeckSlide[] = [
  {
    code: "01",
    shortTitle: "Vision",
    eyebrow: "ERP de construction québécois",
    title: "Relier les décisions du bureau au contexte réel des projets.",
    lead:
      "ProJD rassemble projets, finances, appels d’offres, partenaires et documents dans un même environnement de gestion.",
    status: "Bêta accompagnée",
    statusTone: "evolving",
    highlights: [
      {
        title: "Un projet pivot",
        text: "Les coûts, actions, partenaires et documents gardent le même contexte chantier.",
      },
      {
        title: "Des flux complets",
        text: "Chaque module est présenté par le travail qu’il permet de terminer, pas par une liste de cases.",
      },
      {
        title: "Une implantation mesurée",
        text: "Le démarrage cible une équipe, un projet pilote et un résultat vérifiable.",
      },
    ],
    noteTitle: "Positionnement",
    note:
      "ProJD est commercialisé comme une bêta accompagnée. Le périmètre est confirmé avant toute proposition.",
  },
  {
    code: "02",
    shortTitle: "Finance",
    eyebrow: "Finance chantier et fournisseurs",
    title: "Voir le prévu, l’engagé et le réel au même endroit.",
    lead:
      "La structure financière relie phases, codes de coût, budgets, engagements, coûts directs et factures au bon projet.",
    status: "Flux démontrables",
    statusTone: "available",
    highlights: [
      {
        title: "Lecture chantier",
        text: "Budget initial, révisions, engagements et coûts réels se comparent par phase et code de coût.",
      },
      {
        title: "Comptes fournisseurs",
        text: "La facture PDF, sa ventilation, son approbation et son échéance restent dans un dossier traçable.",
      },
      {
        title: "Rapports utiles",
        text: "Les sommaires financiers et exports ciblés préparent la revue de projet.",
      },
    ],
    noteTitle: "Limite actuelle",
    note:
      "La saisie et l’approbation sont disponibles. L’OCR automatisé et l’imputation automatique aux coûts directs ne sont pas promis aujourd’hui.",
  },
  {
    code: "03",
    shortTitle: "Appels d’offres",
    eyebrow: "Estimation, BID et portail partenaires",
    title: "Du budget Excel à une décision d’octroi documentée.",
    lead:
      "ProJD transforme un budget approuvé en lots suivis, invitations ciblées, réponses privées et comparatifs exploitables.",
    status: "Parcours démontrable",
    statusTone: "available",
    highlights: [
      {
        title: "Importer et valider",
        text: "Le classeur conserve sa provenance et doit être approuvé avant la génération des lots.",
      },
      {
        title: "Inviter et suivre",
        text: "Documents, accusés, relances et états de réponse restent associés à chaque partenaire.",
      },
      {
        title: "Comparer sans exposer",
        text: "Chaque soumission demeure privée; budget, cible et prix reçus alimentent la recommandation.",
      },
    ],
    noteTitle: "Limite actuelle",
    note:
      "La décision d’octroi est conservée, mais elle ne crée pas encore automatiquement un engagement financier.",
  },
  {
    code: "04",
    shortTitle: "Pilotage",
    eyebrow: "Gestion de projets et direction",
    title: "Préparer les réunions à partir du travail réel.",
    lead:
      "Le cockpit met en évidence les risques, actions, jalons, échéances et responsables qui demandent une décision.",
    status: "Vues disponibles",
    statusTone: "available",
    highlights: [
      {
        title: "Priorités visibles",
        text: "Le portefeuille et le cockpit font ressortir les blocages et les éléments en retard.",
      },
      {
        title: "Rythme hebdomadaire",
        text: "Rapports de coordination, vues exécutives, impression et exports structurent les rencontres.",
      },
      {
        title: "Contexte Procore",
        text: "RFIs et submittals peuvent être rapprochés en lecture avec leur provenance.",
      },
    ],
    noteTitle: "Rôle du produit",
    note:
      "ProJD coordonne la lecture ERP et les décisions du bureau; il ne cherche pas à remplacer les outils terrain déjà adoptés.",
  },
  {
    code: "05",
    shortTitle: "Intégrations",
    eyebrow: "Procore, SharePoint et Microsoft 365",
    title: "Connecter les sources utiles avec des garde-fous.",
    lead:
      "Les connecteurs gardent la provenance, limitent le périmètre et prévoient un aperçu avant l’activation.",
    status: "Sur activation",
    statusTone: "activation",
    highlights: [
      {
        title: "Documents contrôlés",
        text: "Les mappages Procore–SharePoint respectent les règles de synchronisation, d’exclusion et de confidentialité.",
      },
      {
        title: "Invitations Microsoft 365",
        text: "Les appels d’offres peuvent utiliser des modèles de courriel et des liens de portail ciblés.",
      },
      {
        title: "Lecture encadrée",
        text: "Les mécanismes API et les références Procore utilisent des portées d’accès, des jetons et une trace d’audit.",
      },
    ],
    noteTitle: "Condition d’activation",
    note:
      "Chaque intégration exige les licences, permissions et essais du client. L’ingestion Procore générale et les réunions Outlook ne font pas partie du périmètre actuel.",
  },
  {
    code: "06",
    shortTitle: "Prochaine étape",
    eyebrow: "Une offre commerciale vérifiable",
    title: "Acheter un périmètre mesurable, pas une promesse illimitée.",
    lead:
      "La proposition définit les modules, le projet pilote, les accès à valider et les critères de réussite avant l’implantation.",
    status: "Implantation accompagnée",
    statusTone: "evolving",
    highlights: [
      {
        title: "Démontrable maintenant",
        text: "Projets, finance, appels d’offres, portail partenaires, rapports et premier flux fournisseurs.",
      },
      {
        title: "À activer ensemble",
        text: "Procore, SharePoint, Microsoft 365 et l’API selon votre environnement et vos permissions.",
      },
      {
        title: "Feuille de route distincte",
        text: "OCR, inventaire et QR, temps et paie CCQ ainsi que réunions Outlook ne sont pas vendus comme livrés.",
      },
    ],
    noteTitle: "Engagement responsable",
    note:
      "Le suivi d’informations de conformité ne constitue pas un avis juridique ni une garantie de conformité.",
    actions: [
      {
        href: "/demo",
        label: "Voir la démo",
        emphasis: "primary",
      },
      {
        href: "/commander",
        label: "Configurer une proposition",
        emphasis: "secondary",
      },
      {
        href: "/documentation",
        label: "Lire la documentation",
        emphasis: "secondary",
      },
    ],
  },
];

const lastSlideIndex = slides.length - 1;

export function PresentationDeck() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeSlide = slides[activeIndex];
  const progress = ((activeIndex + 1) / slides.length) * 100;

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        event.defaultPrevented ||
        event.altKey ||
        event.ctrlKey ||
        event.metaKey
      ) {
        return;
      }

      const target = event.target;

      if (
        target instanceof HTMLElement &&
        (target.isContentEditable ||
          ["INPUT", "SELECT", "TEXTAREA"].includes(target.tagName))
      ) {
        return;
      }

      switch (event.key) {
        case "ArrowLeft":
          event.preventDefault();
          setActiveIndex((current) => Math.max(0, current - 1));
          break;
        case "ArrowRight":
          event.preventDefault();
          setActiveIndex((current) => Math.min(lastSlideIndex, current + 1));
          break;
        case "Home":
          event.preventDefault();
          setActiveIndex(0);
          break;
        case "End":
          event.preventDefault();
          setActiveIndex(lastSlideIndex);
          break;
      }
    };

    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  return (
    <section
      aria-describedby="deck-keyboard-help"
      aria-label="Présentation commerciale interactive de ProJD"
      aria-roledescription="présentation"
      className="deck-shell"
    >
      <header className="deck-header">
        <div className="deck-brand">
          <span className="deck-product">ProJD</span>
          <span className="deck-context">Présentation commerciale</span>
        </div>
        <p aria-atomic="true" aria-live="polite" className="deck-position">
          Diapositive {activeIndex + 1} sur {slides.length} ·{" "}
          {activeSlide.shortTitle}
        </p>
      </header>

      <div
        aria-label="Progression de la présentation"
        aria-valuemax={slides.length}
        aria-valuemin={1}
        aria-valuenow={activeIndex + 1}
        aria-valuetext={`Diapositive ${activeIndex + 1} sur ${slides.length}`}
        className="deck-progress"
        role="progressbar"
      >
        <span
          aria-hidden="true"
          className="deck-progress-value"
          style={{ width: `${progress}%` }}
        />
      </div>

      <nav
        aria-label="Choisir une diapositive"
        className="deck-step-navigation"
      >
        <ol className="deck-step-list">
          {slides.map((slide, index) => (
            <li className="deck-step-item" key={slide.code}>
              <button
                aria-controls="deck-active-slide"
                aria-current={index === activeIndex ? "step" : undefined}
                aria-label={`Aller à la diapositive ${index + 1} : ${slide.shortTitle}`}
                className="deck-step-button"
                onClick={() => setActiveIndex(index)}
                type="button"
              >
                <span className="deck-step-code">{slide.code}</span>
                <span className="deck-step-title">{slide.shortTitle}</span>
              </button>
            </li>
          ))}
        </ol>
      </nav>

      <article
        aria-labelledby={`deck-slide-title-${activeSlide.code}`}
        className="deck-slide"
        id="deck-active-slide"
        key={activeSlide.code}
      >
        <div className="deck-slide-heading">
          <div className="deck-slide-meta">
            <p className="deck-eyebrow">{activeSlide.eyebrow}</p>
            <span
              className={`deck-status deck-status-${activeSlide.statusTone}`}
            >
              {activeSlide.status}
            </span>
          </div>
          <h1
            className="deck-title"
            id={`deck-slide-title-${activeSlide.code}`}
          >
            {activeSlide.title}
          </h1>
          <p className="deck-lead">{activeSlide.lead}</p>
        </div>

        <ul className="deck-highlight-list">
          {activeSlide.highlights.map((highlight) => (
            <li className="deck-highlight" key={highlight.title}>
              <strong className="deck-highlight-title">
                {highlight.title}
              </strong>
              <p className="deck-highlight-text">{highlight.text}</p>
            </li>
          ))}
        </ul>

        <div
          aria-label={activeSlide.noteTitle}
          className="deck-note"
          role="note"
        >
          <strong className="deck-note-title">{activeSlide.noteTitle}</strong>
          <p className="deck-note-text">{activeSlide.note}</p>
        </div>

        {activeSlide.actions ? (
          <div className="deck-actions">
            {activeSlide.actions.map((action) => (
              <Link
                className={`deck-action deck-action-${action.emphasis}`}
                href={action.href}
                key={action.href}
              >
                {action.label}
              </Link>
            ))}
          </div>
        ) : null}
      </article>

      <footer className="deck-footer">
        <button
          aria-controls="deck-active-slide"
          aria-keyshortcuts="ArrowLeft"
          className="deck-control deck-control-previous"
          disabled={activeIndex === 0}
          onClick={() =>
            setActiveIndex((current) => Math.max(0, current - 1))
          }
          type="button"
        >
          <span aria-hidden="true" className="deck-control-icon">
            ←
          </span>
          Précédente
        </button>

        <p className="deck-keyboard-help" id="deck-keyboard-help">
          Clavier : ← → pour naviguer, Début et Fin pour aller aux extrémités.
        </p>

        <button
          aria-controls="deck-active-slide"
          aria-keyshortcuts="ArrowRight"
          className="deck-control deck-control-next"
          disabled={activeIndex === lastSlideIndex}
          onClick={() =>
            setActiveIndex((current) =>
              Math.min(lastSlideIndex, current + 1),
            )
          }
          type="button"
        >
          Suivante
          <span aria-hidden="true" className="deck-control-icon">
            →
          </span>
        </button>
      </footer>
    </section>
  );
}
