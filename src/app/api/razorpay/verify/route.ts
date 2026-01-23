import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";
import crypto from "crypto";
import prisma from "@/lib/prisma";
import { decrypt } from "@/lib/crypto";
import { getPlanConfig } from "@/lib/paymentPlans";
import { authOptions } from "@/lib/auth";

async function resolveKeys() {
  const config = await prisma.razorpayConfig.findFirst({ where: { isActive: true } });

  const keyId = process.env.RAZORPAY_KEY_ID || config?.keyId; 
  const keySecret =
    process.env.RAZORPAY_KEY_SECRET || (config?.keySecret ? decrypt(config.keySecret) : undefined);
  
  if (!keyId || !keySecret) {
    throw new Error("Razorpay not configured");
  }

  return { keyId, keySecret };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id || !session.user.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { orderId, paymentId, signature } = await req.json();

    if (!orderId || !paymentId || !signature) {
      return NextResponse.json({ error: "Missing payment details" }, { status: 400 });
    }

    const { keyId, keySecret } = await resolveKeys();

    const expectedSignature = crypto
      .createHmac("sha256", keySecret)
      .update(`${orderId}|${paymentId}`)
      .digest("hex");

    if (expectedSignature !== signature) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });
    const order = await razorpay.orders.fetch(orderId);

    const planId = (order.notes as any)?.planId as string;
    const plan = await getPlanConfig(planId, { includeUnpublished: true });

    if (!plan) {
      return NextResponse.json({ error: "Could not determine plan" }, { status: 400 });
    }

    const subscriptionStart = new Date();
    const subscriptionEnd = new Date(
      subscriptionStart.getTime() + plan.durationDays * 24 * 60 * 60 * 1000
    );

    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        subscriptionPlan: plan.slug,
        subscriptionStart,
        subscriptionEnd,
        hasActiveSubscription: true,
        subscriptionStatus: "ACTIVE",
        paymentStatus: "COMPLETED",
        paymentId: paymentId,
      },
    });

    return NextResponse.json({ success: true });
  } catch (err: any) {
    console.error("Razorpay verification failed:", err);
    return NextResponse.json(
      { error: err.message || "Payment verification failed" },
      { status: 500 }
    );
  }
}
