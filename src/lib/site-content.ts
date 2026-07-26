import { formatMoney, pricingPlans } from "./pricing";

export const siteUrl = "https://fichero.cloud";
export const demoErpUrl = "https://demo.erp.fichero.cloud/admin/login";

export const navigation = [
  { label: "Produit", href: "/projd" },
  { label: "Solutions", href: "/solutions" },
  { label: "Modules", href: "/modules" },
  { label: "Ressources", href: "/ressources" },
  { label: "Tarifs", href: "/tarifs" },
] as const;

export const productPillars = [
  {
    code: "PR",
    title: "Pilotage projet",
    text: "Projets, échéances, risques, actions, RFIs et suivis de coordination.",
  },
  {
    code: "FI",
    title: "Finance construction",
    text: "Budgets, engagements, coûts directs, factures et écarts par phase.",
  },
  {
    code: "BID",
    title: "Estimation et appels d’offres",
    text: "Lots, partenaires, invitations, documents, réponses et comparatifs.",
  },
] as const;

export const operationalProof = {
  available: [
    "Cockpit projet et suivi exécutif",
    "Budgets, engagements et coûts directs",
    "Appels d’offres et portail partenaires",
    "Factures fournisseurs et approbation",
    "Rapports financiers et hebdomadaires",
  ],
  evolving: [
    "OCR des factures avec validation humaine",
    "Synchronisation étendue Procore, SharePoint et Outlook",
  ],
} as const;

export type SolutionRole = {
  slug: "direction" | "projets" | "estimation" | "comptabilite";
  code: string;
  role: string;
  headline: string;
  description: string;
  priorities: string[];
  modules: ModuleSlug[];
};

export const solutionRoles = [
  {
    slug: "direction",
    code: "DIR",
    role: "Direction",
    headline: "Voir où l’entreprise gagne, bloque ou dérive.",
    description:
      "Une lecture portefeuille des finances, risques, échéances et appels d’offres qui demandent une décision.",
    priorities: [
      "Santé financière des projets",
      "Risques et actions en retard",
      "Rapports prêts pour les réunions",
    ],
    modules: ["projets", "budgets", "rapports"],
  },
  {
    slug: "projets",
    code: "GDP",
    role: "Gestion de projets",
    headline: "Garder les suivis du chantier reliés au bon projet.",
    description:
      "Actions, risques, RFIs, submittals, documents, coûts et responsabilités dans un cockpit commun.",
    priorities: [
      "Suivi quotidien et hebdomadaire",
      "Responsables et dates cibles",
      "Contexte projet traçable",
    ],
    modules: ["projets", "documents", "contrats"],
  },
  {
    slug: "estimation",
    code: "EST",
    role: "Estimation",
    headline: "Passer du budget préliminaire à une décision documentée.",
    description:
      "Importer le budget, préparer les lots, cibler les partenaires, suivre les réponses et comparer les prix.",
    priorities: [
      "Lots et budget source",
      "Invitations Microsoft 365",
      "Comparaison et attribution",
    ],
    modules: ["estimation-bid", "partenaires", "portail-collaboration"],
  },
  {
    slug: "comptabilite",
    code: "CPT",
    role: "Comptabilité",
    headline: "Rattacher chaque coût au bon fournisseur et au bon chantier.",
    description:
      "Fournisseurs, factures PDF, ventilation, approbation, âge des comptes et lecture financière projet.",
    priorities: [
      "Factures et pièces justificatives",
      "Approbation contrôlée",
      "Budget versus coûts réels",
    ],
    modules: ["factures-ocr", "budgets", "rapports"],
  },
] satisfies SolutionRole[];

export const availabilityCodes = ["available", "evolving", "activation"] as const;
export type AvailabilityCode = (typeof availabilityCodes)[number];

export const availabilityLabels = {
  available: "Disponible",
  evolving: "En évolution",
  activation: "Sur activation",
} satisfies Record<AvailabilityCode, string>;

