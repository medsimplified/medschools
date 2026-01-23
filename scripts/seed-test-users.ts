import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function seedTestUsers() {
  try {
    console.log("\n🌱 Seeding test user accounts...\n");

    const hashedPassword = await bcrypt.hash("TestPass123!", 10);

    // Instructor account (acts as admin)
    const instructor = await prisma.user.upsert({
      where: { email: "instructor@example.com" },
      update: {},
      create: {
        email: "instructor@example.com",
        name: "Test Instructor",
        password: hashedPassword,
        role: "instructor",
      },
    });
    console.log("✅ Instructor created:", instructor.email);

    // Student account
    const student = await prisma.user.upsert({
      where: { email: "student@example.com" },
      update: {},
      create: {
        email: "student@example.com",
        name: "Test Student",
        password: hashedPassword,
        role: "student",
      },
    });
    console.log("✅ Student created:", student.email);

    // Course uploader
    const uploader = await prisma.user.upsert({
      where: { email: "uploader@example.com" },
      update: {},
      create: {
        email: "uploader@example.com",
        name: "Course Uploader",
        password: hashedPassword,
        role: "course_uploader",
      },
    });
    console.log("✅ Course Uploader created:", uploader.email);

    // Premium Student
    const premiumStudent = await prisma.user.upsert({
      where: { email: "student-premium@example.com" },
      update: {},
      create: {
        email: "student-premium@example.com",
        name: "Premium Student",
        password: hashedPassword,
        role: "student",
      },
    });
    console.log("✅ Premium Student created:", premiumStudent.email);

    console.log("\n✨ Test users seeded successfully!");
    console.log("\n📝 Login credentials:");
    console.log("   All accounts use password: TestPass123!");
    console.log("\n   Instructor:      instructor@example.com");
    console.log("   Student:         student@example.com");
    console.log("   Course Uploader: uploader@example.com");
    console.log("   Premium Student: student-premium@example.com");
  } catch (error) {
    console.error("❌ Error seeding users:", error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

seedTestUsers();
