import { NextRequest, NextResponse } from "next/server";
import { getServerSession, type Session } from "next-auth";
import prisma from "@/lib/prisma";
import { encrypt, decrypt } from "@/lib/crypto";
import { authOptions } from "@/lib/auth";

function ensureInstructor(session: Session | null): NextResponse | null {
  if (!session?.user?.role || session.user.role !== "instructor") {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return null;
}

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    const gate = ensureInstructor(session);
    if (gate) return gate;

    const config = await prisma.razorpayConfig.findFirst({
      orderBy: { createdAt: "desc" },
    });

    if (!config) {
      return NextResponse.json({
        razorpayKeyId: "",
        razorpayKeySecret: "",
        razorpayWebhookSecret: "",
      });
    }

    return NextResponse.json({
      razorpayKeyId: config.keyId,
      razorpayKeySecret: config.keySecret ? decrypt(config.keySecret) : "",
      razorpayWebhookSecret: config.webhookSecret ? decrypt(config.webhookSecret) : "",
    });
  } catch (err) {
    console.error("Error fetching Razorpay config:", err);
    return NextResponse.json({ error: "Failed to fetch configuration" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    const gate = ensureInstructor(session);
    if (gate) return gate;

    const { razorpayKeyId, razorpayKeySecret, razorpayWebhookSecret } = await req.json();

    if (!razorpayKeyId || !razorpayKeySecret) {
      return NextResponse.json(
        { error: "Key ID and Secret are required" },
        { status: 400 }
      );
    }

    const encryptedSecret = encrypt(razorpayKeySecret);
    const encryptedWebhook = razorpayWebhookSecret ? encrypt(razorpayWebhookSecret) : null;

    const existing = await prisma.razorpayConfig.findFirst();

    if (existing) {
      await prisma.razorpayConfig.update({
        where: { id: existing.id },
        data: {
          keyId: razorpayKeyId,
          keySecret: encryptedSecret,
          webhookSecret: encryptedWebhook,
          isActive: true,
        },
      });
    } else {
      await prisma.razorpayConfig.create({
        data: {
          keyId: razorpayKeyId,
          keySecret: encryptedSecret,
          webhookSecret: encryptedWebhook,
          isActive: true,
        },
      });
    }

    return NextResponse.json({ success: true, message: "Configuration saved successfully" });
  } catch (err) {
    console.error("Error saving Razorpay config:", err);
    return NextResponse.json({ error: "Failed to save configuration" }, { status: 500 });
  }
}