export type ModuleSlug =
  | "projets"
  | "budgets"
  | "contrats"
  | "estimation-bid"
  | "documents"
  | "factures-ocr"
  | "partenaires"
  | "portail-collaboration"
  | "rapports"
  | "integrations";

export type ModuleContent = {
  slug: ModuleSlug;
  code: string;
  name: string;
  eyebrow: string;
  text: string;
  summary: string;
  audience: string;
  availability: AvailabilityCode;
  availabilityNote: string;
  proof: string;
  outcomes: string[];
  features: string[];
  workflow: string[];
  related: ModuleSlug[];
};

export const modules = [
  {
    slug: "projets",
    code: "PRJ",
    name: "Projets et coordination",
    eyebrow: "Pilotage chantier",
    text: "Portefeuille, cockpit projet, risques, actions, RFIs, submittals et rapports hebdomadaires.",
    summary:
      "ProJD garde les informations de coordination, les responsabilités et les signaux financiers rattachés à une fiche projet canonique.",
    audience: "Chargés de projet, coordination et direction.",
    availability: "available",
    availabilityNote: "Cockpit global et suivi détaillé par projet.",
    proof: "Cockpit, kit de démarrage, import RFI/submittal et rapport hebdomadaire sont disponibles.",
    outcomes: [
      "Préparer une réunion sans reconstruire le contexte à partir de plusieurs fichiers.",
      "Voir les actions bloquées, en retard ou à échéance rapprochée.",
      "Conserver la provenance des éléments importés depuis Procore.",
    ],
    features: [
      "Portefeuille et santé des projets.",
      "Actions, risques, jalons, RFIs et submittals.",
      "Responsables, priorités, échéances et états.",
      "Rapport hebdomadaire imprimable et export CSV.",
    ],
    workflow: ["Créer le projet", "Affecter l’équipe", "Démarrer le kit de suivi", "Réviser chaque semaine"],
    related: ["budgets", "contrats", "documents"],
  },
  {
    slug: "budgets",
    code: "FIN",
    name: "Finance construction",
    eyebrow: "Coûts et marges",
    text: "Phases, codes de coût, budgets, engagements, coûts directs et dépenses de bureau.",
    summary:
      "Une structure financière conçue pour lire le budget prévu, les montants engagés et les coûts réels au niveau du projet.",
    audience: "Direction, chargés de projet et comptabilité.",
    availability: "available",
    availabilityNote: "Socle financier et sommaires imprimables disponibles.",
    proof: "Les montants révisés sont calculés côté serveur et les sommaires utilisent les données ERP existantes.",
    outcomes: [
      "Comparer budget et coûts par phase ou code de coût.",
      "Relier les engagements et coûts directs au bon chantier.",
      "Faire ressortir les écarts avant la revue mensuelle.",
    ],
    features: [
      "Phases et catalogue de codes de coût.",
      "Budgets initiaux, révisions et prévisions.",
      "Engagements, coûts directs et frais de bureau.",
      "Sommaire financier imprimable et export CSV.",
    ],
    workflow: ["Structurer les codes", "Importer le budget", "Rattacher les coûts", "Analyser les écarts"],
    related: ["projets", "factures-ocr", "rapports"],
  },
  {
    slug: "contrats",
    code: "CTR",
    name: "Contrats",
    eyebrow: "Contrat-chantier",
    text: "Fiche contrat, phases, clients, directives, avenants, addenda et analyse consolidée.",
    summary:
      "Le premier espace Contrats reprend les flux pratiques d’un ERP construction traditionnel tout en réutilisant les projets, entreprises et phases de ProJD.",
    audience: "Administration de contrats, chargés de projet et direction.",
    availability: "evolving",
    availabilityNote: "Premier périmètre opérationnel; les flux de facturation continuent d’évoluer.",
    proof: "Contrat-chantier, directives, avenants, addenda, importation de devis et analyse initiale sont accessibles.",
    outcomes: [
      "Éviter une seconde fiche projet déconnectée du reste de l’ERP.",
      "Garder directives, avenants et addenda dans le contexte du contrat.",
      "Croiser budgets, engagements, factures et partenaires dans l’analyse.",
    ],
    features: [
      "Fiche Contrat-chantier et paramètres de phase.",
      "Changements, directives et avenants.",
      "Addenda reliés aux appels d’offres.",
      "Analyse consolidée à partir des données existantes.",
    ],
    workflow: ["Ouvrir le contrat", "Configurer les phases", "Suivre les changements", "Analyser l’exposition"],
    related: ["projets", "budgets", "estimation-bid"],
  },
  {
    slug: "estimation-bid",
    code: "BID",
    name: "Estimation et BID",
    eyebrow: "Appels d’offres",
    text: "Budget préliminaire, lots, sélection partenaires, courriels, portail, réponses et comparaison.",
    summary:
      "Un parcours d’appel d’offres continu, de l’import du budget jusqu’à la recommandation documentée.",
    audience: "Estimateurs, responsables achats et chargés de projet.",
    availability: "available",
    availabilityNote: "Parcours BID, portail et comparaison disponibles.",
    proof: "Import XLSX, assistant BID, modèles Microsoft 365, documents, accusés et dépôts privés sont en place.",
    outcomes: [
      "Transformer les lignes de sous-traitance approuvées en lots suivis.",
      "Savoir qui a ouvert, accusé réception, répondu ou doit être relancé.",
      "Comparer budget, cible et soumissions avec une décision conservée.",
    ],
    features: [
      "Import de budget préliminaire avec provenance.",
      "Sélection de partenaires par spécialité et historique.",
      "Courriels Microsoft 365 et liens de portail sécurisés.",
      "Comparaison des offres et recommandation d’attribution.",
    ],
    workflow: ["Valider le budget", "Préparer les lots", "Inviter les partenaires", "Comparer les offres"],
    related: ["partenaires", "portail-collaboration", "documents"],
  },
  {
    slug: "documents",
    code: "DOC",
    name: "Documents et synchronisation",
    eyebrow: "Procore et SharePoint",
    text: "Références, mappages, règles de synchronisation, fichiers de projet et contrôles de confidentialité.",
    summary:
      "ProJD conserve le contexte ERP et la provenance des fichiers tout en préparant une cohabitation contrôlée avec Procore et SharePoint.",
    audience: "Gestion de projets, coordination, administration et TI.",
    availability: "evolving",
    availabilityNote: "Socle de synchronisation disponible; certains connecteurs exigent les accès du client.",
    proof: "Mappages projet/fichier, aperçu de synchronisation et contrôles sync/no-sync/privé existent déjà.",
    outcomes: [
      "Retrouver la provenance et la destination d’un document.",
      "Éviter de synchroniser un fichier marqué privé ou hors périmètre.",
      "Rattacher plans, devis et pièces au bon flux métier.",
    ],
    features: [
      "Mappages Procore vers SharePoint.",
      "Aperçu avant synchronisation.",
      "Contrôles sync, no-sync et employé privé.",
      "Fichiers d’appel d’offres et dépôts partenaires cloisonnés.",
    ],
    workflow: ["Définir les sources", "Mapper les projets", "Prévisualiser", "Activer progressivement"],
    related: ["projets", "estimation-bid", "integrations"],
  },
  {
    slug: "factures-ocr",
    code: "AP",
    name: "Comptes fournisseurs",
    eyebrow: "Factures • OCR en évolution",
    text: "Fournisseurs, factures PDF, ventilation, approbation, dénonciations et âge des comptes.",
    summary:
      "Le flux actuel structure les factures d’achat et leur approbation; l’OCR avec validation humaine fait partie de la prochaine évolution.",
    audience: "Comptabilité, administration de projets et direction financière.",
    availability: "evolving",
    availabilityNote: "Saisie, PDF et approbation disponibles; OCR non encore automatisé.",
    proof: "La facture d’achat, son PDF, ses allocations et la file d’approbation sont déjà utilisables.",
    outcomes: [
      "Rattacher la facture au fournisseur, au projet et au code de coût.",
      "Conserver la pièce PDF avec le dossier comptable.",
      "Faire approuver ou rejeter avec une trace d’audit.",
    ],
    features: [
      "Fiches fournisseurs et données de suivi.",
      "Factures PDF avec aperçu et impression.",
      "Ventilation par projet, phase et code de coût.",
      "File d’approbation et rapport d’âge des comptes.",
    ],
    workflow: ["Identifier le fournisseur", "Joindre la facture", "Ventiler les coûts", "Faire approuver"],
    related: ["budgets", "documents", "rapports"],
  },
  {
    slug: "partenaires",
    code: "PAR",
    name: "Réseau partenaires",
    eyebrow: "Sous-traitants et fournisseurs",
    text: "Fiches partenaires, spécialités, contacts, préférences, statuts et historique de soumissions.",
    summary:
      "Un répertoire exploitable pour choisir les bons partenaires et garder le contexte de chaque relation.",
    audience: "Estimation, achats, chargés de projet et administration.",
    availability: "available",
    availabilityNote: "Répertoire, imports et spécialités disponibles.",
    proof: "Les imports autorisés ConstructBuy, contacts, spécialités et notes internes sont structurés dans ProJD.",
    outcomes: [
      "Cibler les partenaires par spécialité plutôt qu’à partir d’une liste plate.",
      "Garder les contacts, préférences et notes internes au même endroit.",
      "Bloquer les partenaires fermés ou exclus des nouvelles invitations.",
    ],
    features: [
      "Import CSV/ZIP avec provenance.",
      "Catalogue de spécialités et recherche.",
      "Statuts actif, privilégié, fermé ou bloqué.",
      "Contacts d’équipe et historique des invitations.",
    ],
    workflow: ["Importer ou créer", "Classer les spécialités", "Valider le statut", "Cibler les lots"],
    related: ["estimation-bid", "portail-collaboration", "projets"],
  },
  {
    slug: "portail-collaboration",
    code: "EXT",
    name: "Portail partenaires",
    eyebrow: "Collaboration externe",
    text: "Invitations ciblées, documents, accusés de réception, réponses et dépôts privés.",
    summary:
      "Le portail donne au partenaire uniquement le contexte de son invitation, sans ouvrir l’administration interne de ProJD.",
    audience: "Sous-traitants, estimateurs et administration.",
    availability: "available",
    availabilityNote: "Flux par lien sécurisé disponible.",
    proof: "Les liens sont hachés, expirants et limités à l’invitation; les fichiers d’un partenaire restent privés.",
    outcomes: [
      "Réduire les échanges dispersés autour d’un appel d’offres.",
      "Exiger l’accusé de réception des documents importants.",
      "Recevoir montant et fichiers sans les exposer aux autres partenaires.",
    ],
    features: [
      "Lien signé, ciblé et expirant.",
      "Documents et addenda avec accusé requis.",
      "Réponse intéressé/refusé et dépôt de soumission.",
      "Aperçu employé sans consommer le lien public.",
    ],
    workflow: ["Envoyer le lien", "Faire accuser les documents", "Recevoir la réponse", "Comparer l’offre"],
    related: ["estimation-bid", "partenaires", "documents"],
  },
  {
    slug: "rapports",
    code: "RPT",
    name: "Rapports et direction",
    eyebrow: "Décision",
    text: "Portefeuille, santé financière, rapport hebdomadaire, comparatifs et exports lisibles.",
    summary:
      "Des vues calculées à partir des données de travail pour préparer les réunions de direction et de projet.",
    audience: "Direction, gestion de projets, estimation et comptabilité.",
    availability: "available",
    availabilityNote: "Premiers rapports imprimables et exports CSV disponibles.",
    proof: "Les sommaires financiers, rapports hebdomadaires et vues exécutives utilisent les données ERP existantes.",
    outcomes: [
      "Commencer par le résumé avant d’ouvrir le détail.",
      "Repérer les projets, coûts et actions qui demandent une décision.",
      "Partager un rapport imprimable avec la date et le contexte source.",
    ],
    features: [
      "Tableau de bord exécutif et portefeuille.",
      "Sommaire financier par projet.",
      "Rapport hebdomadaire de coordination.",
      "Impression et exports CSV ciblés.",
    ],
    workflow: ["Choisir la vue", "Filtrer le périmètre", "Valider les écarts", "Partager le rapport"],
    related: ["projets", "budgets", "factures-ocr"],
  },
  {
    slug: "integrations",
    code: "INT",
    name: "Intégrations et API",
    eyebrow: "Écosystème contrôlé",
    text: "Procore, Microsoft 365, SharePoint et API ERP activés selon les permissions disponibles.",
    summary:
      "ProJD reste la couche de workflow et de lecture ERP tandis que les systèmes connectés gardent leurs responsabilités.",
    audience: "TI, opérations, direction et responsables d’implantation.",
    availability: "activation",
    availabilityNote: "Activation selon l’environnement, les licences et les permissions du client.",
    proof: "Les mécanismes OAuth/API, Microsoft Graph, mappages et API ERP en lecture existent avec des garde-fous.",
    outcomes: [
      "Connecter progressivement les sources réellement utiles.",
      "Conserver la provenance et les dates de synchronisation.",
      "Dégrader proprement le flux lorsqu’un outil ou une permission manque.",
    ],
    features: [
      "Socle Procore OAuth/API et contrôles de capacité.",
      "Microsoft Graph et mappages SharePoint.",
      "API ERP en lecture avec scopes et audit.",
      "Instance distincte et activation accompagnée.",
    ],
    workflow: ["Évaluer les accès", "Choisir le périmètre", "Tester en bac à sable", "Activer et surveiller"],
    related: ["documents", "projets", "estimation-bid"],
  },
] satisfies ModuleContent[];

