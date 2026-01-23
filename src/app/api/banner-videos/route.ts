import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

// GET: Fetch all banners from the Banner table
export async function GET() {
  try {
    const banners = await prisma.banner.findMany({
      orderBy: { createdAt: "desc" },
    });
    return NextResponse.json(banners);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch banners" },
      { status: 500 }
    );
  }
}

// POST: Create a new banner
export async function POST(req: NextRequest) {
  try {
    console.log("Creating banner video");
    const { heading, subheading, buttonText, buttonLink, youtubeUrl } =
      await req.json();

    if (!heading || !subheading || !buttonText || !youtubeUrl) {
      return NextResponse.json(
        { error: "Required fields are missing" },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.create({
      data: {
        heading,
        subheading,
        buttonText,
        buttonLink: buttonLink || null,
        youtubeUrl,
      },
    });

    console.log("Banner created successfully:", banner.id);
    return NextResponse.json(banner, { status: 201 });
  } catch (error) {
    console.error("Error creating banner video:", error);
    return NextResponse.json(
      { error: "Failed to create banner" },
      { status: 500 }
    );
  }
}

// PUT: Update a banner
export async function PUT(req: NextRequest) {
  try {
    console.log("Updating banner video");
    const { id, heading, subheading, buttonText, buttonLink, youtubeUrl } =
      await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    const banner = await prisma.banner.update({
      where: { id: Number(id) },
      data: {
        heading,
        subheading,
        buttonText,
        buttonLink: buttonLink || null,
        youtubeUrl,
      },
    });

    console.log("Banner updated successfully:", banner.id);
    return NextResponse.json(banner);
  } catch (error) {
    console.error("Error updating banner video:", error);
    return NextResponse.json(
      { error: "Failed to update banner" },
      { status: 500 }
    );
  }
}

// DELETE: Delete a banner
export async function DELETE(req: NextRequest) {
  try {
    console.log("Deleting banner video");
    const { id } = await req.json();

    if (!id) {
      return NextResponse.json(
        { error: "ID is required" },
        { status: 400 }
      );
    }

    await prisma.banner.delete({
      where: { id: Number(id) },
    });

    console.log("Banner deleted successfully:", id);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting banner video:", error);
    return NextResponse.json(
      { error: "Failed to delete banner" },
      { status: 500 }
    );
  }
}
