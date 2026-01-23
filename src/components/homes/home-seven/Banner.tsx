"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import HeaderSeven from "@/layouts/headers/HeaderSeven";

interface Banner {
  id: number;
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink?: string | null;
  youtubeUrl: string; // full URL or raw ID
}

/** Robust YouTube ID extractor (watch, youtu.be, embed, shorts, raw ID) */
function getYouTubeId(input?: string | null): string | null {
  if (!input) return null;
  const raw = input.trim();

  // Already an ID?
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;

  try {
    const url = new URL(raw);
    if (!/(\.|^)youtube\.com$|(\.|^)youtu\.be$/.test(url.hostname)) return null;

    // watch?v=VIDEOID
    const v = url.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;

    // /shorts/VIDEOID, /embed/VIDEOID, /v/VIDEOID, /VIDEOID
    const parts = url.pathname.split("/").filter(Boolean).reverse();
    for (const seg of parts) {
      if (/^[a-zA-Z0-9_-]{11}$/.test(seg)) return seg;
    }
    return null;
  } catch {
    return null;
  }
}

const AUTOPLAY_MS = 7000;

const BannerSlider: React.FC = () => {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [index, setIndex] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const hoverRef = useRef(false);

  useEffect(() => {
    fetch("/api/banner-videos")
      .then((r) => r.json())
      .then((data) => setBanners(Array.isArray(data) ? data : []))
      .catch(() => setBanners([]))
      .finally(() => setLoading(false));
  }, []);

  /** Only keep items with valid video IDs */
  const slides = useMemo(
    () =>
      (banners || [])
        .map((b) => ({ ...b, videoId: getYouTubeId(b.youtubeUrl) }))
        .filter((b) => !!b.videoId),
    [banners]
  );

  const count = slides.length;

  /** autoplay */
  useEffect(() => {
    if (count <= 1) return;
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!hoverRef.current) {
        setIndex((i) => (i + 1) % count);
      }
    }, AUTOPLAY_MS);
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [count]);

  const goto = (i: number) => {
    if (count === 0) return;
    setIndex((i + count) % count);
  };

  const next = () => goto(index + 1);
  const prev = () => goto(index - 1);

  return (
    <>
      <HeaderSeven />
      <section
        className="hero-section banner-3d"
        style={{
          backgroundImage:
            "linear-gradient(135deg, rgba(13,68,122,0.95) 0%, rgba(13,68,122,0.85) 25%, rgba(25,85,145,0.90) 50%, rgba(13,68,122,0.95) 100%), url('/assets/img/banner/main.png')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          minHeight: "100vh",
          width: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "10px 0",
          overflow: "hidden",
          position: "relative",
          color: "#fff",
          borderRadius: "20px",
          margin: "0",
        }}
      >
        {/* Single clean background layer */}
        <div className="banner-main-layer" />

        <div
          style={{
            width: "100%",
            maxWidth: 1400,
            margin: "0 auto",
            position: "relative",
            zIndex: 2,
          }}
          onMouseEnter={() => (hoverRef.current = true)}
          onMouseLeave={() => (hoverRef.current = false)}
        >
          {loading ? (
            <div style={{ padding: 40, textAlign: "center" }}>Loading banners…</div>
          ) : count === 0 ? (
            <div style={{ padding: 40, textAlign: "center" }}>
              No playable YouTube videos. Please check your URLs/IDs.
            </div>
          ) : (
            <div className="simple-slider">
              {/* Slides */}
              <div className="slides-viewport">
                {slides.map((banner, i) => (
                  <article
                    key={banner.id}
                    className={`slide ${i === index ? "is-active" : "is-inactive"}`}
                    aria-hidden={i === index ? "false" : "true"}
                  >
                    <div className="hero-content-row">
                      {/* LEFT: TEXT */}
                      <div className="hero-left">
                        <div className="hero-text-decoration" />
                        <h1 className="hero-title">{banner.heading}</h1>
                        <p className="hero-sub">{banner.subheading}</p>
                        <Link href={banner.buttonLink || "/register"} className="hero-cta">
                          <span className="btn-shine" />
                          <span className="btn-text">{banner.buttonText || "Get Started Now"}</span>
                          <span className="btn-arrow">→</span>
                          <span className="btn-glow" />
                        </Link>
                      </div>

                      {/* RIGHT: VIDEO */}
                      <div className="hero-right">
                        <div className="hero-right-decorations" />
                        <div className="youtube-wrapper">
                          <div className="video-frame-glow" />
                          <iframe
                            className="yt-iframe"
                            src={`https://www.youtube.com/embed/${banner.videoId}?autoplay=0&controls=1&modestbranding=1&rel=0&iv_load_policy=3`}
                            title={banner.heading || "Banner video"}
                            loading="lazy"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            allowFullScreen
                          />
                        </div>
                      </div>
                    </div>
                  </article>
                ))}
              </div>

              {/* Controls */}
              {count > 1 && (
                <>
                  <button className="nav-btn prev" onClick={prev} aria-label="Previous slide">
                    <span className="nav-btn-inner">‹</span>
                    <span className="nav-btn-ripple" />
                  </button>
                  <button className="nav-btn next" onClick={next} aria-label="Next slide">
                    <span className="nav-btn-inner">›</span>
                    <span className="nav-btn-ripple" />
                  </button>

                  <div className="dots">
                    {slides.map((_, i) => (
                      <button
                        key={i}
                        className={`dot ${i === index ? "active" : ""}`}
                        onClick={() => goto(i)
                        }
                        aria-label={`Go to slide ${i + 1}`}
                      >
                        <span className="dot-inner" />
                        <span className="dot-pulse" />
                      </button>
                    ))}
                  </div>
                </>
              )}
            </div>
          )}
        </div>

        {/* Clean professional styles */}
        <style jsx global>{`
          .hero-content-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
            min-height: 600px;
            width: 100%;
            max-width: 1400px;
            margin: 0 auto;
            position: relative;
            padding: 0 20px;
          }
          @media (max-width: 1200px) {
            .hero-content-row {
              gap: 24px;
              padding: 0 10px;
              min-height: 400px;
            }
          }
          @media (max-width: 991px) {
            .hero-content-row {
              flex-direction: column;
              align-items: stretch;
              justify-content: flex-start;
              gap: 18px;
              padding: 10px;
              min-height: 0;
              height: auto;
            }
            .hero-left, .hero-right {
              width: 100%;
              padding: 0;
              margin: 0 auto;
            }
            .youtube-wrapper {
              max-width: 100%;
              width: 100%;
              min-width: 0;
            }
          }
          @media (max-width: 600px) {
            .hero-content-row {
              gap: 10px;
              padding: 6px;
              align-items: center;
              justify-content: center;
              min-height: 340px;
              height: 340px;
            }
            .hero-title {
              font-size: 2rem !important;
              margin-bottom: 10px !important;
              text-align: center;
            }
            .hero-sub {
              font-size: 1.2rem !important;
              margin-bottom: 14px !important;
              text-align: center;
            }
            .hero-cta {
              font-size: 1.2rem !important;
              padding: 12px 24px !important;
              margin: 0 auto !important;
              display: flex !important;
              justify-content: center !important;
              align-items: center !important;
            }
            .youtube-wrapper {
              border-radius: 10px;
              min-width: 0;
              aspect-ratio: 16/9;
            }
          }
          @media (max-width: 400px) {
            .hero-title {
              font-size: 1rem !important;
            }
            .hero-sub {
              font-size: 0.8rem !important;
            }
          }

          /* Full screen responsive layout */
          .hero-content-row {
            display: flex;
            flex-direction: row;
            align-items: center;
            justify-content: space-between;
            gap: 40px;
            height: calc(100vh - 80px);
            min-height: calc(100vh - 80px);
            position: relative;
            padding: 0 60px;
          }
          
          .hero-left {
            flex: 1;
            color: #fff;
            padding: 0 20px 0 0;
            display: flex;
            flex-direction: column;
            justify-content: center;
            position: relative;
            z-index: 3;
          }

          .hero-text-decoration {
            display: none;
          }

          .hero-left::before {
            display: none;
          }

          .hero-title {
            color: #fff !important;
            font-weight: 800;
            font-size: 48px;
            line-height: 1.2;
            margin: 0 0 20px 0;
            text-shadow: 0 2px 20px rgba(0,0,0,0.3);
          }

          .hero-sub {
            color: rgba(255,255,255,0.9) !important;
            font-size: 18px;
            margin: 0 0 25px 0;
            line-height: 1.6;
            font-weight: 400;
            text-shadow: 0 1px 10px rgba(0,0,0,0.2);
          }

          .hero-cta {
            display: inline-flex;
            align-items: center;
            gap: 12px;
            background: #5dba47;
            color: #fff !important;
            border-radius: 10px;
            padding: 7px 14px;
            font-weight: 600;
            font-size: 20px;
            text-decoration: none;
            width: fit-content;
            box-shadow: 0 8px 24px rgba(93, 186, 71, 0.4);
            border: none;
            position: relative;
            overflow: hidden;
          }

          .btn-shine {
            position: absolute;
            top: 0;
            left: -100%;
            width: 100%;
            height: 100%;
            background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent);
            z-index: 1;
          }

          .btn-text {
            position: relative;
            z-index: 2;
          }

          .btn-arrow {
            position: relative;
            z-index: 2;
            font-size: 14px;
            background: rgba(255,255,255,0.35);
            width: 28px;
            height: 28px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-weight: 600;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15) !important;
          }

          .btn-glow {
            display: none;
          }

          .hero-cta:hover .btn-shine {
            left: 100%;
          }

          .hero-right {
            flex: 1.4;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 0;
            position: relative;
          }

          .hero-right-decorations {
            display: none;
          }

          .youtube-wrapper {
            position: relative;
            width: 100%;
            max-width: 800px;
            aspect-ratio: 16 / 9;
            background: #000;
            border-radius: 16px;
            overflow: hidden;
            box-shadow: 0 15px 35px rgba(0,0,0,0.2);
            border: 2px solid rgba(255,255,255,0.1);
            transition: all 0.3s ease;
          }

          .video-frame-glow {
            display: none;
          }

          .youtube-wrapper:hover {
            transform: scale(1.02);
            box-shadow: 0 20px 45px rgba(0,0,0,0.3);
          }

          .youtube-wrapper .yt-iframe {
            width: 100%;
            height: 100%;
            border: 0;
            border-radius: 14px;
            display: block;
          }

          /* Navigation positioned outside content area */
          .nav-btn {
            position: absolute;
            top: 50%;
            transform: translateY(-50%);
            width: 45px;
            height: 45px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.2);
            background: rgba(0,0,0,0.5);
            color: #fff;
            font-size: 18px;
            cursor: pointer;
            z-index: 15;
            backdrop-filter: blur(10px);
            transition: all 0.3s ease;
          }

          .nav-btn-inner {
            position: relative;
            z-index: 2;
            display: block;
          }

          .nav-btn-ripple {
            display: none;
          }

          .nav-btn:hover {
            background: rgba(0,0,0,0.6);
            border-color: rgba(255,255,255,0.3);
            transform: translateY(-50%) scale(1.1);
          }

          .nav-btn.prev {
            left: 10px;
          }
          
          .nav-btn.next {
            right: 10px;
          }

          /* Dots positioned outside content area */
          .dots {
            position: absolute;
            left: 0;
            right: 0;
            bottom: -50px;
            display: flex;
            gap: 12px;
            justify-content: center;
            z-index: 15;
          }

          .dot {
            width: 12px;
            height: 12px;
            border-radius: 50%;
            border: 2px solid rgba(255,255,255,0.3);
            background: rgba(255,255,255,0.1);
            cursor: pointer;
            transition: all 0.3s ease;
            position: relative;
          }

          .dot-inner, .dot-pulse {
            display: none;
          }

          .dot:hover {
            background: rgba(255,255,255,0.3);
            border-color: rgba(255,255,255,0.5);
            transform: scale(1.2);
          }

          .dot.active {
            background: #5dba47;
            border-color: #5dba47;
            box-shadow: 0 0 10px rgba(93, 186, 71, 0.5);
          }

          /* Mobile responsive - full screen */
          @media (max-width: 991px) {
            .hero-content-row {
              flex-direction: column;
              text-align: center;
              gap: 20px;
              padding: 20px;
              height: calc(100vh - 60px);
              min-height: calc(100vh - 60px);
            }
            .hero-left {
              padding: 0;
              flex: none;
            }
            .hero-title {
              font-size: 28px;
              margin: 0 0 12px 0;
            }
            .hero-sub {
              font-size: 16px;
              margin: 0 0 18px 0;
            }
            .hero-right {
              width: 100%;
              flex: 1;
              display: flex;
              align-items: center;
            }
            .youtube-wrapper {
              max-width: 100%;
              width: 100%;
            }
            .nav-btn {
              width: 40px;
              height: 40px;
              font-size: 16px;
            }
            .nav-btn.prev {
              left: 5px;
            }
            .nav-btn.next {
              right: 5px;
            }
            .dots {
              bottom: -30px;
            }
          }

          /* Tablet responsive */
          @media (max-width: 1200px) and (min-width: 992px) {
            .hero-content-row {
              gap: 30px;
              padding: 0 40px;
            }
            .hero-title {
              font-size: 42px;
            }
            .youtube-wrapper {
              max-width: 650px;
            }
          }

          /* Small mobile responsive */
          @media (max-width: 576px) {
            .hero-content-row {
              gap: 15px;
              padding: 15px;
              height: calc(100vh - 40px);
              min-height: calc(100vh - 40px);
            }
            .hero-title {
              font-size: 24px;
            }
            .hero-sub {
              font-size: 14px;
            }
            .hero-cta {
              font-size: 16px;
              padding: 8px 16px;
            }
          }

          /* Large screens */
          @media (min-width: 1400px) {
            .hero-content-row {
              gap: 60px;
              padding: 0 80px;
            }
          }

          /* Landscape orientation for mobile */
          @media (max-height: 600px) and (orientation: landscape) {
            .hero-content-row {
              flex-direction: row;
              height: calc(100vh - 40px);
              min-height: calc(100vh - 40px);
              gap: 20px;
            }
            .hero-left {
              flex: 1;
            }
            .hero-right {
              flex: 1.2;
            }
            .hero-title {
              font-size: 20px;
              margin: 0 0 8px 0;
            }
            .hero-sub {
              font-size: 14px;
              margin: 0 0 12px 0;
            }
          }

          /* Slider positioned to not overlap content */
          .simple-slider {
            position: relative;
            width: 100%;
            height: 100%;
            background: transparent;
            padding-bottom: 60px;
          }
          
          .slides-viewport {
            position: relative;
            width: 100%;
            height: 100%;
          }
          
          .slide {
            position: absolute;
            inset: 0;
            opacity: 0;
            transform: translateX(5%);
            transition: all 500ms ease;
          }
          
          .slide.is-active {
            opacity: 1;
            transform: translateX(0);
            position: relative;
          }
        `}</style>

        {/* Single clean background layer */}
        <style jsx>{`
          .banner-main-layer {
            position: absolute;
            inset: 0;
            z-index: 1;
            background: linear-gradient(
              135deg,
              rgba(255,255,255,0.05) 0%,
              rgba(255,255,255,0.02) 100%
            );
            border-radius: 20px;
            backdrop-filter: blur(1px);
          }

          /* Remove all other layer animations and effects */
          .hero-section::before,
          .hero-section::after {
            display: none;
          }
        `}</style>
      </section>
    </>
  );
};

export default BannerSlider;
