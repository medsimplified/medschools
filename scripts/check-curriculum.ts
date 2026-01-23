import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkCurriculum() {
  try {
    console.log("🔍 Checking curriculum table...\n");

    // Count total curriculums
    const count = await prisma.curriculum.count();
    console.log(`📊 Total curriculums in database: ${count}\n`);

    // Fetch recent curriculums
    const curriculums = await prisma.curriculum.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: {
        course: {
          select: {
            id: true,
            title: true,
            slug: true,
          },
        },
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    console.log("📚 Recent curriculums:");
    curriculums.forEach((curr, idx) => {
      console.log(`\n${idx + 1}. Curriculum ID: ${curr.id}`);
      console.log(`   Subject: ${curr.subject}`);
      console.log(`   Course: ${curr.course.title} (${curr.course.slug})`);
      console.log(`   Instructor: ${curr.instructor.name || curr.instructor.email}`);
      console.log(`   Chapters: ${Array.isArray(curr.chapters) ? (curr.chapters as any).length : 'N/A'}`);
      console.log(`   Created: ${curr.createdAt.toLocaleString()}`);
    });

    // Check courses without curriculums
    const coursesWithoutCurriculum = await prisma.course.findMany({
      where: {
        curriculums: {
          none: {},
        },
      },
      select: {
        id: true,
        title: true,
        slug: true,
      },
    });

    console.log(`\n\n⚠️  Courses without curriculum: ${coursesWithoutCurriculum.length}`);
    if (coursesWithoutCurriculum.length > 0) {
      coursesWithoutCurriculum.forEach((course, idx) => {
        console.log(`${idx + 1}. ${course.title} (${course.slug})`);
      });
    }

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurriculum();
