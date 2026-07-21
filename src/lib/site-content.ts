import { formatMoney, pricingPlans } from "./pricing";

export const siteUrl = "https://fichero.cloud";
export const demoErpUrl = "https://demo.erp.fichero.cloud/admin/login";

export const mainMessage =
  "Un ERP construction conçu pour les entrepreneurs du Québec: suivre les coûts, les lots, les documents et les factures sans perdre le fil du chantier.";

export const navigation = [
  { label: "ProJD", href: "/projd" },
  { label: "Modules", href: "/modules" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Démo ERP", href: demoErpUrl },
  { label: "Statut", href: "/statut" },
];

export const indicators = [
  { value: "QC", label: "construction Québec" },
  { value: "BID", label: "lots et soumissions" },
  { value: "$", label: "coûts engagés" },
  { value: "OCR", label: "factures assistées" },
];

export const salesPainPoints = [
  {
    title: "Le chantier en une lecture",
    text: "Projets, budgets, lots, documents et factures restent reliés au bon dossier, au bon fournisseur et au bon code de coût.",
  },
  {
    title: "Moins de relances perdues",
    text: "Les soumissions, validations et factures en attente ressortent clairement avant de devenir des urgences.",
  },
  {
    title: "Simple à implanter",
    text: "On démarre avec les modules utiles maintenant, puis on active le reste selon la maturité de l’équipe.",
  },
];

export const constructionSignals = [
  "Entrepreneurs généraux",
  "Chargés de projet",
  "Estimation et appels d'offres",
  "Comptabilité construction",
];

export const showcaseSlides = [
  {
    key: "budget",
    kicker: "Contrôle des coûts",
    title: "Budget, engagé et réel dans une seule lecture",
    text: "Repère les dépassements avant la fin du mois et garde les divisions critiques visibles pour le chargé de projet.",
    metric: "68 %",
    metricLabel: "budget engagé",
    tags: ["Codes de coût", "Engagements", "Écarts"],
  },
  {
    key: "bid",
    kicker: "Assistant BID",
    title: "Soumissions, relances et réponses partenaires",
    text: "Prépare les lots, cible les bons sous-traitants et suit les réponses sans perdre le contexte dans les courriels.",
    metric: "24",
    metricLabel: "soumissions actives",
    tags: ["Lots", "Relances", "Comparatifs"],
  },
  {
    key: "invoice",
    kicker: "Factures et OCR",
    title: "Factures lues, classées et validées avant posting",
    text: "L'assistance OCR accélère la saisie, mais la validation humaine garde le contrôle sur les montants et les fournisseurs.",
    metric: "7",
    metricLabel: "factures à valider",
    tags: ["OCR", "Validation", "Posting"],
  },
  {
    key: "documents",
    kicker: "Documents projet",
    title: "Plans, contrats et photos rattachés au chantier",
    text: "Les documents utiles restent accessibles depuis le projet et peuvent cohabiter avec Procore ou SharePoint.",
    metric: "1 248",
    metricLabel: "documents indexés",
    tags: ["Plans", "Contrats", "SharePoint"],
  },
];

export const decisionCards = [
  {
    title: "Direction",
    text: "Une lecture claire des marges, coûts engagés, factures en attente et risques projet.",
  },
  {
    title: "Chargés de projet",
    text: "Un espace unique pour budget, documents, soumissions, fournisseurs et suivis.",
  },
  {
    title: "Estimation",
    text: "Des lots d'appel d'offres structurés, des partenaires ciblés et des relances visibles.",
  },
  {
    title: "Comptabilité",
    text: "Factures, validations et pièces justificatives reliées au bon projet avant traitement.",
  },
];

export type ModuleSlug =
  | "projets"
  | "budgets"
  | "estimation-bid"
  | "documents"
  | "factures-ocr"
  | "partenaires"
  | "rapports"
  | "integrations";

export type ModuleContent = {
  slug: ModuleSlug;
  name: string;
  eyebrow: string;
  text: string;
  summary: string;
  audience: string;
  metric: string;
  metricLabel: string;
  siteSignal: string;
  outcomes: string[];
  features: string[];
  workflow: string[];
  related: ModuleSlug[];
};

export const modules = [
  {
    slug: "projets",
    name: "Projets",
    eyebrow: "Gestion chantier",
    text: "Fiches projet, phases, responsables, statut, échéances et vue exécutive.",
    summary:
      "Le module Projets garde le chantier au centre: coordonnées, échéances, équipe, documents clés, budget et décisions importantes.",
    audience: "Chargés de projet, direction et coordination chantier.",
    metric: "12",
    metricLabel: "projets actifs",
    siteSignal: "Vue projet claire avant la réunion de chantier.",
    outcomes: [
      "Voir rapidement l’état d’un chantier sans fouiller dans plusieurs fichiers.",
      "Rattacher budget, documents, factures et partenaires au bon projet.",
      "Préparer les réunions avec une liste courte de points à suivre.",
    ],
    features: [
      "Fiche projet avec phase, responsable, dates et statut.",
      "Résumé des coûts, lots actifs, factures et documents liés.",
      "Notes internes pour garder le contexte des décisions.",
      "Vue exécutive pour suivre les projets qui demandent de l’attention.",
    ],
    workflow: ["Créer le projet", "Ajouter l’équipe", "Importer les documents", "Suivre budget et lots"],
    related: ["budgets", "documents", "rapports"],
  },
  {
    slug: "budgets",
    name: "Budgets",
    eyebrow: "Contrôle des coûts",
    text: "Codes de coût, budgets, engagements, coûts réels et écarts à surveiller.",
    summary:
      "Le module Budgets montre ce qui est prévu, engagé et réellement dépensé pour garder les écarts visibles avant la fin du mois.",
    audience: "Direction, chargés de projet et comptabilité construction.",
    metric: "68 %",
    metricLabel: "budget engagé",
    siteSignal: "Dépassements repérés avant qu’ils sortent au rapport mensuel.",
    outcomes: [
      "Comparer budget, engagé et réel par division ou code de coût.",
      "Repérer les postes qui demandent validation ou correction.",
      "Garder une trace des engagements liés aux fournisseurs.",
    ],
    features: [
      "Codes de coût et divisions construction.",
      "Budget initial, révisions, engagements et réel.",
      "Alertes visuelles sur les écarts importants.",
      "Lecture consolidée pour direction et comptabilité.",
    ],
    workflow: ["Importer le budget", "Associer les engagements", "Valider les coûts", "Analyser les écarts"],
    related: ["factures-ocr", "projets", "rapports"],
  },
  {
    slug: "estimation-bid",
    name: "Estimation et BID",
    eyebrow: "Appels d'offres",
    text: "Sélection partenaires, invitations, relances, suivi des réponses et attribution.",
    summary:
      "Le module Estimation et BID structure les lots, les invitations et les relances pour éviter que les soumissions se perdent dans les courriels.",
    audience: "Estimateurs, chargés de projet et responsables achats.",
    metric: "24",
    metricLabel: "soumissions actives",
    siteSignal: "Relances visibles avant la fermeture d’un lot.",
    outcomes: [
      "Préparer des lots clairs avec les partenaires ciblés.",
      "Suivre qui a répondu, refusé ou doit être relancé.",
      "Comparer les réponses sans perdre le contexte du projet.",
    ],
    features: [
      "Lots d’appel d’offres par projet.",
      "Liste de partenaires et spécialités.",
      "Statuts d’invitation, réponse, relance et attribution.",
      "Comparatifs simples pour décider plus vite.",
    ],
    workflow: ["Créer les lots", "Choisir les partenaires", "Envoyer les invitations", "Comparer les réponses"],
    related: ["partenaires", "documents", "budgets"],
  },
  {
    slug: "documents",
    name: "Documents",
    eyebrow: "Plans et pièces",
    text: "Plans, contrats, photos, pièces jointes et synchronisation documentaire contrôlée.",
    summary:
      "Le module Documents garde les plans, contrats, photos et pièces justificatives rattachés au bon projet et au bon contexte.",
    audience: "Chargés de projet, coordination, chantier et administration.",
    metric: "1 248",
    metricLabel: "documents indexés",
    siteSignal: "Un plan ou contrat retrouvé sans ouvrir trois plateformes.",
    outcomes: [
      "Retrouver rapidement les documents importants du projet.",
      "Relier les pièces aux factures, lots, partenaires ou décisions.",
      "Cohabiter avec SharePoint ou Procore sans perdre le suivi ERP.",
    ],
    features: [
      "Plans, contrats, photos et pièces jointes.",
      "Classement par projet, partenaire, lot ou facture.",
      "Références vers SharePoint ou Procore.",
      "Historique des documents utiles aux décisions.",
    ],
    workflow: ["Classer les documents", "Lier au projet", "Associer aux lots", "Retrouver au besoin"],
    related: ["projets", "estimation-bid", "factures-ocr"],
  },
  {
    slug: "factures-ocr",
    name: "Factures et OCR",
    eyebrow: "Comptabilité chantier",
    text: "Réception des factures, lecture assistée, validation humaine et posting contrôlé.",
    summary:
      "Le module Factures et OCR accélère la lecture des factures tout en gardant une validation humaine avant les actions comptables.",
    audience: "Comptabilité, administration projet et direction financière.",
    metric: "7",
    metricLabel: "factures à valider",
    siteSignal: "Factures rapprochées du bon projet avant traitement.",
    outcomes: [
      "Réduire la saisie manuelle répétitive.",
      "Associer chaque facture au bon fournisseur, projet et code de coût.",
      "Bloquer les anomalies avant le traitement final.",
    ],
    features: [
      "Lecture assistée OCR pour les informations principales.",
      "Validation humaine des montants, fournisseurs et codes.",
      "Lien avec documents et pièces justificatives.",
      "Statuts de réception, validation et traitement.",
    ],
    workflow: ["Recevoir la facture", "Lire par OCR", "Valider les champs", "Préparer le traitement"],
    related: ["budgets", "documents", "rapports"],
  },
  {
    slug: "partenaires",
    name: "Partenaires",
    eyebrow: "Sous-traitants",
    text: "Répertoire de sous-traitants, spécialités, statuts, notes et historique.",
    summary:
      "Le module Partenaires centralise les sous-traitants, fournisseurs, spécialités et notes utiles pour mieux choisir qui inviter ou relancer.",
    audience: "Estimation, achats, chargés de projet et administration.",
    metric: "318",
    metricLabel: "partenaires suivis",
    siteSignal: "Le bon sous-traitant invité pour le bon lot.",
    outcomes: [
      "Garder un répertoire utile pour les prochains appels d’offres.",
      "Voir les spécialités, notes et historiques de participation.",
      "Mieux cibler les invitations BID.",
    ],
    features: [
      "Fiches partenaires avec spécialités et coordonnées.",
      "Notes internes et historique de soumissions.",
      "Statuts actifs, à vérifier ou à éviter.",
      "Lien avec lots, projets et documents.",
    ],
    workflow: ["Créer la fiche", "Associer les spécialités", "Noter l’historique", "Cibler les invitations"],
    related: ["estimation-bid", "projets", "documents"],
  },
  {
    slug: "rapports",
    name: "Rapports",
    eyebrow: "Pilotage",
    text: "Vues pour estimation, projets, comptabilité, direction et suivi mensuel.",
    summary:
      "Le module Rapports transforme les données de chantier en vues simples pour décider quoi surveiller, relancer ou corriger.",
    audience: "Direction, gestion de projet, estimation et comptabilité.",
    metric: "5",
    metricLabel: "vues métier",
    siteSignal: "Une réunion de gestion avec des chiffres lisibles.",
    outcomes: [
      "Voir les coûts, lots, factures et documents qui demandent attention.",
      "Préparer les suivis mensuels sans refaire les fichiers à la main.",
      "Donner une lecture différente selon le rôle.",
    ],
    features: [
      "Vues direction, projet, estimation et comptabilité.",
      "Filtres par projet, statut, partenaire et période.",
      "Suivi des écarts, validations et retards.",
      "Export préparé pour les suivis internes.",
    ],
    workflow: ["Choisir la vue", "Filtrer le projet", "Repérer les écarts", "Partager le suivi"],
    related: ["budgets", "factures-ocr", "projets"],
  },
  {
    slug: "integrations",
    name: "Intégrations",
    eyebrow: "Écosystème",
    text: "Connexions préparées avec Procore, SharePoint, Outlook et données internes.",
    summary:
      "Le module Intégrations aide ProJD à cohabiter avec les outils déjà en place sans faire disparaître le suivi financier et opérationnel.",
    audience: "Direction, opérations, TI et responsables d’implantation.",
    metric: "3",
    metricLabel: "connecteurs visés",
    siteSignal: "L’ERP garde le suivi même quand les documents vivent ailleurs.",
    outcomes: [
      "Rapprocher les informations utiles sans remplacer tous les outils.",
      "Garder ProJD comme lecture ERP du projet.",
      "Activer progressivement selon la qualité des données.",
    ],
    features: [
      "Références Procore pour projets et documents pertinents.",
      "Liens SharePoint pour bibliothèques existantes.",
      "Préparation des relances et suivis Outlook.",
      "Approche progressive pour éviter les migrations risquées.",
    ],
    workflow: ["Identifier les outils", "Choisir les données", "Tester la synchronisation", "Activer par étape"],
    related: ["documents", "estimation-bid", "rapports"],
  },
] satisfies ModuleContent[];

export const getModuleBySlug = (slug: string): ModuleContent | undefined =>
  modules.find((module) => module.slug === slug);

export const workflow = [
  "Choisir le forfait",
  "Configurer les projets",
  "Importer les partenaires",
  "Activer les modules",
  "Suivre coûts et livrables",
];

export const packages = pricingPlans.map((plan) => ({
  code: plan.code,
  name: plan.name,
  price: `${formatMoney(plan.monthlyPriceCents)}/mois`,
  setup: `${formatMoney(plan.setupFeeCents)} mise en route`,
  description: plan.description,
  items: [
    ...plan.items,
    `${formatMoney(plan.extraSeatMonthlyCents)}/mois par utilisateur additionnel`,
  ],
  featured: plan.featured,
}));

export const integrations = [
  {
    name: "Procore",
    text: "Rapprocher projets, photos, documents et références externes sans perdre le suivi financier ProJD.",
  },
  {
    name: "SharePoint",
    text: "Garder les bibliothèques existantes tout en attachant les documents utiles au bon projet.",
  },
  {
    name: "Outlook",
    text: "Préparer les invitations, relances BID et suivis fournisseurs depuis les workflows projet.",
  },
];

export const securityItems = [
  "Accès par rôle pour protéger coûts, factures, documents et paramètres sensibles.",
  "Historique des actions importantes pour garder une trace claire des décisions.",
  "Validation humaine avant les actions comptables ou les changements critiques.",
  "Intégrations activées progressivement selon la maturité des données.",
];

export const faqItems = [
  {
    question: "ProJD remplace-t-il Procore?",
    answer:
      "Pas nécessairement. ProJD devient la couche ERP et suivi financier; Procore peut rester connecté pour les données et documents pertinents.",
  },
  {
    question: "Peut-on commencer avec une seule équipe?",
    answer:
      "Oui. Le meilleur départ est souvent un premier groupe projet avec quelques utilisateurs, puis une expansion par modules.",
  },
  {
    question: "Que se passe-t-il après l'achat?",
    answer:
      "L'équipe ProJD confirme le paiement, prépare l'espace client, active les licences et accompagne la première configuration.",
  },
  {
    question: "Les prix sont-ils définitifs?",
    answer:
      "Les forfaits cadrent l'achat initial. Les intégrations, imports historiques et besoins d'accompagnement peuvent ajuster le devis final.",
  },
];

export const statusTargets = [
  { label: "Site ProJD", status: "En ligne", href: "/healthz", detail: "Vitrine et formulaire" },
  { label: "Démo ERP", status: "Lecture seule", href: demoErpUrl, detail: "Parcours produit" },
  { label: "Paiement", status: "Préparation", href: "/commander", detail: "Stripe et PayPal" },
  { label: "Support", status: "Sur demande", href: "/commander", detail: "Activation accompagnée" },
];
