import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prisma";
import { authOptions } from "@/lib/auth";

const ALLOWED_CREATOR_ROLES = new Set(["instructor"]);

export async function GET() {
  try {
    const uploaders = await prisma.user.findMany({
      where: {
        OR: [
          { role: "course_uploader" },
          { role: "instructor" }
        ]
      },
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        phone: true,
        university: true,
        role: true,
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    return NextResponse.json(uploaders);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch course uploaders" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const requester = session?.user as { role?: string } | undefined;

    if (!requester?.role || !ALLOWED_CREATOR_ROLES.has(requester.role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const body = await req.json();
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      organization,
      university,
    } = body ?? {};

    if (!firstName || !email || !password) {
      return NextResponse.json({ error: "First name, email, and password are required" }, { status: 400 });
    }

    const trimmedEmail = String(email).trim().toLowerCase();

    const existingUser = await prisma.user.findUnique({ where: { email: trimmedEmail } });
    if (existingUser) {
      return NextResponse.json({ error: "A user with this email already exists" }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(String(password), 10);

    const created = await prisma.user.create({
      data: {
        role: "course_uploader",
        fname: String(firstName).trim(),
        lname: lastName ? String(lastName).trim() : null,
        name: [firstName, lastName].filter(Boolean).join(" "),
        email: trimmedEmail,
        password: hashedPassword,
        phone: phone ? String(phone).trim() : null,
        university: organization ? String(organization).trim() : university ? String(university).trim() : null,
        isVerified: true,
        isNewUser: false,
        hasActiveSubscription: false,
        subscriptionPlan: "none",
        subscriptionStatus: "PENDING",
        paymentStatus: "PENDING",
      },
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        phone: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, user: created });
  } catch (error) {
    console.error("Failed to create course uploader", error);
    return NextResponse.json({ error: "Failed to create course uploader" }, { status: 500 });
  }
}
