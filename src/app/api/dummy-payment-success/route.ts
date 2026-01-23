import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function POST(req: Request) {
  try {
    const { email, plan } = await req.json();

    await prisma.user.update({
      where: { email },
      data: {
        subscriptionPlan: plan,
        subscriptionStatus: "ACTIVE",
        paymentStatus: "COMPLETED",
        hasActiveSubscription: true,
        subscriptionStart: new Date(),
        subscriptionEnd: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) // 30 days
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: "Failed to update subscription" }, { status: 500 });
  }
}
