import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
export async function GET() {
  try {
    const users = await prisma.user.findMany({
      where: {
        role: "student",
      },
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        phone: true,
        university: true,
      },
    });
    return NextResponse.json(users);
  } catch (err) {
    return NextResponse.json({ error: "Failed to fetch users" }, { status: 500 });
  }
}
