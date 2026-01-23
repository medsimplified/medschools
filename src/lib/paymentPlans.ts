import prisma from "./prisma";

export type PlanConfig = {
  slug: string;
  title: string;
  price: number;
  currency: string;
  durationDays: number;
  durationLabel: string;
  features: string[];
  isPopular: boolean;
  highlight?: string | null;
  displayOrder: number;
};

type GetPlanOptions = {
  includeUnpublished?: boolean;
};

export async function getPlanConfig(
  planSlug: string,
  options: GetPlanOptions = {}
): Promise<PlanConfig | null> {
  if (!planSlug) {
    return null;
  }

  const plan = await prisma.subscriptionPlan.findFirst({
    where: options.includeUnpublished
      ? { slug: planSlug }
      : { slug: planSlug, isPublished: true },
  });

  if (!plan) {
    return null;
  }

  return {
    slug: plan.slug,
    title: plan.title,
    price: plan.price,
    currency: plan.currency,
    durationDays: plan.durationDays,
    durationLabel: plan.durationLabel,
    features: plan.features,
    isPopular: plan.isPopular,
    highlight: plan.highlight,
    displayOrder: plan.displayOrder,
  };
}

export async function listPublishedPlans(): Promise<PlanConfig[]> {
  const plans = await prisma.subscriptionPlan.findMany({
    where: { isPublished: true },
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });

  return plans.map((plan) => ({
    slug: plan.slug,
    title: plan.title,
    price: plan.price,
    currency: plan.currency,
    durationDays: plan.durationDays,
    durationLabel: plan.durationLabel,
    features: plan.features,
    isPopular: plan.isPopular,
    highlight: plan.highlight,
    displayOrder: plan.displayOrder,
  }));
}
