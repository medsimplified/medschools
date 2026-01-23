import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateCourseSlug } from "@/lib/slugify";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // You may want to add authentication/authorization here
    if (!data.instructorId) {
      return NextResponse.json({ success: false, error: "instructorId is required" }, { status: 400 });
    }

    const baseSlug = generateCourseSlug(data.title || "course", data.instructors || "instructor");
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const course = await prisma.course.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        thumb: data.thumb,
        instructors: data.instructors,
        price: data.price ? parseFloat(data.price) : undefined,
        videoUrl: data.videoUrl,
        slug,
        instructor: { connect: { id: data.instructorId } },
      },
    });
    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
