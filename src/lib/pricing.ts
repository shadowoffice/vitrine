export const pricingPlanCodes = ["starter", "croissance", "plateforme"] as const;

export type PricingPlanCode = (typeof pricingPlanCodes)[number];

export type PricingPlan = {
  code: PricingPlanCode;
  name: string;
  publicName: string;
  monthlyPriceCents: number;
  setupFeeCents: number;
  includedSeats: number;
  extraSeatMonthlyCents: number;
  description: string;
  idealFor: string;
  deploymentScope: string;
  integrationScope: string;
  supportScope: string;
  items: string[];
  featured?: boolean;
};

export type PricingCart = {
  plan: PricingPlan;
  seatCount: number;
  extraSeats: number;
  setupFeeCents: number;
  monthlySubtotalCents: number;
  extraSeatSubtotalCents: number;
  dueTodayCents: number;
  firstYearSubtotalCents: number;
  currency: "CAD";
};

export type PricingRecommendationInput = {
  requestedSeats: number;
  needsMultipleTeams: boolean;
  needsAdvancedIntegrations: boolean;
};

export type PricingComparisonRow = {
  label: string;
  values: Record<PricingPlanCode, string>;
};

export const pricingCommercialNotes = {
  currency: "Tous les montants sont affichés en dollars canadiens.",
  taxes:
    "Les taxes applicables ne sont pas incluses dans les estimations publiques.",
  billing:
    "L’estimation « aujourd’hui » additionne la mise en route et un premier mois au tarif catalogue; le devis approuvé confirme l’échéancier réel.",
  terms:
    "La durée, le renouvellement, la résiliation, les intégrations et tout travail hors périmètre sont confirmés dans la proposition et le contrat acceptés.",
} as const;

export const pricingPlans: PricingPlan[] = [
  {
    code: "starter",
    name: "Départ",
    publicName: "Essentiel",
    monthlyPriceCents: 24900,
    setupFeeCents: 75000,
    includedSeats: 3,
    extraSeatMonthlyCents: 3900,
    description: "Pour valider ProJD avec une première équipe et un périmètre de travail ciblé.",
    idealFor: "Une équipe pilote jusqu’à 3 accès inclus.",
    deploymentScope: "Un projet pilote et un flux métier prioritaire.",
    integrationScope: "Connecteurs évalués séparément selon les accès disponibles.",
    supportScope: "Plan d’implantation accompagné.",
    items: [
      "3 accès inclus",
      "1 équipe pilote",
      "Modules essentiels",
      "Plan d’implantation accompagné",
    ],
  },
  {
    code: "croissance",
    name: "Croissance",
    publicName: "Croissance",
    monthlyPriceCents: 54900,
    setupFeeCents: 150000,
    includedSeats: 10,
    extraSeatMonthlyCents: 3900,
    description: "Pour réunir plusieurs projets, l’estimation et les opérations courantes.",
    idealFor: "Une entreprise multi-projets jusqu’à 10 accès inclus.",
    deploymentScope: "Plusieurs projets et flux métier reliés.",
    integrationScope: "Cadrage des intégrations nécessaires au périmètre.",
    supportScope: "Implantation et validation des scénarios métier.",
    items: [
      "10 accès inclus",
      "Gestion multi-projets",
      "BID et portail partenaires",
      "Cadrage des intégrations",
    ],
    featured: true,
  },
  {
    code: "plateforme",
    name: "Plateforme",
    publicName: "Plateforme",
    monthlyPriceCents: 99900,
    setupFeeCents: 300000,
    includedSeats: 25,
    extraSeatMonthlyCents: 3500,
    description: "Pour plusieurs équipes et un déploiement ERP plus large.",
    idealFor: "Plusieurs équipes métier jusqu’à 25 accès inclus.",
    deploymentScope: "Déploiement ERP plus large, planifié par étapes.",
    integrationScope: "API ERP et connecteurs activés selon les permissions.",
    supportScope: "Plan de déploiement avancé.",
    items: [
      "25 accès inclus",
      "Plusieurs équipes métier",
      "API ERP sur activation",
      "Plan de déploiement avancé",
    ],
  },
];

export const getPricingPlan = (code: string | null | undefined): PricingPlan =>
  pricingPlans.find((plan) => plan.code === code) ?? pricingPlans[1];

export const buildPricingCart = (planCode: string | null | undefined, requestedSeats: number): PricingCart => {
  const plan = getPricingPlan(planCode);
  const seatCount = Math.min(5000, Math.max(1, Math.trunc(requestedSeats)));
  const extraSeats = Math.max(0, seatCount - plan.includedSeats);
  const extraSeatSubtotalCents = extraSeats * plan.extraSeatMonthlyCents;
  const monthlySubtotalCents = plan.monthlyPriceCents + extraSeatSubtotalCents;
  const firstYearSubtotalCents = plan.setupFeeCents + monthlySubtotalCents * 12;

  return {
    plan,
    seatCount,
    extraSeats,
    setupFeeCents: plan.setupFeeCents,
    monthlySubtotalCents,
    extraSeatSubtotalCents,
    dueTodayCents: plan.setupFeeCents + monthlySubtotalCents,
    firstYearSubtotalCents,
    currency: "CAD",
  };
};

export const recommendPricingPlan = ({
  requestedSeats,
  needsMultipleTeams,
  needsAdvancedIntegrations,
}: PricingRecommendationInput): PricingPlan => {
  const seatCount = Math.min(5000, Math.max(1, Math.trunc(requestedSeats)));

  if (seatCount > 10 || (needsMultipleTeams && needsAdvancedIntegrations)) {
    return getPricingPlan("plateforme");
  }

  if (seatCount > 3 || needsMultipleTeams || needsAdvancedIntegrations) {
    return getPricingPlan("croissance");
  }

  return getPricingPlan("starter");
};

export const formatMoney = (cents: number): string =>
  new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);

export const pricingComparisonRows: PricingComparisonRow[] = [
  {
    label: "Profil de départ",
    values: Object.fromEntries(
      pricingPlans.map((plan) => [plan.code, plan.idealFor]),
    ) as Record<PricingPlanCode, string>,
  },
  {
    label: "Accès inclus",
    values: Object.fromEntries(
      pricingPlans.map((plan) => [plan.code, String(plan.includedSeats)]),
    ) as Record<PricingPlanCode, string>,
  },
  {
    label: "Accès additionnel",
    values: Object.fromEntries(
      pricingPlans.map((plan) => [
        plan.code,
        `${formatMoney(plan.extraSeatMonthlyCents)}/mois`,
      ]),
    ) as Record<PricingPlanCode, string>,
  },
  {
    label: "Périmètre d’implantation",
    values: Object.fromEntries(
      pricingPlans.map((plan) => [plan.code, plan.deploymentScope]),
    ) as Record<PricingPlanCode, string>,
  },
  {
    label: "Intégrations",
    values: Object.fromEntries(
      pricingPlans.map((plan) => [plan.code, plan.integrationScope]),
    ) as Record<PricingPlanCode, string>,
  },
  {
    label: "Accompagnement",
    values: Object.fromEntries(
      pricingPlans.map((plan) => [plan.code, plan.supportScope]),
    ) as Record<PricingPlanCode, string>,
  },
];
