import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    // For now, treat all courses as main courses (or filter by a flag if you add one)
    const courses = await prisma.course.findMany({
      select: { id: true, title: true },
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
