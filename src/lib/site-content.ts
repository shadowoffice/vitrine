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

export type SolutionRoleDetail = {
  problems: string[];
  workflow: string[];
  expectedOutcome: string;
  verification: string;
};

export const solutionRoleDetails = {
  direction: {
    problems: [
      "Les revues dépendent de fichiers préparés manuellement.",
      "Les écarts financiers et les actions en retard arrivent dans des comptes rendus séparés.",
      "La provenance d’un chiffre ou d’un statut est difficile à retrouver.",
    ],
    workflow: [
      "Filtrer le portefeuille actif",
      "Repérer les écarts et échéances",
      "Ouvrir le projet concerné",
      "Affecter une décision et une date",
    ],
    expectedOutcome:
      "Une revue de direction centrée sur les exceptions qui demandent une décision.",
    verification:
      "À vérifier dans la démo avec le portefeuille, le sommaire financier et le rapport hebdomadaire.",
  },
  projets: {
    problems: [
      "Les actions, RFIs et risques vivent dans des outils ou fichiers distincts.",
      "Les responsabilités et dates cibles perdent leur contexte projet.",
      "Le rapport hebdomadaire demande une reconstruction manuelle.",
    ],
    workflow: [
      "Ouvrir le cockpit projet",
      "Réviser actions, risques et jalons",
      "Relier les documents utiles",
      "Produire le rapport hebdomadaire",
    ],
    expectedOutcome:
      "Un suivi hebdomadaire relié à la fiche projet et aux responsables concernés.",
    verification:
      "À vérifier dans la démo avec un projet fictif, ses suivis et son rapport imprimable.",
  },
  estimation: {
    problems: [
      "Le budget, les lots et les listes de partenaires sont préparés séparément.",
      "Les accusés, réponses et relances sont difficiles à suivre.",
      "La décision d’attribution perd les pièces et hypothèses comparées.",
    ],
    workflow: [
      "Valider le budget source",
      "Préparer les lots",
      "Inviter les partenaires admissibles",
      "Comparer et documenter la recommandation",
    ],
    expectedOutcome:
      "Un appel d’offres traçable du budget approuvé jusqu’à la recommandation.",
    verification:
      "À vérifier dans la démo avec le parcours BID, le portail fictif et la comparaison des offres.",
  },
  comptabilite: {
    problems: [
      "Les pièces justificatives et ventilations ne suivent pas toujours la facture.",
      "L’approbation manque de contexte projet ou d’engagement.",
      "Le budget et les coûts réels sont révisés dans des vues différentes.",
    ],
    workflow: [
      "Identifier le fournisseur",
      "Joindre et ventiler la facture",
      "Faire approuver avec une trace",
      "Réviser l’impact au projet",
    ],
    expectedOutcome:
      "Une facture rattachée au bon fournisseur, chantier et code de coût avant approbation.",
    verification:
      "À vérifier dans la démo avec une facture fictive, sa ventilation et la file d’approbation.",
  },
} satisfies Record<SolutionRole["slug"], SolutionRoleDetail>;

export type SectorSlug =
  | "entrepreneurs-generaux"
  | "entrepreneurs-specialises"
  | "equipes-multiprojets";

export type SectorContent = {
  slug: SectorSlug;
  code: string;
  name: string;
  headline: string;
  summary: string;
  challenges: string[];
  startingPoint: string;
  moduleSlugs: ModuleSlug[];
};

