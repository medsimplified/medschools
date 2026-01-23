import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function DELETE() {
  try {
    const result = await prisma.curriculum.deleteMany({});
    console.log(`✅ Deleted ${result.count} curriculum records`);
    return NextResponse.json({ 
      message: `Successfully deleted ${result.count} curriculum records`,
      count: result.count 
    });
  } catch (error) {
    console.error("❌ Error deleting all curriculums:", error);
    return NextResponse.json(
      { error: "Failed to delete curriculums" },
      { status: 500 }
    );
  }
}