const legacyModuleAliases: Partial<Record<string, ModuleSlug>> = {
  "api-deploiement": "integrations",
};

export const getModuleBySlug = (slug: string): ModuleContent | undefined => {
  const canonicalSlug = legacyModuleAliases[slug] ?? slug;
  return modules.find((module) => module.slug === canonicalSlug);
};

export const featuredModuleSlugs = [
  "projets",
  "budgets",
  "estimation-bid",
  "partenaires",
  "factures-ocr",
  "rapports",
] satisfies ModuleSlug[];

export const getFeaturedModules = (): ModuleContent[] =>
  featuredModuleSlugs
    .map((slug) => getModuleBySlug(slug))
    .filter((module): module is ModuleContent => Boolean(module));

export const packages = pricingPlans.map((plan) => ({
  code: plan.code,
  name: plan.publicName,
  price: `${formatMoney(plan.monthlyPriceCents)}/mois`,
  setup: `${formatMoney(plan.setupFeeCents)} de mise en route`,
  description: plan.description,
  includedSeats: plan.includedSeats,
  items: plan.items,
  featured: plan.featured,
}));

export const integrations = [
  {
    code: "PC",
    name: "Procore",
    status: "Selon les outils activés",
    text: "Projets, RFIs, submittals et documents sont rapprochés avec contrôle de capacité et provenance.",
  },
  {
    code: "M365",
    name: "Microsoft 365",
    status: "Microsoft Graph",
    text: "SharePoint pour les fichiers et Microsoft 365 pour les invitations d’appels d’offres.",
  },
  {
    code: "API",
    name: "API ProJD",
    status: "Lecture contrôlée",
    text: "Projets, entreprises et contacts exposés uniquement avec scopes, jetons et audit.",
  },
] as const;

