import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import { Role } from "@prisma/client";

export async function POST(req: Request) {
  try {
    const { email, otp, role } = await req.json();

    if (!email || !otp) {
      return NextResponse.json({ error: "Email and OTP are required" }, { status: 400 });
    }

    // Acceptable roles from schema
    const allowedRoles = ["student", "instructor", "course_uploader"];
    let initialUserRole: Role = Role.student;
    if (role && allowedRoles.includes(role)) {
      initialUserRole = role as Role;
    }

    const record = await prisma.oTP.findFirst({
      where: {
        email,
        code: otp,
        expiresAt: { gt: new Date() },
      },
      orderBy: { createdAt: "desc" },
    });

    if (!record) {
      return NextResponse.json({ error: "Invalid or expired OTP" }, { status: 400 });
    }

    // Optionally, delete OTP after successful verification
    await prisma.oTP.delete({ where: { id: record.id } });

    // Find user and return their role for redirect
    const user = await prisma.user.findUnique({ where: { email } });
    const finalUserRole = user?.role || initialUserRole;

    return NextResponse.json({ message: "OTP verified successfully", role: finalUserRole });
  } catch (error: any) {
    console.error("OTP Verify Error:", error.message || error);
    return NextResponse.json({ error: "Failed to verify OTP" }, { status: 500 });
  }
}
