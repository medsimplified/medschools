import { NextResponse } from "next/server";

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY;
const CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID;

export async function GET() {
  if (!YOUTUBE_API_KEY || !CHANNEL_ID) {
    return NextResponse.json(
      { videos: [], error: "Missing YouTube API key or channel ID" },
      { status: 500 }
    );
  }

  const url = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=8`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      const errorText = await res.text();
      return NextResponse.json(
        { videos: [], error: "Failed to fetch from YouTube API", details: errorText },
        { status: 500 }
      );
    }
    const data = await res.json();

    const items = Array.isArray(data.items) ? data.items : [];
    const videos = items
      .filter((item: any) => item.id && item.id.kind === "youtube#video")
      .map((item: any) => ({
        videoId: item.id.videoId,
        title: item.snippet.title,
        description: item.snippet.description,
        thumbnail:
          item.snippet.thumbnails?.high?.url ||
          item.snippet.thumbnails?.default?.url ||
          "",
      }));

    return NextResponse.json({ videos });
  } catch (error: any) {
    return NextResponse.json(
      { videos: [], error: "Unexpected error", details: error?.message || String(error) },
      { status: 500 }
    );
  }
}