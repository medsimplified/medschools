import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ subject: string }> }
) {
  try {
    const { subject } = await params;

    if (!subject) {
      return NextResponse.json({ error: "No subject provided" }, { status: 400 });
    }

    const curriculum = await prisma.curriculum.findFirst({
      where: { subject },
    });
    
    if (!curriculum) {
      return NextResponse.json({ error: "Curriculum not found" }, { status: 404 });
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

    console.log("📊 Fetched curriculum by subject:", {
      subject: parsedCurriculum.subject,
      introVideoUrl: parsedCurriculum.introVideoUrl || "No intro video",
      mcqsCount: parsedCurriculum.mcqs ? parsedCurriculum.mcqs.length : 0,
      caseStudyMcqsCount: parsedCurriculum.caseStudyMcqs ? parsedCurriculum.caseStudyMcqs.length : 0,
      chaptersCount: parsedCurriculum.chapters ? parsedCurriculum.chapters.length : 0
    });
    
    return NextResponse.json(parsedCurriculum);
  } catch (err) {
    console.error("Error fetching curriculum:", err);
    return NextResponse.json({ error: "Failed to fetch curriculum" }, { status: 500 });
  }
}