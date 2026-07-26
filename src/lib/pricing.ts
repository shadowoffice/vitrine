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
  currency: "CAD";
};

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

  return {
    plan,
    seatCount,
    extraSeats,
    setupFeeCents: plan.setupFeeCents,
    monthlySubtotalCents,
    extraSeatSubtotalCents,
    dueTodayCents: plan.setupFeeCents + monthlySubtotalCents,
    currency: "CAD",
  };
};

export const formatMoney = (cents: number): string =>
  new Intl.NumberFormat("fr-CA", {
    style: "currency",
    currency: "CAD",
    maximumFractionDigits: cents % 100 === 0 ? 0 : 2,
  }).format(cents / 100);
