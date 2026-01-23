import { NextRequest, NextResponse } from "next/server";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const { studentName, text, rating, image, youtubeUrl } = body;

    // Ensure rating is a number
    const testimonial = await prisma.testimonial.update({
      where: { id: params.id },
      data: { studentName, text, rating: Number(rating), image, youtubeUrl },
    });

    return NextResponse.json(testimonial);
  } catch (error) {
    // Add error logging for debugging
    console.error("Error updating testimonial:", error);
    return NextResponse.json({ error: "Failed to update testimonial" }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    await prisma.testimonial.delete({ where: { id: params.id } });
    return NextResponse.json({ message: "Testimonial deleted" });
  } catch (error) {
    // Add error logging for debugging
    console.error("Error deleting testimonial:", error);
    return NextResponse.json({ error: "Failed to delete testimonial" }, { status: 500 });
  }
}
