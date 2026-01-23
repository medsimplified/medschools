import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const blog = await prisma.blog.findUnique({
      where: { id: Number(id) },
    });
    if (!blog) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }
    return NextResponse.json(blog);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blog." }, { status: 500 });
  }
}