export type GuideSlug =
  | "demarrer-un-projet"
  | "lancer-un-appel-offres"
  | "suivre-un-budget"
  | "traiter-une-facture";

export type GuideStep = {
  title: string;
  text: string;
  checks: string[];
};

export type GuideContent = {
  slug: GuideSlug;
  code: string;
  title: string;
  category: string;
  duration: string;
  summary: string;
  audience: string;
  outcome: string;
  steps: GuideStep[];
  note: string;
  relatedModules: ModuleSlug[];
};

export const guides = [
  {
    slug: "demarrer-un-projet",
    code: "G01",
    title: "Démarrer un projet dans ProJD",
    category: "Prise en main",
    duration: "8 min",
    summary:
      "Créer la fiche canonique, affecter l’équipe, relier les sources et lancer le premier suivi.",
    audience: "Chargés de projet et coordination",
    outcome: "Un projet prêt pour la coordination hebdomadaire, sans structure parallèle.",
    steps: [
      {
        title: "Créer la fiche projet",
        text: "Saisir le code, le client, les dates, le responsable et le statut qui serviront à tous les modules.",
        checks: ["Code de projet unique", "Client canonique", "Responsable et dates"],
      },
      {
        title: "Préparer l’équipe et les paramètres",
        text: "Associer les employés, vérifier les accès ERP et compléter le contexte du chantier.",
        checks: ["Équipe projet", "Rôles internes", "Paramètres du chantier"],
      },
      {
        title: "Relier Procore ou SharePoint au besoin",
        text: "Créer les mappages uniquement lorsque les accès et la destination documentaire sont confirmés.",
        checks: ["Projet source identifié", "Bibliothèque cible validée", "Aperçu de synchronisation"],
      },
      {
        title: "Lancer le kit de suivi",
        text: "Créer les suivis de démarrage, puis utiliser le rapport hebdomadaire pour la première réunion.",
        checks: ["Actions et risques", "Jalons et réunions", "Rapport hebdomadaire"],
      },
    ],
    note: "Les références externes conservent leur source; Procore ou SharePoint ne deviennent pas des miroirs incontrôlés.",
    relatedModules: ["projets", "documents", "rapports"],
  },
  {
    slug: "lancer-un-appel-offres",
    code: "G02",
    title: "Lancer un appel d’offres",
    category: "Estimation",
    duration: "10 min",
    summary:
      "Passer d’un budget approuvé à des invitations suivies, puis comparer les réponses reçues.",
    audience: "Estimateurs et responsables achats",
    outcome: "Un lot documenté, des partenaires ciblés et une décision traçable.",
    steps: [
      {
        title: "Valider le budget source",
        text: "Importer le classeur préliminaire et soumettre le budget avant de générer les lots.",
        checks: ["Provenance du fichier", "Codes budget", "Approbation requise"],
      },
      {
        title: "Préparer le lot et ses documents",
        text: "Définir le périmètre, la fermeture, les instructions et les documents que le partenaire doit accuser.",
        checks: ["Portée claire", "Date de fermeture", "Addenda et accusés"],
      },
      {
        title: "Choisir les partenaires",
        text: "Filtrer le répertoire par spécialité, statut et historique avant de préparer l’envoi.",
        checks: ["Spécialités", "Contacts actifs", "Partenaires admissibles"],
      },
      {
        title: "Envoyer et suivre",
        text: "Utiliser le modèle Microsoft 365, puis suivre ouverture, accusés, réponse et relance.",
        checks: ["Courriel rendu", "Lien expirant", "État de réponse"],
      },
      {
        title: "Comparer et documenter",
        text: "Comparer budget, cible et montants reçus, puis conserver la recommandation et la note de décision.",
        checks: ["Écarts de prix", "Pièces reçues", "Recommandation"],
      },
    ],
    note: "Chaque partenaire voit uniquement son invitation et ses fichiers; les notes internes ne sont jamais rendues dans le portail.",
    relatedModules: ["estimation-bid", "partenaires", "portail-collaboration"],
  },
  {
    slug: "suivre-un-budget",
    code: "G03",
    title: "Suivre un budget de chantier",
    category: "Finance",
    duration: "7 min",
    summary:
      "Structurer les phases et codes, rattacher les engagements et lire les écarts du projet.",
    audience: "Chargés de projet, direction et comptabilité",
    outcome: "Une lecture commune du prévu, de l’engagé et du réel.",
    steps: [
      {
        title: "Structurer les dimensions",
        text: "Définir les phases et codes de coût que l’équipe utilisera pour toutes les écritures du projet.",
        checks: ["Phases actives", "Codes cohérents", "Types de coût"],
      },
      {
        title: "Charger le budget",
        text: "Créer ou importer les lignes avec budget initial, ajustements approuvés et prévisions.",
        checks: ["Montants en Decimal", "Sources identifiées", "Révisions validées"],
      },
      {
        title: "Rattacher engagements et coûts",
        text: "Associer les engagements, coûts directs et factures au même axe projet-phase-code.",
        checks: ["Fournisseur", "Engagement", "Ventilation"],
      },
      {
        title: "Réviser le sommaire",
        text: "Utiliser la vue financière et l’export CSV pour préparer la revue de projet.",
        checks: ["Budget révisé", "Coûts réels", "Écarts à traiter"],
      },
    ],
    note: "Les montants révisés sont calculés côté serveur; le navigateur ne décide jamais d’un total financier.",
    relatedModules: ["budgets", "projets", "rapports"],
  },
  {
    slug: "traiter-une-facture",
    code: "G04",
    title: "Traiter une facture fournisseur",
    category: "Comptabilité",
    duration: "6 min",
    summary:
      "Enregistrer la pièce PDF, la ventiler et la faire approuver avec une trace exploitable.",
    audience: "Comptabilité et administration de projets",
    outcome: "Une facture reliée au bon fournisseur et au bon chantier avant approbation.",
    steps: [
      {
        title: "Valider le fournisseur",
        text: "Choisir l’entreprise canonique et vérifier ses conditions, références et données de suivi.",
        checks: ["Fournisseur actif", "Conditions de paiement", "Références"],
      },
      {
        title: "Saisir la facture et joindre le PDF",
        text: "Entrer les références et montants, puis conserver la pièce dans l’espace prévu.",
        checks: ["Numéro de facture", "Dates et totaux", "PDF consultable"],
      },
      {
        title: "Ventiler le coût",
        text: "Rattacher la facture au projet, à la phase, au code de coût et à l’engagement lorsque pertinent.",
        checks: ["Projet", "Phase et code", "Engagement ou bon"],
      },
      {
        title: "Soumettre à l’approbation",
        text: "Faire approuver ou rejeter la facture, puis surveiller le solde dans l’âge des comptes.",
        checks: ["État d’approbation", "Trace d’audit", "Solde fournisseur"],
      },
    ],
    note: "L’OCR automatisé est en évolution. Lorsqu’il sera activé, aucune donnée extraite ne sera comptabilisée sans validation humaine.",
    relatedModules: ["factures-ocr", "budgets", "documents"],
  },
] satisfies GuideContent[];