export const sectors = [
  {
    slug: "entrepreneurs-generaux",
    code: "EG",
    name: "Entrepreneurs généraux",
    headline: "Relier appels d’offres, contrats, coordination et coûts.",
    summary:
      "Un même projet sert de pivot aux équipes d’estimation, de gestion et d’administration.",
    challenges: [
      "Conserver la continuité entre estimation et exécution.",
      "Suivre partenaires, documents et décisions par lot.",
      "Lire les engagements et coûts dans le contexte du chantier.",
    ],
    startingPoint:
      "Commencer avec un projet pilote, un appel d’offres actif et une revue financière récurrente.",
    moduleSlugs: ["estimation-bid", "projets", "budgets", "contrats"],
  },
  {
    slug: "entrepreneurs-specialises",
    code: "ES",
    name: "Entrepreneurs spécialisés",
    headline: "Garder les travaux, documents et coûts rattachés au bon mandat.",
    summary:
      "ProJD peut cadrer un flux plus concentré autour des projets, engagements, factures et rapports.",
    challenges: [
      "Éviter la double saisie entre suivi de chantier et administration.",
      "Conserver les pièces et changements avec le bon contrat.",
      "Préparer une revue simple des coûts et actions ouvertes.",
    ],
    startingPoint:
      "Choisir un mandat représentatif et le flux administratif qui cause le plus de ressaisie.",
    moduleSlugs: ["projets", "contrats", "factures-ocr", "rapports"],
  },
  {
    slug: "equipes-multiprojets",
    code: "MP",
    name: "Équipes multi-projets",
    headline: "Voir les exceptions du portefeuille sans perdre le détail chantier.",
    summary:
      "Les responsables partagent une lecture commune des projets tout en ouvrant le détail seulement lorsqu’une décision est nécessaire.",
    challenges: [
      "Comparer la santé de plusieurs projets avec les mêmes critères.",
      "Repérer actions, risques et écarts qui dépassent les seuils internes.",
      "Distribuer des rapports cohérents aux équipes concernées.",
    ],
    startingPoint:
      "Définir une convention de projet, trois indicateurs de revue et les responsables de correction.",
    moduleSlugs: ["projets", "budgets", "rapports", "documents"],
  },
] satisfies SectorContent[];

export const getSectorBySlug = (slug: string): SectorContent | undefined =>
  sectors.find((sector) => sector.slug === slug);

export type ComparisonSlug = "excel" | "procore" | "sharepoint";

export type ComparisonContent = {
  slug: ComparisonSlug;
  name: string;
  title: string;
  summary: string;
  sourceStrengths: string[];
  limitsToEvaluate: string[];
  projdRole: string[];
  coexistence: string;
  relatedModules: ModuleSlug[];
};

export const comparisons = [
  {
    slug: "excel",
    name: "Excel",
    title: "ProJD et Excel : structurer le workflow sans interdire les classeurs.",
    summary:
      "Excel reste utile pour l’analyse ponctuelle et les imports contrôlés. ProJD ajoute des entités, états, responsabilités et traces communes.",
    sourceStrengths: [
      "Calculs et analyses ad hoc rapides.",
      "Format familier pour préparer ou vérifier un import.",
      "Souplesse pour explorer une hypothèse hors processus.",
    ],
    limitsToEvaluate: [
      "Versions concurrentes et provenance des cellules.",
      "Contrôles d’accès et historique des changements.",
      "Passage d’un classeur à une responsabilité opérationnelle.",
    ],
    projdRole: [
      "Conserver le projet, l’entreprise et les personnes comme références canoniques.",
      "Valider les imports avant de créer des lots ou budgets.",
      "Garder états, responsables et dates dans un workflow serveur.",
    ],
    coexistence:
      "Les exports et imports peuvent rester une frontière explicite; le classeur ne décide pas seul d’un état financier.",
    relatedModules: ["budgets", "estimation-bid", "rapports"],
  },
  {
    slug: "procore",
    name: "Procore",
    title: "ProJD et Procore : relier le terrain au workflow ERP.",
    summary:
      "Procore peut demeurer une source terrain. ProJD concentre la normalisation ERP, les partenaires, les coûts et les parcours de bureau.",
    sourceStrengths: [
      "Contexte de projet et collaboration terrain selon les outils activés.",
      "RFIs, submittals et documents accessibles par API selon les permissions.",
      "Adoption existante à préserver chez plusieurs équipes.",
    ],
    limitsToEvaluate: [
      "Licences et permissions réellement disponibles.",
      "Données qui doivent être lues, rapprochées ou laissées dans la source.",
      "Comportement attendu en cas d’accès expiré ou de panne.",
    ],
    projdRole: [
      "Conserver la provenance des références importées.",
      "Relier le contexte terrain aux budgets, contrats et rapports.",
      "Prévisualiser les synchronisations avant leur activation.",
    ],
    coexistence:
      "Le cadrage détermine quelle application demeure autoritaire pour chaque donnée; aucune synchronisation totale n’est présumée.",
    relatedModules: ["documents", "projets", "integrations"],
  },
  {
    slug: "sharepoint",
    name: "SharePoint",
    title: "ProJD et SharePoint : garder les fichiers, ajouter le contexte métier.",
    summary:
      "SharePoint peut rester la destination documentaire. ProJD conserve les références, mappages et règles qui relient un fichier au bon flux.",
    sourceStrengths: [
      "Bibliothèques et gouvernance Microsoft 365 existantes.",
      "Collaboration documentaire et permissions configurables.",
      "Intégration avec l’écosystème du client.",
    ],
    limitsToEvaluate: [
      "Structure des sites et bibliothèques cibles.",
      "Règles de synchronisation, confidentialité et fichiers privés.",
      "Propriétaire opérationnel du document et de ses métadonnées.",
    ],
    projdRole: [
      "Mapper projet, fichier et provenance.",
      "Bloquer les éléments marqués privé ou hors synchronisation.",
      "Présenter le document dans le contexte du projet ou de l’appel d’offres.",
    ],
    coexistence:
      "SharePoint garde les fichiers lorsque ce choix est confirmé; ProJD n’en devient pas un miroir incontrôlé.",
    relatedModules: ["documents", "estimation-bid", "integrations"],
  },
] satisfies ComparisonContent[];

