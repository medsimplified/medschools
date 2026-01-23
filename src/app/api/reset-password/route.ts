import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma"
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
  try {
    const { token, password } = await req.json();

    if (!token || !password) {
      return NextResponse.json({ error: "Token and password required" }, { status: 400 });
    }

    const resetToken = await prisma.resetToken.findUnique({
      where: { token },
      include: { user: true },
    });

    if (!resetToken || resetToken.expiresAt < new Date()) {
      return NextResponse.json({ error: "Token is invalid or expired" }, { status: 400 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    await prisma.user.update({
      where: { id: resetToken.userId },
      data: { password: hashedPassword },
    });

    await prisma.resetToken.delete({
      where: { id: resetToken.id },
    });

    return NextResponse.json({ message: "Password reset successfully" });
  } catch (err: any) {
    console.error("Reset Password Error:", err.message || err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
