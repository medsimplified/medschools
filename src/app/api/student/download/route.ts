import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const searchParams = req.nextUrl.searchParams;
    const topicId = searchParams.get("topicId");
    const type = searchParams.get("type"); // 'pdf', 'mcq', or 'caseStudy'

    if (!topicId || !type) {
      return NextResponse.json({ error: "Missing parameters" }, { status: 400 });
    }

    // Get user and verify subscription
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
      return NextResponse.json(
        { error: "Active subscription required to download content" },
        { status: 403 }
      );
    }

    // Get the topic with the requested file
    const topic = await prisma.topic.findUnique({
      where: { id: topicId },
      select: {
        id: true,
        title: true,
        pdfUrl: true,
        mcqUrl: true,
        caseStudyUrl: true,
        pdfAccess: true,
      }
    });

    if (!topic) {
      return NextResponse.json({ error: "Topic not found" }, { status: 404 });
    }

    let fileUrl: string | null = null;

    switch (type) {
      case 'pdf':
        fileUrl = topic.pdfUrl;
        break;
      case 'mcq':
        fileUrl = topic.mcqUrl;
        break;
      case 'caseStudy':
        fileUrl = topic.caseStudyUrl;
        break;
      default:
        return NextResponse.json({ error: "Invalid content type" }, { status: 400 });
    }

    if (!fileUrl) {
      return NextResponse.json({ error: "Content not available" }, { status: 404 });
    }

    // If it's a Cloudinary URL, redirect to it
    if (fileUrl.includes('cloudinary.com')) {
      return NextResponse.redirect(fileUrl);
    }

    // If it's a local file path (update this logic based on your storage)
    // For now, returning the URL - you'll need to implement actual file serving
    return NextResponse.json({ downloadUrl: fileUrl });

  } catch (err) {
    console.error("Download error:", err);
    return NextResponse.json({ error: "Failed to download content" }, { status: 500 });
  }
}