export const getComparisonBySlug = (
  slug: string,
): ComparisonContent | undefined =>
  comparisons.find((comparison) => comparison.slug === slug);

export const glossaryTerms = [
  {
    term: "Addenda",
    definition:
      "Document qui modifie ou précise un appel d’offres avant sa fermeture. Son accusé de réception doit rester rattaché au lot concerné.",
  },
  {
    term: "Avenant",
    definition:
      "Modification approuvée au contrat. Le suivi doit distinguer la demande, l’approbation et son effet financier.",
  },
  {
    term: "Budget révisé",
    definition:
      "Budget initial ajusté par les changements approuvés selon les règles de l’entreprise.",
  },
  {
    term: "Code de coût",
    definition:
      "Dimension commune utilisée pour classer budget, engagement, facture et coût direct.",
  },
  {
    term: "Coût engagé",
    definition:
      "Montant associé à un engagement ou une obligation connue, même si la facture finale n’est pas encore comptabilisée.",
  },
  {
    term: "Directive",
    definition:
      "Instruction ou demande de changement qui doit être documentée avant sa résolution contractuelle et financière.",
  },
  {
    term: "Lot d’appel d’offres",
    definition:
      "Périmètre de travaux transmis à un groupe ciblé de partenaires avec documents, échéance et règles de réponse.",
  },
  {
    term: "Portail partenaire",
    definition:
      "Surface externe limitée à une invitation, utilisée pour consulter des documents et déposer une réponse sans ouvrir l’administration ERP.",
  },
  {
    term: "Projet canonique",
    definition:
      "Fiche de référence réutilisée par les modules afin d’éviter plusieurs versions du même chantier.",
  },
  {
    term: "RFI",
    definition:
      "Demande d’information formelle reliée à un projet, un responsable, une échéance et une réponse.",
  },
  {
    term: "Retenue",
    definition:
      "Part d’un paiement conservée selon les conditions applicables. Son traitement doit être confirmé par les règles contractuelles et comptables du client.",
  },
  {
    term: "Submittal",
    definition:
      "Élément soumis pour révision ou approbation, avec responsable, version, état et historique.",
  },
] as const;

