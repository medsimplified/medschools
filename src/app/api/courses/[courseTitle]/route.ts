import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { generateCourseSlug } from "@/lib/slugify";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";

// GET - Fetch course by ID or slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ courseTitle: string }> }
) {
  try {
    const { courseTitle } = await params;

    if (!courseTitle) {
      return NextResponse.json(
        { error: "Course ID or slug is required" },
        { status: 400 }
      );
    }

    const decodedTitle = decodeURIComponent(courseTitle);

    // Try to find course by slug or ID
    let course = await prisma.course.findFirst({
      where: {
        OR: [
          { slug: decodedTitle },
          { id: decodedTitle },
          { 
            title: {
              contains: decodedTitle,
              mode: "insensitive",
            }
          }
        ]
      },
    });

    // If no course found, try to find curriculum with matching subject
    if (!course) {
      const curriculum = await prisma.curriculum.findFirst({
        where: {
          subject: {
            contains: decodedTitle,
            mode: "insensitive",
          },
        },
      });

      if (curriculum) {
        // Return a course-like object from curriculum data
        return NextResponse.json({
          id: curriculum.id,
          title: curriculum.subject,
          slug: curriculum.subject.toLowerCase().replace(/\s+/g, '-'),
          category: "Medical Education",
          description: `Complete course on ${curriculum.subject}`,
          thumb: "/assets/img/courses/course_thumb01.jpg",
          instructors: "Dr. Bhanu Prakash",
          price: 29.99,
          videoUrl: (curriculum as any).introVideoUrl || null,
          createdAt: curriculum.createdAt,
          updatedAt: curriculum.updatedAt,
          instructorId: curriculum.instructorId,
        });
      }
    }

    if (!course) {
      return NextResponse.json(
        { error: "Course not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(course);
  } catch (error) {
    console.error("Error fetching course:", error);
    return NextResponse.json(
      { error: "Failed to fetch course" },
      { status: 500 }
    );
  }
}

// PUT - Update course
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ courseTitle: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseTitle } = await params;
    const body = await request.json();

    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { id: courseTitle },
          { slug: courseTitle }
        ]
      }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if user owns this course
    if (course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // If title is being updated, regenerate slug
    let updateData: any = { ...body };
    if (body.title && body.title !== course.title) {
      const instructorName = session.user.name || session.user.role || 'instructor';
      let newSlug = generateCourseSlug(body.title, instructorName);
      
      // Check if slug exists and make it unique if needed
      let counter = 1;
      let uniqueSlug = newSlug;
      while (await prisma.course.findFirst({ 
        where: { 
          slug: uniqueSlug,
          id: { not: course.id }
        } 
      })) {
        uniqueSlug = `${newSlug}-${counter}`;
        counter++;
      }
      updateData.slug = uniqueSlug;
    }

    const updatedCourse = await prisma.course.update({
      where: { id: course.id },
      data: updateData,
    });

    console.log(`✅ Course updated: ${updatedCourse.slug}`);

    return NextResponse.json(updatedCourse);
  } catch (error) {
    console.error("Error updating course:", error);
    return NextResponse.json(
      { error: "Failed to update course" },
      { status: 500 }
    );
  }
}

// DELETE - Delete course
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ courseTitle: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { courseTitle } = await params;

    const course = await prisma.course.findFirst({
      where: {
        OR: [
          { id: courseTitle },
          { slug: courseTitle }
        ]
      }
    });

    if (!course) {
      return NextResponse.json({ error: "Course not found" }, { status: 404 });
    }

    // Check if user owns this course
    if (course.instructorId !== session.user.id) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    await prisma.course.delete({
      where: { id: course.id },
    });

    console.log(`🗑️ Course deleted: ${course.slug}`);

    return NextResponse.json({ message: "Course deleted successfully" });
  } catch (error) {
    console.error("Error deleting course:", error);
    return NextResponse.json(
      { error: "Failed to delete course" },
      { status: 500 }
    );
  }
}
