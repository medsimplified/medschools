import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";
export async function GET() {
  try {
    const students = await prisma.user.findMany({
      where: {
        role: "student",
      },
      orderBy: { createdAt: "desc" },
      select: {
        id: true,
        fname: true,
        lname: true,
        email: true,
        phone: true,
        university: true,
        role: true,
        createdAt: true,
      },
    });

    return NextResponse.json(students);
  } catch (err) {
    console.error("Error fetching students:", err);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