export const verifiedScenarios = [
  {
    slug: "revue-projet",
    code: "SV-01",
    title: "Préparer une revue de projet",
    context:
      "Scénario de démonstration fondé sur le cockpit, les actions, les risques et le sommaire financier disponibles.",
    steps: [
      "Ouvrir un projet fictif.",
      "Repérer une action et un risque à traiter.",
      "Relire l’écart financier associé.",
      "Produire le rapport hebdomadaire.",
    ],
    evidence:
      "La validation porte sur la continuité du contexte et la production du rapport, pas sur un gain client chiffré.",
    moduleSlugs: ["projets", "budgets", "rapports"],
  },
  {
    slug: "appel-offres",
    code: "SV-02",
    title: "Suivre un appel d’offres",
    context:
      "Scénario de démonstration fondé sur le budget source, les lots, partenaires, documents et réponses fictives.",
    steps: [
      "Vérifier la provenance du budget.",
      "Ouvrir un lot et ses documents.",
      "Lire les états des invitations.",
      "Comparer les réponses reçues.",
    ],
    evidence:
      "La validation porte sur la traçabilité du parcours; aucun résultat d’adjudication réel n’est présenté.",
    moduleSlugs: ["estimation-bid", "partenaires", "portail-collaboration"],
  },
  {
    slug: "facture-fournisseur",
    code: "SV-03",
    title: "Ventiler et approuver une facture",
    context:
      "Scénario de démonstration fondé sur une facture et des données fournisseur entièrement fictives.",
    steps: [
      "Ouvrir la pièce PDF fictive.",
      "Vérifier fournisseur, projet et code de coût.",
      "Lire la ventilation.",
      "Suivre la décision d’approbation.",
    ],
    evidence:
      "L’OCR automatique n’est pas présenté comme terminé; la validation humaine demeure explicite.",
    moduleSlugs: ["factures-ocr", "budgets", "documents"],
  },
] as const;

