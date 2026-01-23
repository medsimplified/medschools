"use client";
import { useEffect, useState } from "react";
import Image from "next/image";
import HeaderSeven from "@/layouts/headers/HeaderSeven";
interface YoutubeVideo {
  videoId: string;
  title: string;
  description: string;
  thumbnail: string;
}

export default function LatestVideosPage() {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [selectedVideo, setSelectedVideo] = useState<YoutubeVideo | null>(null);

  useEffect(() => {
    fetch("/api/youtube-videos")
      .then((r) => r.json())
      .then((data) => setVideos(data.videos || []));
  }, []);

  return (
    <>
      <HeaderSeven />
      <main>
        <section
          className="courses-area-six py-5 mb-5"
          style={{
            minHeight: "600px",
            width: "100%",
            background: "#f8fafc", // Match Courses.tsx background
          }}
        >
          <div className="container">
            <h1
              className="title bold text-center mb-8"
              style={{
                fontSize: "2.2rem",
                fontWeight: 800,
                color: "#0d447a", // Match Courses.tsx title color
                textShadow: "0 2px 12px #0d447a22",
                marginBottom: "2rem",
                letterSpacing: "0.02em",
              }}
            >
              Latest YouTube Videos
            </h1>
            <div className="row" style={{ gap: "32px 0" }}>
              {videos.map((video) => (
                <div
                  key={video.videoId}
                  className="col-lg-3 col-md-4 mb-5 d-flex"
                  onClick={() => setSelectedVideo(video)}
                  style={{
                    cursor: "pointer",
                    display: "flex",
                    justifyContent: "center",
                  }}
                >
                  <div
                    className="courses__item-eight tilt-ready"
                    style={{
                      height: "100%",
                      background: "#fff",
                      borderRadius: "18px",
                      boxShadow: "0 4px 24px #0d447a22", // Match Courses.tsx shadow
                      border: "1.5px solid #e2e8f0", // Match Courses.tsx border
                      transition: "transform 0.18s, box-shadow 0.18s, border-color 0.18s",
                      width: "100%",
                      maxWidth: "340px",
                      position: "relative",
                      overflow: "hidden",
                    }}
                    onMouseEnter={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "translateY(-4px) scale(1.03)";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 8px 32px #0d447a33";
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#0d447a";
                    }}
                    onMouseLeave={e => {
                      (e.currentTarget as HTMLDivElement).style.transform = "";
                      (e.currentTarget as HTMLDivElement).style.boxShadow = "0 4px 24px #0d447a22";
                      (e.currentTarget as HTMLDivElement).style.borderColor = "#e2e8f0";
                    }}
                  >
                    <div
                      className="courses__item-thumb-seven"
                      style={{
                        position: "relative",
                        borderRadius: "16px",
                        overflow: "hidden",
                      }}
                    >
                      <Image
                        src={video.thumbnail}
                        alt={video.title}
                        width={400}
                        height={180}
                        style={{
                          width: "100%",
                          height: "180px",
                          objectFit: "cover",
                          borderRadius: "16px",
                          display: "block",
                          boxShadow: "0 2px 12px #0d447a11",
                        }}
                      />
                      <span
                        className="play-overlay"
                        style={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          background: "#0d447aee",
                          borderRadius: "50%",
                          padding: "10px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          boxShadow: "0 2px 12px #0d447a22",
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" width="32" height="32" aria-hidden>
                          <circle cx="12" cy="12" r="12" fill="#f8fafc" />
                          <polygon points="10,8 16,12 10,16" fill="#0d447a" />
                        </svg>
                      </span>
                    </div>
                    <div
                      className="courses__item-content-seven"
                      style={{
                        padding: "20px 18px 14px 18px",
                        minHeight: "110px",
                      }}
                    >
                      <h2
                        className="title"
                        style={{
                          fontWeight: 700,
                          fontSize: "1.18rem",
                          color: "#0d447a",
                          marginBottom: "10px",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {video.title}
                      </h2>
                      <p
                        style={{
                          fontSize: "14px",
                          color: "#0d447a",
                          opacity: 0.85,
                          marginBottom: 0,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                          whiteSpace: "nowrap",
                        }}
                      >
                        {video.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {/* Modal Popup */}
            {selectedVideo && (
              <div
                style={{
                  position: "fixed",
                  top: 0,
                  left: 0,
                  width: "100vw",
                  height: "100vh",
                  background: "rgba(13,68,122,0.18)", // Match Courses.tsx modal overlay
                  zIndex: 9999,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  backdropFilter: "blur(10px)",
                }}
              >
                <div
                  className="popup-3d-modal animate-fadeIn"
                  style={{
                    position: "relative",
                    background: "#fff",
                    borderRadius: "24px",
                    padding: "2rem",
                    maxWidth: "640px",
                    width: "100%",
                    boxShadow: "0 8px 32px #0d447a22",
                  }}
                >
                  <button
                    className="absolute top-3 right-3"
                    onClick={() => setSelectedVideo(null)}
                    style={{
                      background: "#0d447a",
                      borderRadius: "50%",
                      width: "44px",
                      height: "44px",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      border: "none",
                      cursor: "pointer",
                      position: "absolute",
                      top: "16px",
                      right: "16px",
                      fontSize: "2rem",
                      color: "#fff",
                      boxShadow: "0 2px 12px #0d447a22",
                    }}
                    aria-label="Close"
                  >
                    &times;
                  </button>
                  <h2
                    className="text-2xl font-bold mb-4 text-[#0d447a] text-center"
                    style={{
                      fontWeight: 800,
                      fontSize: "1.3rem",
                      marginBottom: "1.2rem",
                    }}
                  >
                    {selectedVideo.title}
                  </h2>
                  <div
                    style={{
                      position: "relative",
                      paddingBottom: "56.25%",
                      height: 0,
                      overflow: "hidden",
                      borderRadius: "24px",
                      background: "#000",
                    }}
                  >
                    <iframe
                      src={`https://www.youtube.com/embed/${selectedVideo.videoId}?autoplay=1&controls=1`}
                      title={selectedVideo.title}
                      frameBorder="0"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      style={{
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: "100%",
                        borderRadius: "16px",
                      }}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
    </>
  );
}
