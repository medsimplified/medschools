import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log("\n🔍 Checking for test accounts in database...\n");

    const testEmails = [
      "admin@example.com",
      "instructor@example.com",
      "instructor2@example.com",
      "student@example.com",
      "student-premium@example.com",
    ];

    for (const email of testEmails) {
      const user = await prisma.user.findUnique({
        where: { email },
        select: {
          id: true,
          email: true,
          name: true,
          role: true,
        },
      });

      if (user) {
        console.log(`✅ Found: ${email}`);
        console.log(`   Role: ${user.role}, Name: ${user.name || "N/A"}`);
      } else {
        console.log(`❌ Missing: ${email}`);
      }
    }

    // Get total user count
    const totalUsers = await prisma.user.count();
    console.log(`\n📊 Total users in database: ${totalUsers}`);

    // Show all users with their roles
    const allUsers = await prisma.user.findMany({
      select: {
        email: true,
        role: true,
        name: true,
      },
      take: 10,
    });

    console.log("\n👥 All users (first 10):");
    allUsers.forEach((user) => {
      console.log(`   ${user.email} - ${user.role} - ${user.name || "N/A"}`);
    });
  } catch (error) {
    console.error("Error:", error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
