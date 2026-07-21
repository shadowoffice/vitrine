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
    description: "Pour lancer une première équipe projet avec les bases de suivi ProJD.",
    items: ["3 utilisateurs inclus", "Espace ProJD initial", "Licence de départ", "Plan d'implantation"],
  },
  {
    code: "croissance",
    name: "Croissance",
    publicName: "Croissance",
    monthlyPriceCents: 54900,
    setupFeeCents: 150000,
    includedSeats: 10,
    extraSeatMonthlyCents: 3900,
    description: "Pour centraliser les opérations d'une entreprise de construction active.",
    items: ["10 utilisateurs inclus", "ERP multi-projets", "Routage domaines", "Support implantation"],
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
    description: "Pour plusieurs équipes, projets actifs et flux d'intégration.",
    items: ["25 utilisateurs inclus", "Plusieurs groupes projet", "Audit complet", "Connecteurs avancés"],
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
