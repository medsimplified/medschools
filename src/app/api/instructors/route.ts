import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
export async function GET() {
  try {
    const instructors = await prisma.course.findMany({
      select: { instructors: true },
      distinct: ['instructors'],
    });
    
    const uniqueInstructors = instructors.map(i => i.instructors).filter(Boolean);
    
    return NextResponse.json(uniqueInstructors);
  } catch (error) {
    console.error("Error fetching instructors:", error);
    return NextResponse.json([], { status: 500 });
  }
}
