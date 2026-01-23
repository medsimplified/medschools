import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import nodemailer from "nodemailer";
import crypto from "crypto";

export async function POST(req: Request) {
  try {
    // ✅ Parse and debug request body
    const body = await req.json();
    console.log("✅ Incoming body:", body);

    const { email } = body;

    // 🚫 Validate email
    if (!email) {
      console.error("❌ Email is missing from request");
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    // 🔍 Check if user exists
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      console.warn("❌ User not found for email:", email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // 🔐 Generate secure reset token
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // 15 min expiry

    // 💾 Save token in DB
    await prisma.resetToken.create({
      data: {
        token,
        userId: user.id,
        expiresAt,
      },
    });

    // 📧 Compose and send reset email
    const resetLink = `${process.env.NEXT_PUBLIC_BASE_URL}/reset-password?token=${token}`;

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    await transporter.sendMail({
      to: email,
      subject: "🔐 Reset Your Password",
      html: `
        <p>Hello ${user.fname || ""},</p>
        <p>Click the link below to reset your password. This link is valid for 15 minutes:</p>
        <p><a href="${resetLink}">${resetLink}</a></p>
        <br />
        <p>If you didn’t request a password reset, please ignore this email.</p>
      `,
    });

    return NextResponse.json({ message: "✅ Reset link sent successfully!" });

  } catch (err: any) {
    console.error("❌ Forgot Password Error:", err.message || err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
