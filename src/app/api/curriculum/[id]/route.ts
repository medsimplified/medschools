import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// GET - Fetch single curriculum by ID
export async function GET(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const curriculum = await prisma.curriculum.findUnique({
      where: { id: params.id },
    });

    if (!curriculum) {
      return NextResponse.json(
        { error: "Curriculum not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(curriculum, { status: 200 });
  } catch (error) {
    console.error("❌ Error fetching curriculum:", error);
    return NextResponse.json(
      { error: "Failed to fetch curriculum" },
      { status: 500 }
    );
  }
}

// PUT - Update curriculum
export async function PUT(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await req.json();
    const { subject, introVideoUrl, mcqs, chapters } = body;

    const curriculum = await prisma.curriculum.update({
      where: { id: params.id },
      data: {
        subject: subject?.trim(),
        introVideoUrl: introVideoUrl || null,
        mcqs: mcqs || [],
        chapters: chapters,
      },
    });

    console.log("✅ Curriculum updated successfully:", curriculum.id);
    return NextResponse.json(curriculum, { status: 200 });
  } catch (error: any) {
    console.error("❌ Error updating curriculum:", error);
    return NextResponse.json(
      { error: error.message || "Failed to update curriculum" },
      { status: 500 }
    );
  }
}

// DELETE - Delete curriculum
export async function DELETE(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.curriculum.delete({
      where: { id: params.id },
    });

    console.log("✅ Curriculum deleted successfully:", params.id);
    return NextResponse.json(
      { message: "Curriculum deleted successfully" },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("❌ Error deleting curriculum:", error);
    return NextResponse.json(
      { error: error.message || "Failed to delete curriculum" },
      { status: 500 }
    );
  }
}