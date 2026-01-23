import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET() {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
      select: {
        id: true,
        hasActiveSubscription: true,
        subscriptionStatus: true,
      }
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Check if user has active subscription
    if (!user.hasActiveSubscription) {
      return NextResponse.json({ content: [], message: "No active subscription" });
    }

    // Fetch all subjects with chapters, topics, and subtopics
    const subjects = await prisma.subject.findMany({
      include: {
        chapters: {
          include: {
            topics: {
              select: {
                id: true,
                title: true,
                youtubeUrl: true,
                pdfUrl: true,
                mcqUrl: true,
                caseStudyUrl: true,
                pdfAccess: true,
              }
            }
          }
        }
      }
    });

    return NextResponse.json({ content: subjects });
  } catch (err) {
    console.error("Failed to fetch unlocked content:", err);
    return NextResponse.json({ error: "Failed to fetch content" }, { status: 500 });
  }
}