export const contentLastModified = {
  core: "2026-07-26T00:00:00.000Z",
  product: "2026-07-26T00:00:00.000Z",
  pricing: "2026-07-27T00:00:00.000Z",
  resources: "2026-07-27T00:00:00.000Z",
  policies: "2026-07-26T00:00:00.000Z",
} as const;

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
  | "traiter-une-facture"
  | "preparer-une-revue-projet"
  | "cadrer-une-integration"
  | "qualifier-les-partenaires"
  | "preparer-une-implantation-pilote"
  | "documenter-un-avenant"
  | "importer-un-budget-preliminaire"
  | "recevoir-une-soumission"
  | "preparer-un-rapport-hebdomadaire";

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
  {
    slug: "preparer-une-revue-projet",
    code: "G05",
    title: "Préparer une revue de projet",
    category: "Pilotage",
    duration: "8 min",
    summary:
      "Passer du portefeuille aux exceptions qui demandent une décision, puis produire un rapport daté.",
    audience: "Direction et chargés de projet",
    outcome:
      "Une revue centrée sur les écarts, risques et actions attribués plutôt que sur la collecte des données.",
    steps: [
      {
        title: "Définir le périmètre de la revue",
        text: "Choisir les projets actifs, la période et les responsables présents avant d’ouvrir les indicateurs.",
        checks: ["Liste de projets", "Date de coupure", "Responsables attendus"],
      },
      {
        title: "Repérer les exceptions",
        text: "Filtrer les risques, actions en retard, jalons rapprochés et écarts financiers à expliquer.",
        checks: ["Actions bloquées", "Risques ouverts", "Écarts significatifs"],
      },
      {
        title: "Ouvrir le contexte source",
        text: "Passer du sommaire au projet, à la pièce ou au suivi concerné avant de décider.",
        checks: ["Projet canonique", "Source datée", "Pièce ou suivi relié"],
      },
      {
        title: "Affecter et publier",
        text: "Attribuer chaque décision, confirmer la date cible et produire le rapport hebdomadaire.",
        checks: ["Responsable unique", "Date cible", "Rapport généré"],
      },
    ],
    note: "Un tableau de bord signale une exception; il ne remplace pas la validation du contexte et de la source.",
    relatedModules: ["rapports", "projets", "budgets"],
  },
  {
    slug: "cadrer-une-integration",
    code: "G06",
    title: "Cadrer une intégration Procore ou SharePoint",
    category: "Intégrations",
    duration: "9 min",
    summary:
      "Définir la source autoritaire, le périmètre et le comportement d’échec avant toute synchronisation.",
    audience: "TI, opérations et responsables d’implantation",
    outcome:
      "Une fiche d’intégration testable qui précise données, permissions, fréquence et reprise.",
    steps: [
      {
        title: "Nommer la source autoritaire",
        text: "Décider quel système possède chaque donnée et qui peut approuver un changement de cette règle.",
        checks: ["Donnée concernée", "Système autoritaire", "Propriétaire métier"],
      },
      {
        title: "Vérifier les accès",
        text: "Confirmer licences, compte technique, scopes et environnement de test sans présumer des permissions.",
        checks: ["Licences", "Scopes minimaux", "Bac à sable"],
      },
      {
        title: "Limiter le premier périmètre",
        text: "Choisir un projet, une bibliothèque ou un type de référence et documenter les exclusions.",
        checks: ["Projet pilote", "Types inclus", "Données privées exclues"],
      },
      {
        title: "Tester l’échec et la reprise",
        text: "Retirer temporairement l’accès, répéter un événement et vérifier la reprise sans doublon.",
        checks: ["Timeout visible", "Nouvelle tentative sûre", "Aucun doublon"],
      },
    ],
    note: "Une intégration est activée seulement lorsque les permissions et le comportement d’échec ont été vérifiés.",
    relatedModules: ["integrations", "documents", "projets"],
  },
  {
    slug: "qualifier-les-partenaires",
    code: "G07",
    title: "Qualifier les partenaires d’un appel d’offres",
    category: "Estimation",
    duration: "7 min",
    summary:
      "Construire une liste d’invitation à partir des spécialités, contacts actifs et règles internes.",
    audience: "Estimateurs et responsables achats",
    outcome:
      "Une sélection justifiée avant l’envoi, sans exposer les notes internes aux partenaires.",
    steps: [
      {
        title: "Confirmer la spécialité du lot",
        text: "Relire la portée et les codes du budget avant de chercher des entreprises correspondantes.",
        checks: ["Portée du lot", "Spécialités ciblées", "Zone ou contraintes"],
      },
      {
        title: "Filtrer le répertoire",
        text: "Écarter les fiches fermées ou bloquées et vérifier que les contacts d’invitation sont actifs.",
        checks: ["Statut admissible", "Contact actif", "Préférences respectées"],
      },
      {
        title: "Relire le contexte interne",
        text: "Consulter les invitations précédentes et les notes autorisées sans les copier dans le portail.",
        checks: ["Historique", "Notes internes", "Décision documentée"],
      },
      {
        title: "Prévisualiser l’envoi",
        text: "Vérifier destinataires, modèle, documents, fermeture et lien expirant avant transmission.",
        checks: ["Destinataires", "Documents", "Date et lien"],
      },
    ],
    note: "La présence dans le répertoire ne constitue pas une qualification réglementaire ou contractuelle automatique.",
    relatedModules: ["partenaires", "estimation-bid", "portail-collaboration"],
  },
  {
    slug: "preparer-une-implantation-pilote",
    code: "G08",
    title: "Préparer une implantation pilote",
    category: "Implantation",
    duration: "10 min",
    summary:
      "Choisir un projet, une équipe et un résultat vérifiable avant d’élargir le déploiement.",
    audience: "Direction, responsables métier et TI",
    outcome:
      "Un pilote borné avec responsabilités, données de départ, critères de validation et décision de sortie.",
    steps: [
      {
        title: "Choisir le problème prioritaire",
        text: "Décrire une tâche actuelle, sa source et le résultat observable attendu sans empiler plusieurs transformations.",
        checks: ["Tâche précise", "Propriétaire", "Résultat observable"],
      },
      {
        title: "Sélectionner le projet et l’équipe",
        text: "Prendre un contexte représentatif mais contrôlable, avec les personnes disponibles pour valider.",
        checks: ["Projet pilote", "Utilisateurs nommés", "Responsable de décision"],
      },
      {
        title: "Préparer les données",
        text: "Inventorier les sources, nettoyer seulement le périmètre requis et conserver leur provenance.",
        checks: ["Sources", "Qualité minimale", "Données sensibles"],
      },
      {
        title: "Fixer les critères de sortie",
        text: "Définir les scénarios à jouer, les limites acceptées et la décision d’étendre, corriger ou arrêter.",
        checks: ["Scénarios", "Limites", "Date de décision"],
      },
    ],
    note: "Un pilote sert à vérifier un workflow; il ne constitue pas une promesse de résultat généralisée à toute l’entreprise.",
    relatedModules: ["projets", "integrations", "rapports"],
  },
  {
    slug: "documenter-un-avenant",
    code: "G09",
    title: "Documenter un avenant de contrat",
    category: "Contrats",
    duration: "8 min",
    summary:
      "Conserver la demande, les pièces, la décision et l’effet financier dans le même contexte contrat-chantier.",
    audience: "Administration de contrats et chargés de projet",
    outcome:
      "Un changement dont l’origine, l’approbation et l’impact peuvent être relus sans reconstruire le dossier.",
    steps: [
      {
        title: "Identifier l’origine du changement",
        text: "Relier la demande à la directive, au document ou à l’échange qui l’a déclenchée.",
        checks: ["Source datée", "Projet et contrat", "Responsable du suivi"],
      },
      {
        title: "Décrire le périmètre",
        text: "Distinguer la portée technique, les exclusions et les pièces utilisées pour préparer l’évaluation.",
        checks: ["Travaux visés", "Exclusions", "Pièces de référence"],
      },
      {
        title: "Évaluer puis faire approuver",
        text: "Conserver les hypothèses de coût et d’échéance avant de changer l’état contractuel.",
        checks: ["Montant proposé", "Effet calendrier", "Décision autorisée"],
      },
      {
        title: "Relire l’impact consolidé",
        text: "Vérifier que le changement approuvé est visible dans l’analyse du contrat et le budget concerné.",
        checks: ["État final", "Budget révisé", "Trace d’audit"],
      },
    ],
    note: "ProJD soutient la trace du changement; l’interprétation juridique et l’autorité d’approbation restent celles du contrat.",
    relatedModules: ["contrats", "budgets", "documents"],
  },
  {
    slug: "importer-un-budget-preliminaire",
    code: "G10",
    title: "Importer un budget préliminaire",
    category: "Estimation",
    duration: "9 min",
    summary:
      "Préparer un classeur contrôlé, valider son aperçu et conserver sa provenance avant de créer des lots.",
    audience: "Estimateurs et responsables de budget",
    outcome:
      "Un budget importé avec codes, montants et source vérifiables avant sa soumission.",
    steps: [
      {
        title: "Geler la source d’import",
        text: "Conserver une copie datée du classeur et identifier son propriétaire avant toute transformation.",
        checks: ["Fichier daté", "Propriétaire", "Version retenue"],
      },
      {
        title: "Normaliser les colonnes",
        text: "Aligner codes, descriptions, types et montants sur le modèle attendu sans effacer les valeurs sources.",
        checks: ["Codes uniques", "Types explicites", "Montants numériques"],
      },
      {
        title: "Réviser l’aperçu",
        text: "Traiter lignes rejetées, doublons et totaux inattendus avant de confirmer l’import.",
        checks: ["Erreurs corrigées", "Doublons expliqués", "Total rapproché"],
      },
      {
        title: "Soumettre le budget",
        text: "Faire approuver le budget dans ProJD avant de l’utiliser comme source des lots d’appel d’offres.",
        checks: ["État soumis", "Approbateur", "Provenance conservée"],
      },
    ],
    note: "Le classeur reste une source identifiable; l’import ne doit pas convertir silencieusement une valeur invalide.",
    relatedModules: ["budgets", "estimation-bid", "rapports"],
  },
  {
    slug: "recevoir-une-soumission",
    code: "G11",
    title: "Recevoir une soumission par le portail",
    category: "Portail partenaire",
    duration: "7 min",
    summary:
      "Vérifier les documents accusés, la réponse et les fichiers déposés sans exposer les autres partenaires.",
    audience: "Estimateurs, achats et coordination",
    outcome:
      "Une réponse privée rattachée à l’invitation et prête à entrer dans la comparaison.",
    steps: [
      {
        title: "Vérifier l’invitation",
        text: "Confirmer le lot, le partenaire, l’expiration du lien et les documents exigés.",
        checks: ["Invitation ciblée", "Lien valide", "Documents attendus"],
      },
      {
        title: "Contrôler les accusés",
        text: "S’assurer que les addenda ou pièces obligatoires ont été consultés et accusés.",
        checks: ["Versions visibles", "Accusés requis", "Date de consultation"],
      },
      {
        title: "Recevoir la réponse",
        text: "Conserver l’état intéressé ou refusé, le montant déclaré et les fichiers dans l’espace privé de l’invitation.",
        checks: ["État de réponse", "Montant", "Fichiers privés"],
      },
      {
        title: "Préparer la comparaison",
        text: "Signaler les renseignements manquants et ouvrir la réponse dans le comparatif sans modifier son dépôt original.",
        checks: ["Pièces complètes", "Écarts signalés", "Source intacte"],
      },
    ],
    note: "Un partenaire ne doit jamais pouvoir lire les montants, fichiers ou notes associés à une autre invitation.",
    relatedModules: ["portail-collaboration", "estimation-bid", "partenaires"],
  },
  {
    slug: "preparer-un-rapport-hebdomadaire",
    code: "G12",
    title: "Préparer un rapport hebdomadaire",
    category: "Coordination",
    duration: "6 min",
    summary:
      "Réviser les actions, risques, jalons et décisions avant de produire une version partageable et datée.",
    audience: "Chargés de projet et coordination",
    outcome:
      "Un rapport qui reflète l’état du projet à une date précise avec les responsables des suivis ouverts.",
    steps: [
      {
        title: "Choisir la période",
        text: "Fixer la date de coupure et vérifier que le projet et son responsable sont correctement identifiés.",
        checks: ["Date de coupure", "Projet", "Responsable"],
      },
      {
        title: "Mettre à jour les suivis",
        text: "Relire actions, risques, RFIs et jalons qui doivent apparaître dans la réunion.",
        checks: ["États actuels", "Dates cibles", "Responsables"],
      },
      {
        title: "Valider les faits saillants",
        text: "Séparer les informations de contexte des décisions ou escalades demandées.",
        checks: ["Décisions requises", "Blocages", "Éléments clos"],
      },
      {
        title: "Produire et archiver",
        text: "Générer la version imprimable, relire son contenu et conserver la date de production.",
        checks: ["Aperçu relu", "Date visible", "Version partageable"],
      },
    ],
    note: "Le rapport est une lecture à une date donnée; les états vivants continuent d’évoluer dans le projet.",
    relatedModules: ["projets", "rapports", "documents"],
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
  {
    code: "COM",
    title: "Comparaisons",
    text: "Situer ProJD par rapport à Excel, Procore et SharePoint sans présumer qu’un outil doit disparaître.",
    href: "/comparer",
    action: "Comparer les rôles",
  },
  {
    code: "GLS",
    title: "Glossaire construction",
    text: "Des définitions courtes pour les objets métier utilisés dans les pages et les guides.",
    href: "/glossaire",
    action: "Consulter le glossaire",
  },
  {
    code: "SV",
    title: "Scénarios vérifiables",
    text: "Des parcours précis à reproduire dans la démo fictive, sans témoignage ni gain client inventé.",
    href: "/scenarios",
    action: "Voir les scénarios",
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
