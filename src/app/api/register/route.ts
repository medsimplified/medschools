import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "../../../../lib/prisma"; // adjust path if needed

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      role = 'student',
      fullName,
      email,
      password,
      countryCode,
      phone,
      country,
      state,
      university,
      expertise,
      organization,
      selectedPlan,
    } = body;

    // 1. Validate
    if (!fullName || !email || !phone || !country || !state || !password) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }
    if (role === 'student' && !university) {
      return NextResponse.json({ error: "University is required for students" }, { status: 400 });
    }
    if (role === 'instructor' && (!university || !expertise)) {
      return NextResponse.json({ error: "University and expertise are required for instructors" }, { status: 400 });
    }
    if (role === 'course_uploader' && (!organization || !organization.trim())) {
      return NextResponse.json({ error: "Organization is required for course uploaders" }, { status: 400 });
    }

    // 2. Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "User already exists" }, { status: 400 });
    }

    // 3. Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // 4. Save user in DB with all fields
    const user = await prisma.user.create({
      data: {
        role,
        name: fullName,
        email,
        password: hashedPassword,
        phone: `${countryCode}${phone}`,
        country,
        state,
        university: university || null,
        isVerified: true, // Set after OTP verification
        subscriptionPlan: selectedPlan || 'none',
        subscriptionStatus: 'PENDING',
        paymentStatus: 'PENDING',
        hasActiveSubscription: false
      },
    });

    return NextResponse.json({ success: true, message: "User registered successfully", user });
  } catch (error: any) {
    console.error("Registration Error:", error.message || error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
