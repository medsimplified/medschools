import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import Razorpay from "razorpay";
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
    throw new Error("Razorpay not configured. Please contact the administrator.");
  }

  return { keyId, keySecret };
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.email || !session.user.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { planId } = await req.json();
    const plan = await getPlanConfig(planId);

    if (!plan) {
      return NextResponse.json({ error: "Invalid plan selected" }, { status: 400 });
    }

    const { keyId, keySecret } = await resolveKeys();

    const razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret });

    const order = await razorpay.orders.create({
      amount: plan.price * 100,
      currency: plan.currency,
      payment_capture: 1,
      receipt: `order_${Date.now()}_${session.user.id}`,
      notes: {
        userId: session.user.id,
        planId: plan.slug,
        email: session.user.email,
      },
    });

    return NextResponse.json({
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId,
      plan: {
        slug: plan.slug,
        title: plan.title,
        price: plan.price,
        currency: plan.currency,
        durationDays: plan.durationDays,
        durationLabel: plan.durationLabel,
      },
    });
  } catch (err: any) {
    console.error("Razorpay order creation failed:", err);
    return NextResponse.json(
      { error: err.message || "Unable to initiate payment" },
      { status: 500 }
    );
  }
}
