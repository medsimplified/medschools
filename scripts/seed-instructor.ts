import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding instructor data...");

  // Hash password for instructor
  const hashedPassword = await bcrypt.hash("instructor123", 10);

  // Create instructor user
  const instructor = await prisma.user.upsert({
    where: { email: "instructor@medschool.com" },
    update: {},
    create: {
      email: "instructor@medschool.com",
      name: "Dr. Bhanu Prakash",
      fname: "Bhanu",
      lname: "Prakash",
      password: hashedPassword,
      role: "instructor",
      phone: "+91-9876543210",
      country: "India",
      state: "Karnataka",
      city: "Bangalore",
      university: "Medical School University",
      isVerified: true,
      isNewUser: false,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created instructor:", instructor.email);

  // Create a few more instructors
  const instructor2 = await prisma.user.upsert({
    where: { email: "sarah.johnson@medschool.com" },
    update: {},
    create: {
      email: "sarah.johnson@medschool.com",
      name: "Dr. Sarah Johnson",
      fname: "Sarah",
      lname: "Johnson",
      password: hashedPassword,
      role: "instructor",
      phone: "+1-555-0123",
      country: "USA",
      state: "California",
      city: "Los Angeles",
      university: "UCLA Medical School",
      isVerified: true,
      isNewUser: false,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created instructor:", instructor2.email);

  const instructor3 = await prisma.user.upsert({
    where: { email: "raj.patel@medschool.com" },
    update: {},
    create: {
      email: "raj.patel@medschool.com",
      name: "Dr. Raj Patel",
      fname: "Raj",
      lname: "Patel",
      password: hashedPassword,
      role: "instructor",
      phone: "+91-9876543211",
      country: "India",
      state: "Maharashtra",
      city: "Mumbai",
      university: "All India Institute of Medical Sciences",
      isVerified: true,
      isNewUser: false,
      emailVerified: new Date(),
    },
  });

  console.log("✅ Created instructor:", instructor3.email);

  console.log("\n📊 Summary:");
  console.log("- 3 instructors created");
  console.log("- Default password: instructor123");
  console.log("\nInstructor Emails:");
  console.log("  1. instructor@medschool.com");
  console.log("  2. sarah.johnson@medschool.com");
  console.log("  3. raj.patel@medschool.com");
}

main()
  .catch((e) => {
    console.error("❌ Error seeding data:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
