
import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export async function POST(req: Request) {
  try {
    const { email, password, role } = await req.json();

    if (!email || !password || !role) {
      return NextResponse.json({ error: "Email, password, and role are required" }, { status: 400 });
    }

    // Find user by email only
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 401 });
    }

    // Check password
    const valid = user.password && await bcrypt.compare(password, user.password);
    if (!valid) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    // Check role
    if (user.role !== role) {
      return NextResponse.json({ error: `Role mismatch. You are registered as '${user.role}'.` }, { status: 401 });
    }

    // Create JWT token
    const token = jwt.sign(
      { id: user.id, role: user.role, email: user.email },
      process.env.JWT_SECRET || "secret-key",
      { expiresIn: "7d" }
    );

    // Return token and user info
    return NextResponse.json({
      message: "Login successful",
      token,
      user: { id: user.id, role: user.role }
    });
  } catch (error: any) {
    console.error("Login Error:", error.message || error);
    return NextResponse.json({ error: "Login failed" }, { status: 500 });
  }
}
