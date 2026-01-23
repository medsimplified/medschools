import { NextResponse } from "next/server";
import prisma from "../../../../lib/prisma";

export async function GET() {
  // If you want to include courses, uncomment the next line:
  // const courses = await prisma.course.count();
  const students = await prisma.user.count();
  const latestVideos = await prisma.latestVideo.count();

  return NextResponse.json([
    // { id: 1, icon: "skillgro-notepad", count: courses, title: "Total Courses" },
    { id: 2, icon: "skillgro-group", count: students, title: "Total Students" },
    { id: 3, icon: "skillgro-tutorial", count: latestVideos, title: "Latest Videos" },
  ]);
}