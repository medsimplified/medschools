import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        subscriptionPlan: true,
        subscriptionStart: true,
        subscriptionEnd: true,
        hasActiveSubscription: true,
        subscriptionStatus: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Fetch payment records (you'll need to create a Payment model)
    // For now, returning subscription info
    const payments: any[] = [];

    return NextResponse.json({
      subscription: user,
      payments: payments
    });
  } catch (err) {
    console.error("Failed to fetch payment history:", err);
    return NextResponse.json({ error: "Failed to fetch payment history" }, { status: 500 });
  }
}
