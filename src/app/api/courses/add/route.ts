import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { generateCourseSlug } from "@/lib/slugify";

export async function POST(req: Request) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);

    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await req.json();

    if (!body.title || !body.category || !body.description || !body.thumb || !body.instructors) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate slug from title and instructor name
    const instructorName = session.user.name || session.user.role || 'instructor';
    let slug = generateCourseSlug(body.title, instructorName);
    
    // Check if slug exists and make it unique if needed
    let counter = 1;
    let uniqueSlug = slug;
    while (await prisma.course.findUnique({ where: { slug: uniqueSlug } })) {
      uniqueSlug = `${slug}-${counter}`;
      counter++;
    }

    const course = await prisma.course.create({
      data: {
        title: body.title,
        slug: uniqueSlug,
        category: body.category,
        description: body.description,
        thumb: body.thumb,
        instructors: body.instructors,
        instructorId: session?.user?.id,
      },
    });

    console.log(`✅ Course created with slug: ${uniqueSlug}`);

    return NextResponse.json(course, { status: 201 });
  } catch (err) {
    console.error("UPLOAD COURSE ERROR:", err);
    return NextResponse.json({
      error: "Upload failed",
      details: err instanceof Error ? err.message : String(err)
    }, { status: 500 });
  }
}