export const getGuideBySlug = (slug: string): GuideContent | undefined =>
  guides.find((guide) => guide.slug === slug);

export const resourceCards = [
  {
    code: "PRE",
    title: "Présentation interactive",
    text: "Six diapositives pour comprendre le positionnement, les flux disponibles et le mode d’implantation.",
    href: "/presentation",
    action: "Lancer la présentation",
  },
  {
    code: "DOC",
    title: "Documentation",
    text: "Architecture produit, état des modules, intégrations et règles de fonctionnement.",
    href: "/documentation",
    action: "Consulter la documentation",
  },
  {
    code: "GUI",
    title: "Guides pratiques",
    text: "Des parcours courts pour les projets, les budgets, les appels d’offres et les factures.",
    href: "/guides",
    action: "Parcourir les guides",
  },
  {
    code: "DEM",
    title: "Démo ProJD",
    text: "Un environnement distinct avec des données fictives pour voir les principaux espaces de travail.",
    href: "/demo",
    action: "Préparer la visite",
  },
  {
    code: "SEC",
    title: "Sécurité et données",
    text: "Autorité serveur, portail cloisonné, audit et limites assumées des intégrations.",
    href: "/securite",
    action: "Voir les garde-fous",
  },
] as const;

export const documentationSections = [
  {
    code: "01",
    title: "Prise en main",
    text: "Comprendre l’organisation générale et préparer un premier projet.",
    items: ["Navigation par métier", "Projet canonique", "Équipe et accès", "Kit de suivi"],
    href: "/guides/demarrer-un-projet",
  },
  {
    code: "02",
    title: "Flux métier",
    text: "Relier les étapes plutôt que d’utiliser chaque écran comme un outil isolé.",
    items: ["Projet → finance", "Budget → BID", "Partenaire → portail", "Facture → approbation"],
    href: "/guides",
  },
  {
    code: "03",
    title: "Intégrations",
    text: "Activer les connecteurs avec un périmètre, une provenance et un comportement d’échec explicites.",
    items: ["Procore", "SharePoint", "Microsoft 365", "API ProJD"],
    href: "/modules/integrations",
  },
] as const;

