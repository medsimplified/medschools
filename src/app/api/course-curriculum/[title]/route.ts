import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET - Fetch curriculum by course ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ title: string }> }
) {
  try {
    const { title } = await params;

    if (!title) {
      return NextResponse.json({ error: "Course ID or slug is required" }, { status: 400 });
    }

    const identifier = decodeURIComponent(title);

    // First, try to find the course by slug or ID
    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: identifier },
          { id: identifier }
        ]
      }
    });

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    // Now find curriculum by courseId
    let curriculum = await prisma.curriculum.findFirst({
      where: {
        courseId: course.id
      }
    });

    // If not found by courseId, fallback to subject name search for backward compatibility
    if (!curriculum) {
      curriculum = await prisma.curriculum.findFirst({
        where: {
          subject: {
            contains: identifier,
            mode: 'insensitive'
          }
        }
      });
    }

    if (!curriculum) {
      return NextResponse.json(
        { error: "Curriculum not found" },
        { status: 404 }
      );
    }

    // Parse chapters, mcqs, and caseStudyMcqs with type safety
    const parsedCurriculum = {
      ...curriculum,
      chapters: typeof curriculum.chapters === 'string' 
        ? JSON.parse(curriculum.chapters) 
        : curriculum.chapters,
      mcqs: (curriculum as any).mcqs
        ? typeof (curriculum as any).mcqs === 'string' 
          ? JSON.parse((curriculum as any).mcqs) 
          : (curriculum as any).mcqs
        : [],
      caseStudyMcqs: (curriculum as any).caseStudyMcqs
        ? typeof (curriculum as any).caseStudyMcqs === 'string'
          ? JSON.parse((curriculum as any).caseStudyMcqs)
          : (curriculum as any).caseStudyMcqs
        : [],
      introVideoUrl: (curriculum as any).introVideoUrl || null,
    };

    console.log("📊 Fetched curriculum:", {
      courseId: curriculum.courseId,
      courseSlug: course.slug,
      instructorId: curriculum.instructorId,
      subject: parsedCurriculum.subject,
      introVideoUrl: parsedCurriculum.introVideoUrl || "No intro video",
      mcqsCount: parsedCurriculum.mcqs ? parsedCurriculum.mcqs.length : 0,
      caseStudyMcqsCount: parsedCurriculum.caseStudyMcqs ? parsedCurriculum.caseStudyMcqs.length : 0,
      chaptersCount: parsedCurriculum.chapters ? parsedCurriculum.chapters.length : 0
    });

    return NextResponse.json(parsedCurriculum);
  } catch (error) {
    console.error("Error fetching curriculum by course:", error);
    return NextResponse.json(
      { error: "Failed to fetch curriculum" },
      { status: 500 }
    );
  }
}
