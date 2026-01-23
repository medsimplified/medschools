import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkCurriculumIssue() {
  try {
    console.log("🔍 DETAILED CURRICULUM ANALYSIS\n");
    console.log("=" .repeat(80));

    // Get all courses
    const courses = await prisma.course.findMany({
      include: {
        curriculums: true,
        instructor: {
          select: {
            id: true,
            name: true,
            email: true,
            role: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    });

    console.log(`\n📚 TOTAL COURSES: ${courses.length}\n`);

    courses.forEach((course, idx) => {
      console.log(`\n${idx + 1}. COURSE: ${course.title}`);
      console.log(`   ├─ ID: ${course.id}`);
      console.log(`   ├─ Slug: ${course.slug}`);
      console.log(`   ├─ Instructor: ${course.instructor.name || course.instructor.email} (${course.instructor.role})`);
      console.log(`   ├─ Instructor ID: ${course.instructorId}`);
      console.log(`   └─ Curriculums: ${course.curriculums.length}`);
      
      if (course.curriculums.length > 0) {
        course.curriculums.forEach((curr, cIdx) => {
          console.log(`      ${cIdx + 1}. Subject: ${curr.subject}`);
          console.log(`         ├─ Curriculum ID: ${curr.id}`);
          console.log(`         ├─ Course ID in Curriculum: ${curr.courseId}`);
          console.log(`         ├─ Instructor ID in Curriculum: ${curr.instructorId}`);
          console.log(`         └─ Match: ${curr.courseId === course.id ? '✅' : '❌ MISMATCH!'}`);
        });
      }
    });

    // Check for orphaned curriculums
    console.log("\n" + "=".repeat(80));
    console.log("\n🔎 CHECKING FOR MISMATCHES...\n");

    const allCurriculums = await prisma.curriculum.findMany({
      include: {
        course: true,
        instructor: true,
      },
    });

    const mismatches = allCurriculums.filter(curr => {
      const course = courses.find(c => c.id === curr.courseId);
      return !course;
    });

    if (mismatches.length > 0) {
      console.log(`❌ Found ${mismatches.length} curriculums with missing courses:`);
      mismatches.forEach(curr => {
        console.log(`   - ${curr.subject} (currID: ${curr.id}, courseID: ${curr.courseId})`);
      });
    } else {
      console.log("✅ All curriculums are properly linked to existing courses");
    }

    // Show upload flow recommendation
    console.log("\n" + "=".repeat(80));
    console.log("\n💡 RECOMMENDATION:\n");
    console.log("When uploading a curriculum:");
    console.log("1. First select the course from dropdown");
    console.log("2. The courseId should be: one of the course IDs above");
    console.log("3. The instructorId should match the logged-in user");
    console.log("\nCurrent Course IDs:");
    courses.forEach(c => {
      console.log(`   - ${c.title} → ${c.id}`);
    });

  } catch (error) {
    console.error("❌ Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkCurriculumIssue();
