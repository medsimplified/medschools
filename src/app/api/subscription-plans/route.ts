import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import type { Session } from "next-auth";
import type { SubscriptionPlan } from "@prisma/client";
import prisma from "@/lib/prisma";
import { slugify } from "@/lib/slugify";
import { authOptions } from "@/lib/auth";

function isInstructor(session: Session | null) {
  const role = session?.user?.role;
  return role === "instructor";
}

function sanitizeFeatures(input: unknown): string[] {
  if (!Array.isArray(input)) {
    return [];
  }

  return input
    .map((value) => (typeof value === "string" ? value : String(value || "")))
    .map((value) => value.trim())
    .filter((value) => value.length > 0);
}

async function ensureUniqueSlug(baseInput: string, excludeId?: string): Promise<string> {
  const fallback = `plan-${Date.now()}`;
  const base = slugify(baseInput) || fallback;
  let candidate = base;
  let counter = 1;

  while (true) {
    const match = await prisma.subscriptionPlan.findFirst({
      where: excludeId
        ? { slug: candidate, NOT: { id: excludeId } }
        : { slug: candidate },
      select: { id: true },
    });

    if (!match) {
      return candidate;
    }

    candidate = `${base}-${counter++}`;

    if (counter > 50) {
      throw new Error("Unable to generate unique plan slug");
    }
  }
}

function serializePlan(plan: SubscriptionPlan) {
  return {
    id: plan.id,
    slug: plan.slug,
    title: plan.title,
    description: plan.description,
    price: plan.price,
    currency: plan.currency,
    durationDays: plan.durationDays,
    durationLabel: plan.durationLabel,
    features: plan.features,
    isPopular: plan.isPopular,
    isPublished: plan.isPublished,
    displayOrder: plan.displayOrder,
    highlight: plan.highlight,
    createdAt: plan.createdAt,
    updatedAt: plan.updatedAt,
  };
}

function buildBadRequest(message: string) {
  return NextResponse.json({ error: message }, { status: 400 });
}

function buildUnauthorized() {
  return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const scope = searchParams.get("scope") ?? "published";

  if (scope === "all") {
    const session = await getServerSession(authOptions);
    if (!isInstructor(session)) {
      return buildUnauthorized();
    }
  }

  const where = scope === "all" ? undefined : { isPublished: true };

  const plans = await prisma.subscriptionPlan.findMany({
    where,
    orderBy: [{ displayOrder: "asc" }, { createdAt: "asc" }],
  });

  return NextResponse.json(plans.map(serializePlan));
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!isInstructor(session)) {
    return buildUnauthorized();
  }

  const body = await req.json();

  const title = (body.title as string | undefined)?.trim();
  const description = (body.description as string | undefined)?.trim() || null;
  const durationLabel = (body.durationLabel as string | undefined)?.trim();
  const currency = (body.currency as string | undefined)?.trim() || "INR";
  const highlight = (body.highlight as string | undefined)?.trim() || null;

  if (!title) {
    return buildBadRequest("Plan title is required");
  }

  if (!durationLabel) {
    return buildBadRequest("Duration label is required");
  }

  const parsedPrice = Number(body.price);
  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return buildBadRequest("Price must be a positive number");
  }
  const price = Math.round(parsedPrice);

  const parsedDuration = Number(body.durationDays);
  if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
    return buildBadRequest("Duration days must be greater than 0");
  }
  const durationDays = Math.round(parsedDuration);

  const displayOrder = Number.isFinite(Number(body.displayOrder))
    ? Math.round(Number(body.displayOrder))
    : 0;

  const isPopular = Boolean(body.isPopular);
  const isPublished = Boolean(body.isPublished);
  const features = sanitizeFeatures(body.features);

  const slugInput = (body.slug as string | undefined)?.trim() || title;
  const slug = await ensureUniqueSlug(slugInput);

  const createdPlan = await prisma.subscriptionPlan.create({
    data: {
      title,
      description,
      price,
      currency,
      durationDays,
      durationLabel,
      features,
      isPopular,
      isPublished,
      displayOrder,
      highlight,
      slug,
      createdById: session?.user?.id ?? null,
    },
  });

  return NextResponse.json(serializePlan(createdPlan), { status: 201 });
}

export async function PUT(req: NextRequest) {
  const session = await getServerSession(authOptions);

  if (!isInstructor(session)) {
    return buildUnauthorized();
  }

  const body = await req.json();
  const id = (body.id as string | undefined)?.trim();

  if (!id) {
    return buildBadRequest("Plan id is required");
  }

  const existing = await prisma.subscriptionPlan.findUnique({ where: { id } });

  if (!existing) {
    return NextResponse.json({ error: "Plan not found" }, { status: 404 });
  }

  const title = (body.title as string | undefined)?.trim() || existing.title;
  const description =
    (body.description as string | undefined)?.trim() ?? existing.description;
  const durationLabel =
    (body.durationLabel as string | undefined)?.trim() || existing.durationLabel;
  const currency = (body.currency as string | undefined)?.trim() || existing.currency;
  const highlight =
    (body.highlight as string | undefined)?.trim() ?? existing.highlight;

  if (!title) {
    return buildBadRequest("Plan title is required");
  }

  if (!durationLabel) {
    return buildBadRequest("Duration label is required");
  }

  const parsedPrice =
    body.price === undefined ? existing.price : Number(body.price);

  if (!Number.isFinite(parsedPrice) || parsedPrice < 0) {
    return buildBadRequest("Price must be a positive number");
  }
  const price = Math.round(parsedPrice);

  const parsedDuration =
    body.durationDays === undefined ? existing.durationDays : Number(body.durationDays);

  if (!Number.isFinite(parsedDuration) || parsedDuration <= 0) {
    return buildBadRequest("Duration days must be greater than 0");
  }
  const durationDays = Math.round(parsedDuration);

  const displayOrder =
    body.displayOrder === undefined
      ? existing.displayOrder
      : Math.round(Number(body.displayOrder));

  const isPopular =
    body.isPopular === undefined ? existing.isPopular : Boolean(body.isPopular);
  const isPublished =
    body.isPublished === undefined ? existing.isPublished : Boolean(body.isPublished);

  const features =
    body.features === undefined
      ? existing.features
      : sanitizeFeatures(body.features);

  const slugInput =
    (body.slug as string | undefined)?.trim() || title || existing.slug;
  const slug = await ensureUniqueSlug(slugInput, existing.id);

  const updatedPlan = await prisma.subscriptionPlan.update({
    where: { id },
    data: {
      title,
      description,
      price,
      currency,
      durationDays,
      durationLabel,
      features,
      isPopular,
      isPublished,
      displayOrder,
      highlight,
      slug,
    },
  });

  return NextResponse.json(serializePlan(updatedPlan));
}
