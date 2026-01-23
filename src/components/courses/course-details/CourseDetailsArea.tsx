'use client';
import { useEffect, useState } from "react";

interface YouTubeVideo {
  title: string;
  videoId: string;
  thumbnail: string;
}

const YouTubePlaylist = ({ playlistId }: { playlistId: string }) => {
  const [videos, setVideos] = useState<YouTubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<string>("");

  useEffect(() => {
    // No missing dependency warning: fetchPlaylist is defined inside useEffect
    const fetchPlaylist = async () => {
      const apiKey = process.env.NEXT_PUBLIC_YOUTUBE_API_KEY;
      const res = await fetch(
        `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&maxResults=20&playlistId=${playlistId}&key=${apiKey}`
      );
      const data = await res.json();
      const formatted = data.items.map((item: any) => ({
        title: item.snippet.title,
        videoId: item.snippet.resourceId.videoId,
        thumbnail: item.snippet.thumbnails?.medium?.url || "",
      }));
      setVideos(formatted);
      setSelectedVideo(formatted[0].videoId); // default to first
    };
    fetchPlaylist();
  }, [playlistId]);

  return (
    <div className="row">
      {/* Chapters/Sidebar */}
      <div className="col-lg-4">
        <ul className="list-group">
          {videos.map((video, i) => (
            <li
              key={i}
              className={`list-group-item ${video.videoId === selectedVideo ? "active" : ""}`}
              onClick={() => setSelectedVideo(video.videoId)}
              style={{ cursor: "pointer" }}
            >
              {/* Escape double quotes */}
              {video.title.replace(/"/g, '&quot;').replace(/'/g, '&apos;')}
            </li>
          ))}
        </ul>
      </div>

      {/* Video Player */}
      <div className="col-lg-8">
        {selectedVideo && (
          <iframe
            width="100%"
            height="400"
            src={`https://www.youtube.com/embed/${selectedVideo}`}
            title="YouTube video player"
            allowFullScreen
          ></iframe>
        )}
      </div>
    </div>
  );
};

export default YouTubePlaylist;

// Fix for react/no-unescaped-entities and react/no-unescaped-quotes
// If you have any JSX text content with single or double quotes elsewhere, escape them:
// Example: Use &quot; for " and &apos; for ' in JSX text nodes
