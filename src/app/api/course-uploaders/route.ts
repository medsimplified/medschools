import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

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
