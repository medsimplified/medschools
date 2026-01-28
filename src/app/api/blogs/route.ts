import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: Request) {
  const data = await req.json();
  try {
    const blog = await prisma.blog.create({
      data: {
        title: data.title,
        content: data.content,
        author: data.author,
        tags: data.tags,
        image: data.image,
      },
    });
    return NextResponse.json(blog, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: "Failed to upload blog." }, { status: 500 });
  }
}

export async function GET() {
  try {
    const blogs = await prisma.blog.findMany({
      orderBy: { date: "desc" }
    });
    return NextResponse.json(blogs, {
      headers: {
        'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    });
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch blogs." }, { status: 500 });
  }
}