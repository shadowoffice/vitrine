import { formatMoney, pricingPlans } from "./pricing";

export const siteUrl = "https://fichero.cloud";

export const saasLoginUrl = "https://login.fichero.cloud/login";
export const demoErpUrl = "https://demo.erp.fichero.cloud/admin/login";
export const testTenantUrl = "https://test.erp.fichero.cloud";

export const mainMessage =
  "Fichero présente l'offre, Fondation opère les environnements SaaS et ProJD livre l'ERP construction pour les entrepreneurs québécois.";

export const navigation = [
  { label: "ProJD", href: "/projd" },
  { label: "Fondation", href: "/fondation" },
  { label: "Modules", href: "/modules" },
  { label: "Tarifs", href: "/tarifs" },
  { label: "Démo ERP", href: demoErpUrl },
  { label: "Statut", href: "/statut" },
];

export const indicators = [
  { value: "ERP", label: "projets, coûts, documents" },
  { value: "SaaS", label: "tenants et domaines" },
  { value: "TLS", label: "certificats suivis" },
  { value: "QC", label: "construction Québec" },
];

export const productPillars = [
  {
    title: "Vitrine publique",
    text: "Une entrée claire pour présenter l'offre, qualifier les achats et ouvrir les dossiers Fondation.",
    href: "/",
  },
  {
    title: "Fondation SaaS",
    text: "Le plan de contrôle pour les clients, tenants, domaines, TLS, licences, runtime et audits.",
    href: "/fondation",
  },
  {
    title: "ERP ProJD",
    text: "L'application métier pour projets, budgets, appels d'offres, factures, documents et rapports.",
    href: "/projd",
  },
];

export const whyFichero = [
  {
    title: "Pas un simple site web",
    text: "La vitrine qualifie les demandes et les transmet vers l'opération SaaS au lieu de finir dans une boîte courriel vague.",
  },
  {
    title: "Separation nette",
    text: "Marketing, contrôle plateforme et ERP métier gardent chacun leur rôle, leurs permissions et leur rythme de livraison.",
  },
  {
    title: "Concu pour le chantier",
    text: "Les modules partent des besoins construction: coûts, documents, soumissions, partenaires et suivi de projet.",
  },
  {
    title: "Implantation progressive",
    text: "On peut acheter un premier tenant ProJD, activer les licences, puis ajouter les intégrations Procore, SharePoint et Outlook.",
  },
];

export const modules = [
  {
    name: "Clients et tenants",
    text: "Dossiers clients, instances ERP, domaines, licences et environnement de test.",
  },
  {
    name: "Projets et budgets",
    text: "Projets, phases, codes de coût, budgets, engagements et coûts réels.",
  },
  {
    name: "Estimation et BID",
    text: "Sélection partenaires, invitations, relances, suivi des réponses et attribution.",
  },
  {
    name: "Documents",
    text: "SharePoint, Procore, politiques de synchronisation et espace fichiers employé.",
  },
  {
    name: "Factures et OCR",
    text: "Réception des factures, lecture assistée, validation humaine et posting contrôlé.",
  },
  {
    name: "Partenaires",
    text: "Import ConstructBuy, spécialités, statuts, notes internes et portail sécurisé.",
  },
  {
    name: "Operations SaaS",
    text: "Santé runtime, DNS, TLS, sauvegardes, migrations et rollback préparé.",
  },
  {
    name: "Rapports",
    text: "Vues pour estimation, projets, comptabilité, direction et opérations.",
  },
];

export const workflow = [
  "Qualifier le client",
  "Planifier son tenant",
  "Brancher domaine et TLS",
  "Activer les modules",
  "Suivre santé et coûts",
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
    text: "Connecter projets, photos, documents et références externes sans transformer Procore en source non contrôlée.",
  },
  {
    name: "SharePoint",
    text: "Structurer les bibliothèques, synchroniser les documents utiles et appliquer les politiques de confidentialité.",
  },
  {
    name: "Outlook",
    text: "Préparer les communications d'appels d'offres, relances et suivis avec Microsoft Graph.",
  },
];

export const securityItems = [
  "Tenants ERP isolés et rattachés à un client Fondation.",
  "Liens portail signés, scopes, expirants et auditables.",
  "Opérations SaaS journalisées avec rôles owner, billing, ops et support.",
  "Aucune promesse de conformité légale sans workflow vérifié.",
];

export const faqItems = [
  {
    question: "Fichero remplace-t-il Procore?",
    answer:
      "Non. ProJD devient la couche ERP et workflow. Procore peut rester connecté pour les données et documents pertinents.",
  },
  {
    question: "Est-ce pret pour plusieurs clients?",
    answer:
      "La direction produit est multi-tenant. Fondation garde le contrôle des clients, domaines, TLS, licences et opérations.",
  },
  {
    question: "Que se passe-t-il après l'achat?",
    answer:
      "Fondation confirme le paiement, attribue la licence, réserve le sous-domaine et prépare l'instance ProJD avant l'activation.",
  },
  {
    question: "Ou vont les demandes de la vitrine?",
    answer:
      "Elles peuvent être envoyées à Fondation par API sécurisée ou conservées en sauvegarde locale si l'intégration n'est pas configurée.",
  },
];

export const statusTargets = [
  { label: "Vitrine", status: "En ligne", href: "/healthz", detail: "Site public et formulaire" },
  { label: "Fondation", status: "Contrôle", href: saasLoginUrl, detail: "Connexion SaaS" },
  { label: "Démo ProJD", status: "Lecture seule", href: demoErpUrl, detail: "Compte demo ProJD" },
  { label: "ERP test", status: "Validation", href: testTenantUrl, detail: "Tenant de test" },
];
