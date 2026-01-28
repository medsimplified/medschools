
import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const instructorId = searchParams.get("instructorId");

    // Build where clause based on role and params
    let whereClause: any = {};

    if (instructorId) {
      // If instructorId is provided in query, use it (for backward compatibility)
      whereClause.instructorId = instructorId;
    } else {
      // Otherwise, filter by the logged-in user's ID
      // Both instructor and course_uploader roles can only see their own courses
      whereClause.instructorId = session.user.id;
    }

    const courses = await prisma.course.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    console.log(`📚 Fetched ${courses.length} courses for user ${session.user.id} (${session.user.role})`);
    
    return NextResponse.json(courses, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (err) {
    console.error("FETCH COURSES ERROR:", err);
    return NextResponse.json({ error: "Failed to fetch courses" }, { status: 500 });
  }
}