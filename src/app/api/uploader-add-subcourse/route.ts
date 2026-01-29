import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateCourseSlug } from "@/lib/slugify";

export async function POST(req: Request) {
  try {
    const data = await req.json();
    // mainCourseId is required to link sub-course
    if (!data.mainCourseId) {
      return NextResponse.json({ success: false, error: "mainCourseId is required" }, { status: 400 });
    }
    if (!data.instructorId) {
      return NextResponse.json({ success: false, error: "instructorId is required" }, { status: 400 });
    }

    const baseSlug = generateCourseSlug(data.title || "course", data.instructors || "instructor");
    let slug = baseSlug;
    let counter = 1;
    while (await prisma.course.findUnique({ where: { slug } })) {
      slug = `${baseSlug}-${counter++}`;
    }

    const subCourse = await prisma.course.create({
      data: {
        title: data.title,
        category: data.category,
        description: data.description,
        thumb: data.thumb,
        instructors: data.instructors,
        slug,
        instructor: { connect: { id: data.instructorId } },
        // Add a relation to main course if your schema supports it
        // mainCourseId: data.mainCourseId,
      },
    });
    return NextResponse.json({ success: true, subCourse });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
