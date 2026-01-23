import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// PUT - Update curriculum
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { subject, chapters } = body;

    if (!subject || !chapters) {
      return NextResponse.json(
        { error: "Subject and chapters are required" },
        { status: 400 }
      );
    }

    // Ensure MCQs have explanation field
    const chaptersWithExplanation = chapters.map((chapter: any) => ({
      ...chapter,
      topics: chapter.topics.map((topic: any) => ({
        ...topic,
        mcqs: (topic.mcqs || []).map((mcq: any) => ({
          ...mcq,
          explanation: mcq.explanation ?? "",
        })),
        subtopics: (topic.subtopics || []).map((sub: any) => ({
          ...sub,
          mcqs: (sub.mcqs || []).map((mcq: any) => ({
            ...mcq,
            explanation: mcq.explanation ?? "",
          })),
        })),
      })),
    }));

    const curriculum = await prisma.curriculum.update({
      where: { id },
      data: {
        subject,
        chapters: JSON.stringify(chaptersWithExplanation),
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(curriculum);
  } catch (error) {
    console.error("Error updating curriculum:", error);
    return NextResponse.json(
      { error: "Failed to update curriculum" },
      { status: 500 }
    );
  }
}

// Example request body
// {
//   "subject": "New Subject",
//   "chapters": [ /* ...updated chapters array... */ ]
// }