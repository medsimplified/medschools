// filepath: src/app/api/admin/password/route.ts
import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../../lib/prisma";

export async function PUT(req: Request) {
  try {
    // Parse request body
    const body = await req.json();
    const { currentPassword, newPassword } = body;

    // Validate input
    if (!currentPassword || !newPassword) {
      return NextResponse.json(
        { error: "Current password and new password are required" },
        { status: 400 }
      );
    }

    // Validate password length
    if (newPassword.length < 6) {
      return NextResponse.json(
        { error: "New password must be at least 6 characters long" },
        { status: 400 }
      );
    }

    // Find admin
    const admin = await prisma.admin.findFirst();
    if (!admin) {
      return NextResponse.json(
        { error: "Admin not found" },
        { status: 404 }
      );
    }

    // Check if password is already hashed or plain text
    let isValidPassword = false;
    try {
      if (admin.password && admin.password.startsWith('$2')) {
        // Password is already hashed
        isValidPassword = await bcrypt.compare(currentPassword, admin.password);
      } else {
        // Password is plain text (for backward compatibility)
        isValidPassword = currentPassword === admin.password;
      }
    } catch (error) {
      console.error("Password comparison error:", error);
      return NextResponse.json(
        { error: "Password verification failed" },
        { status: 500 }
      );
    }

    if (!isValidPassword) {
      return NextResponse.json(
        { error: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12);

    // Update password
    await prisma.admin.update({
      where: { id: admin.id },
      data: { 
        password: hashedNewPassword
      },
    });

    return NextResponse.json({ 
      message: "Password updated successfully" 
    });

  } catch (error) {
    console.error("Admin password update error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}