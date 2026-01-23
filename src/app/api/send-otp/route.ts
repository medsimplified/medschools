import { NextRequest, NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { sendOtpEmail } from "../../../../lib/email"; // Ensure this exists

const RESEND_WINDOW_MS = 30 * 1000; // 30 seconds

export async function POST(req: NextRequest) {
  try {
    // ✅ Step 1: Parse request
    const { email } = await req.json();
    console.log("📥 /api/send-otp called with email:", email);

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // ✅ Step 2: Rate limit recent requests
    const last = await prisma.oTP.findFirst({
      where: { email },
      orderBy: { createdAt: "desc" },
    });

    if (last && Date.now() - last.createdAt.getTime() < RESEND_WINDOW_MS) {
      return NextResponse.json({ error: "Please wait before requesting again" }, { status: 429 });
    }

    // ✅ Step 3: Generate OTP
    const code = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    console.log("🔐 Generated OTP:", code);

    // ✅ Step 4: Store OTP in DB
    await prisma.oTP.create({
      data: {
        email,
        code,
        expiresAt,
      },
    });

    // ✅ Step 5: Send Email (fallback to console)
    try {
      await sendOtpEmail(email, code);
    } catch (emailError) {
      console.warn("⚠️ Failed to send OTP email. Showing in console for debug:");
      console.warn(`To: ${email}, OTP: ${code}`);
    }

    // ✅ Step 6: Respond success
    return NextResponse.json({ message: "OTP sent successfully" });

  } catch (err: any) {
    console.error("❌ /api/send-otp error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
