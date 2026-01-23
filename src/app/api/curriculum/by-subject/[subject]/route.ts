import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  request: NextRequest,
  { params }: { params: { subject: string } }
) {
  try {
    const { subject } = params;
    const decodedSubject = decodeURIComponent(subject);

    const curriculum = await prisma.curriculum.findFirst({
      where: {
        subject: {
          contains: decodedSubject,
          mode: 'insensitive'
        }
      }
    });

    if (!curriculum) {
      return NextResponse.json(
        { error: "Curriculum not found" },
        { status: 404 }
      );
    }

    const parsedCurriculum = {
      ...curriculum,
      chapters: typeof curriculum.chapters === 'string' 
        ? JSON.parse(curriculum.chapters) 
        : curriculum.chapters
    };

    return NextResponse.json(parsedCurriculum);
  } catch (error) {
    console.error("Error fetching curriculum by subject:", error);
    return NextResponse.json(
      { error: "Failed to fetch curriculum" },
      { status: 500 }
    );
  }
}
