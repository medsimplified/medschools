// ...existing code...
import { NextRequest, NextResponse } from "next/server";
import { PrismaClient, Prisma } from "@prisma/client";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

const prisma = new PrismaClient();

// GET - Fetch curriculums based on user role and filters
export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId");
    const instructorId = searchParams.get("instructorId");
    
    const where: any = {};
    
    if (courseId) {
      // Filter by specific course
      where.courseId = courseId;
    }
    
    if (instructorId) {
      // Filter by specific instructor (for backward compatibility)
      where.instructorId = instructorId;
    } else {
      // Filter by logged-in user's ID
      // Both instructor and course_uploader only see their own curricula
      where.instructorId = session.user.id;
    }
    
    const curriculums = await prisma.curriculum.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    console.log(`📖 Fetched ${curriculums.length} curriculums for user ${session.user.id} (${session.user.role})`);
    
    return NextResponse.json(curriculums, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching curriculums:", error);
    return NextResponse.json(
      { error: "Failed to fetch curriculums" },
      { status: 500 }
    );
  }
}

// POST - Create new curriculum (requires courseId and instructorId)
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    console.log("📥 Received curriculum data:", JSON.stringify(body, null, 2));

    const { subject, introVideoUrl, mcqs, chapters, courseId, instructorId } = body;

    // Validation
    if (!subject || !subject.trim()) {
      return NextResponse.json(
        { error: "Subject is required" },
        { status: 400 }
      );
    }
    if (!chapters || !Array.isArray(chapters) || chapters.length === 0) {
      return NextResponse.json(
        { error: "At least one chapter is required" },
        { status: 400 }
      );
    }
    if (!courseId || !instructorId) {
      return NextResponse.json(
        { error: "courseId and instructorId are required" },
        { status: 400 }
      );
    }

    // Create curriculum with JSON fields
    const curriculum = await prisma.curriculum.create({
      data: {
        subject: subject.trim(),
        introVideoUrl: introVideoUrl || null,
        mcqs: (mcqs || []) as Prisma.InputJsonValue,
        chapters: chapters as Prisma.InputJsonValue,
        courseId,
        instructorId,
      },
    });

    console.log("✅ Curriculum created successfully:", curriculum.id);
    return NextResponse.json(curriculum, { status: 201 });
  } catch (error: any) {
    console.error("❌ Error creating curriculum:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create curriculum" },
      { status: 500 }
    );
  }
}