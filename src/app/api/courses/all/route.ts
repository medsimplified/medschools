import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const courses = await prisma.course.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        instructor: {
          select: {
            name: true,
            email: true,
          }
        }
      }
    });
    
    console.log(`📚 Fetched ${courses.length} courses`);
    
    return NextResponse.json(courses, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (err) {
    console.error("FETCH ALL COURSES ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}