export const securityItems = [
  {
    code: "AUTH",
    title: "Accès et rôles",
    text: "Les surfaces administratives demandent une session; les permissions plus fines continuent d’être renforcées.",
  },
  {
    code: "AUDIT",
    title: "Traçabilité métier",
    text: "Les changements importants conservent acteur, source, entité et résumé sûr.",
  },
  {
    code: "PORTAL",
    title: "Portail cloisonné",
    text: "Les liens partenaires sont ciblés, expirants, limités et séparés des routes administratives.",
  },
  {
    code: "SYNC",
    title: "Intégrations prudentes",
    text: "Les synchronisations sont idempotentes, capables de reprendre et explicites lorsqu’un accès manque.",
  },
] as const;

export const faqItems = [
  {
    question: "ProJD remplace-t-il Procore?",
    answer:
      "Pas obligatoirement. ProJD porte les workflows ERP, la normalisation et les rapports; Procore peut rester une source de données terrain selon les accès disponibles.",
  },
  {
    question: "Peut-on commencer avec une équipe pilote?",
    answer:
      "Oui. L’implantation la plus saine commence par un projet, quelques responsables et un flux prioritaire avant d’élargir.",
  },
  {
    question: "L’OCR des factures est-il déjà automatique?",
    answer:
      "Non. La saisie, le PDF, la ventilation et l’approbation existent; l’OCR est encore en évolution et restera soumis à une validation humaine.",
  },
  {
    question: "Les intégrations sont-elles incluses automatiquement?",
    answer:
      "Elles sont cadrées selon le forfait, l’environnement Microsoft/Procore, les permissions et le périmètre de données à synchroniser.",
  },
] as const;

export const statusTargets = [
  {
    label: "Site ProJD",
    status: "Point d’accès",
    href: "/healthz",
    detail: "Vérification de la vitrine",
  },
  {
    label: "Démo ERP",
    status: "Données fictives",
    href: demoErpUrl,
    detail: "Environnement distinct",
  },
  {
    label: "Configuration",
    status: "Accompagnée",
    href: "/commander",
    detail: "Forfait et implantation",
  },
] as const;
