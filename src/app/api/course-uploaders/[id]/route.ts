import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import bcrypt from "bcryptjs";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library";
import prisma from "@/lib/prisma";
import { authOptions } from "@/lib/auth";

const ALLOWED_ROLES = new Set(["instructor"]);

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!role || !ALLOWED_ROLES.has(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const id = params.id;
    const body = await request.json();
    const {
      firstName,
      lastName,
      email,
      password,
      phone,
      organization,
    } = body ?? {};

    if (!firstName || !email) {
      return NextResponse.json({ error: "First name and email are required" }, { status: 400 });
    }

    const existing = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
      },
    });

    if (!existing || existing.role !== "course_uploader") {
      return NextResponse.json({ error: "Course uploader not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      fname: String(firstName).trim(),
      lname: lastName ? String(lastName).trim() : null,
      email: String(email).trim().toLowerCase(),
      phone: phone ? String(phone).trim() : null,
      university: organization ? String(organization).trim() : null,
    };

    if (password && String(password).trim().length > 0) {
      updates.password = await bcrypt.hash(String(password), 10);
    }

    const updated = await prisma.user.update({
      where: { id },
      data: updates,
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        phone: true,
        university: true,
        role: true,
      },
    });

    return NextResponse.json({ success: true, user: updated });
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2002") {
      return NextResponse.json({ error: "Email already in use" }, { status: 409 });
    }

    console.error("Failed to update course uploader", error);
    return NextResponse.json({ error: "Failed to update course uploader" }, { status: 500 });
  }
}

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    const role = (session?.user as { role?: string } | undefined)?.role;
    if (!role || !ALLOWED_ROLES.has(role)) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    const id = params.id;

    const existing = await prisma.user.findUnique({
      where: { id },
      select: {
        id: true,
        role: true,
      },
    });

    if (!existing || existing.role !== "course_uploader") {
      return NextResponse.json({ error: "Course uploader not found" }, { status: 404 });
    }

    await prisma.user.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    if (error instanceof PrismaClientKnownRequestError && error.code === "P2003") {
      return NextResponse.json({ error: "Cannot delete course uploader because related records exist" }, { status: 409 });
    }

    console.error("Failed to delete course uploader", error);
    return NextResponse.json({ error: "Failed to delete course uploader" }, { status: 500 });
  }
}
