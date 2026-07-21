import { formatMoney, pricingPlans } from "./pricing";

export const siteUrl = "https://fichero.cloud";
export const demoErpUrl = "https://demo.erp.fichero.cloud/admin/login";

export const mainMessage =
  "ProJD centralise projets, budgets, appels d'offres, factures, documents et rapports pour les entrepreneurs de la construction qui veulent enfin piloter avec des données propres.";

export const navigation = [
  { label: "ProJD", href: "/projd" },
  { label: "Modules", href: "/modules" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Démo ERP", href: demoErpUrl },
  { label: "Statut", href: "/statut" },
];

export const indicators = [
  { value: "360°", label: "projets et coûts" },
  { value: "BID", label: "soumissions suivies" },
  { value: "OCR", label: "factures assistées" },
  { value: "QC", label: "construction Québec" },
];

export const salesPainPoints = [
  {
    title: "Moins de fichiers isolés",
    text: "Projets, budgets, documents et factures restent attachés au bon chantier, au bon fournisseur et au bon code de coût.",
  },
  {
    title: "Des décisions plus rapides",
    text: "Les écarts de budget, soumissions en retard et factures à valider remontent dans le même tableau de bord.",
  },
  {
    title: "Un ERP adapté au terrain",
    text: "Les workflows parlent construction: divisions, lots, partenaires, bons de commande, factures et documents projet.",
  },
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

export const modules = [
  {
    name: "Projets",
    text: "Fiches projet, phases, responsables, statut, échéances et vue exécutive.",
  },
  {
    name: "Budgets",
    text: "Codes de coût, budgets, engagements, coûts réels et écarts à surveiller.",
  },
  {
    name: "Estimation et BID",
    text: "Sélection partenaires, invitations, relances, suivi des réponses et attribution.",
  },
  {
    name: "Documents",
    text: "Plans, contrats, photos, pièces jointes et synchronisation documentaire contrôlée.",
  },
  {
    name: "Factures et OCR",
    text: "Réception des factures, lecture assistée, validation humaine et posting contrôlé.",
  },
  {
    name: "Partenaires",
    text: "Répertoire de sous-traitants, spécialités, statuts, notes et historique.",
  },
  {
    name: "Rapports",
    text: "Vues pour estimation, projets, comptabilité, direction et suivi mensuel.",
  },
  {
    name: "Intégrations",
    text: "Connexions préparées avec Procore, SharePoint, Outlook et données internes.",
  },
];

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
