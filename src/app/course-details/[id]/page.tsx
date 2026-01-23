"use client";

import { useParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";

const HeaderSeven = dynamic(() => import("@/layouts/headers/HeaderSeven"), {
  ssr: false,
});

// YOUR BRAND COLORS
const BRAND = {
  primary: "#0d447a",
  secondary: "#5dba47",
  accent: "#ffd700",
  bg: "#f8fafc",
  card: "#ffffff",
  subtle: "#64748b",
  line: "#e2e8f0",
  glow: "0 10px 30px rgba(13, 68, 122, 0.18)",
  softShadow: "0 10px 24px rgba(0,0,0,0.08)",
};

type TabKey = "overview" | "materials" | "practice" | "casestudy";

type Mcq = {
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
};

type Subtopic = {
  title?: string;
  youtubeUrl?: string;
  pdf?: string;
  pdfAccess?: string;
  caseStudy?: string;
  caseStudyAccess?: string;
  caseStudyMcqs?: Mcq[];
  mcqs?: Mcq[];
};

type Topic = {
  topic?: string;
  youtubeUrl?: string;
  pdf?: string;
  pdfAccess?: string;
  caseStudy?: string;
  caseStudyAccess?: string;
  caseStudyMcqs?: Mcq[];
  mcqs?: Mcq[];
  subtopics?: Subtopic[];
};

type Chapter = {
  chapter?: string;
  topics?: Topic[];
};

type Curriculum = {
  subject?: string;
  introVideoUrl?: string;
  chapters?: Chapter[] | string;
  mcqs?: Mcq[] | string;
};

const CourseDetailsPage = () => {
  const params = useParams();
  const id = params ? (params["id"] as string) : undefined;

  const [vw, setVw] = useState<number>(
    typeof window !== "undefined" ? window.innerWidth : 1440
  );
  const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
  const [selected, setSelected] = useState({
    chapter: -1, // -1 indicates Introduction
    topic: 0,
    subtopic: 0,
  });
  const [tab, setTab] = useState<TabKey>("overview");
  const [mcqAnswers, setMcqAnswers] = useState<{ [key: string]: number | null }>(
    {}
  );
  const [mcqSubmitted, setMcqSubmitted] = useState<{ [key: string]: boolean }>(
    {}
  );
  const [openChapters, setOpenChapters] = useState<{ [key: number]: boolean }>(
    {}
  );

  const isMobile = vw < 768;

  const toggleChapter = (ci: number) => {
    setOpenChapters((prev) => ({ ...prev, [ci]: !prev[ci] }));
  };

  // Safely get chapters array
  const chapters: Chapter[] = useMemo(() => (
    Array.isArray(curriculum?.chapters)
      ? (curriculum!.chapters as Chapter[])
      : []
  ), [curriculum]);

  const chapter = useMemo(
    () => chapters?.[selected.chapter] ?? {},
    [chapters, selected.chapter]
  );
  
  const topic = useMemo(
    () => chapter?.topics?.[selected.topic] ?? {},
    [chapter, selected.topic]
  );
  
  const subtopic = useMemo(
    () => topic?.subtopics?.[selected.subtopic] ?? {},
    [topic, selected.subtopic]
  );

  const activeMcqs: Mcq[] =
    subtopic?.mcqs ??
    topic?.mcqs ??
    ((Array.isArray(curriculum?.mcqs) ? curriculum.mcqs : []) as Mcq[]);

  const activeCaseStudyMcqs: Mcq[] =
    subtopic?.caseStudyMcqs ??
    topic?.caseStudyMcqs ??
    [];

  const totalChapters = chapters.length;
  const totalTopics = chapters?.reduce(
    (acc, ch) => acc + (ch.topics ? ch.topics.length : 0),
    0
  ) || 0;
  const totalCurriculumMcqs = Array.isArray(curriculum?.mcqs)
    ? curriculum.mcqs.length
    : 0;

  // Resize listener (debounced)
  useEffect(() => {
    let t: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(t);
      t = setTimeout(() => setVw(window.innerWidth), 100);
    };
    window.addEventListener("resize", onResize);
    return () => {
      clearTimeout(t);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  // Fetch curriculum data
  useEffect(() => {
    if (!id) return;
    const ctrl = new AbortController();

    fetch(`/api/course-curriculum/${encodeURIComponent(id)}`, {
      signal: ctrl.signal,
    })
      .then((res) => res.json())
      .then((data: Curriculum) => {
        const processed: Curriculum = { ...data };

        if (processed && typeof processed.chapters === "string") {
          try {
            processed.chapters = JSON.parse(processed.chapters) as Chapter[];
          } catch (parseError) {
            processed.chapters = [];
          }
        }

        if (processed && typeof processed.mcqs === "string") {
          try {
            processed.mcqs = JSON.parse(processed.mcqs) as Mcq[];
          } catch (parseError) {
            processed.mcqs = [];
          }
        }

        if (processed && !Array.isArray(processed.chapters)) {
          processed.chapters = [];
        }

        if (processed && !Array.isArray(processed.mcqs)) {
          processed.mcqs = [];
        }

        setCurriculum(processed);
      })
      .catch((err) => {
        if (err?.name !== "AbortError") {
          setCurriculum({
            subject: "Course not found",
            chapters: [],
            mcqs: [],
          });
        }
      });

    return () => {
      ctrl.abort();
    };
  }, [id]);

  if (!curriculum) {
    return (
      <div
        style={{
          minHeight: "60vh",
          display: "grid",
          placeItems: "center",
          backgroundColor: BRAND.bg,
        }}
      >
        <div className="text-center">
          <div className="spinner-border mb-3" role="status" style={{ color: BRAND.primary, width: "3rem", height: "3rem" }}>
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: BRAND.primary, fontWeight: "600" }}>
            Loading course content...
          </p>
        </div>
      </div>
    );
  }

  return (
    <>
      <HeaderSeven />

      {/* Hero Section */}
      <div
        style={{
          background: `linear-gradient(135deg, ${BRAND.primary} 0%, ${BRAND.secondary} 100%)`,
          padding: isMobile ? "40px 20px" : "60px 40px",
          color: "#fff",
        }}
      >
        <div style={{ maxWidth: "1400px", margin: "0 auto" }}>
          <h1 style={{ fontSize: isMobile ? "28px" : "42px", fontWeight: "800", marginBottom: "16px", color: "#ffffff" }}>
            {curriculum?.subject}
          </h1>
          <p style={{ fontSize: "18px", opacity: 0.75, marginBottom: "24px", color: "#d1d5db" }}>
            Comprehensive medical education course for healthcare professionals
          </p>
          <div style={{ display: "flex", gap: "32px", flexWrap: "wrap" }}>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff" }}>{totalChapters}</div>
              <div style={{ opacity: 0.8 }}>Chapters</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff" }}>{totalTopics}</div>
              <div style={{ opacity: 0.8 }}>Topics</div>
            </div>
            <div>
              <div style={{ fontSize: "32px", fontWeight: "800", color: "#ffffff" }}>{totalCurriculumMcqs}</div>
              <div style={{ opacity: 0.8 }}>Practice MCQs</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content - Three Column Layout */}
      <div
        style={{
          maxWidth: "1600px",
          margin: "0 auto",
          padding: isMobile ? "12px" : "40px",
        }}
      >
        {/* Responsive: 3 columns for desktop, stacked for mobile/tablet */}
        <div
          style={{
            display: isMobile ? "block" : "grid",
            gridTemplateColumns: isMobile ? undefined : "280px 1fr 280px",
            gap: isMobile ? "0" : "24px",
          }}
        >
          {/* LEFT SIDEBAR - Course Content */}
          <div
            className={isMobile ? "course-details-mobile-sidebar" : ""}
            style={{
              background: isMobile ? "#fff" : BRAND.card,
              borderRadius: isMobile ? "12px" : "16px",
              padding: isMobile ? "16px" : "28px",
              border: isMobile ? "1px solid #e2e8f0" : `1px solid ${BRAND.line}`,
              marginBottom: isMobile ? "22px" : undefined,
              maxWidth: isMobile ? "100vw" : undefined,
              position: !isMobile ? "sticky" : undefined,
              top: !isMobile ? "24px" : undefined,
              maxHeight: !isMobile ? "calc(100vh - 100px)" : undefined,
              overflowY: !isMobile ? "auto" : undefined,
              fontSize: "18px",
            }}
          >
            <h3
              style={{
                color: BRAND.primary,
                fontSize: isMobile ? "20px" : "22px",
                fontWeight: "700",
                marginBottom: isMobile ? "14px" : "22px",
                display: "flex",
                alignItems: "center",
                gap: "8px",
              }}
            >
              <span style={{ fontSize: isMobile ? "22px" : "26px" }}>📚</span> Course Content
            </h3>
            {curriculum?.introVideoUrl && (
              <div
                onClick={() => {
                  setSelected({ chapter: -1, topic: 0, subtopic: 0 });
                  setTab("overview");
                }}
                style={{
                  padding: "8px 10px",
                  marginBottom: "10px",
                  background: selected.chapter === -1 ? `${BRAND.primary}15` : "transparent",
                  borderRadius: "6px",
                  cursor: "pointer",
                  color: BRAND.primary,
                  fontWeight: "600",
                  fontSize: "15px",
                  display: "flex",
                  alignItems: "center",
                  gap: "8px",
                  borderLeft: `3px solid ${BRAND.primary}`,
                }}
              >
                <span style={{ fontSize: "15px" }}>🎬</span>
                <span>Introduction</span>
              </div>
            )}
            {chapters.map((ch, ci) => (
              <div key={ci} style={{ marginBottom: "6px" }}>
                <div
                  onClick={() => {
                    setSelected({ chapter: ci, topic: 0, subtopic: 0 });
                    toggleChapter(ci);
                    if (chapters[ci]?.topics?.[0]?.youtubeUrl) {
                      setTab("materials");
                    }
                  }}
                  style={{
                    padding: "8px 10px",
                    background: selected.chapter === ci ? `${BRAND.primary}15` : "transparent",
                    borderRadius: "6px",
                    cursor: "pointer",
                    color: BRAND.primary,
                    fontWeight: "600",
                    fontSize: "15px",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <span>{ch.chapter || `Chapter ${ci + 1}`}</span>
                  <span
                    style={{
                      transform: openChapters[ci] ? "rotate(90deg)" : "rotate(0deg)",
                      transition: "transform 0.2s",
                      fontSize: "10px",
                    }}
                  >
                    ▸
                  </span>
                </div>
                {openChapters[ci] && (
                  <div style={{ paddingLeft: "10px", marginTop: "4px" }}>
                    {(ch.topics || []).map((tp, ti) => (
                      <div
                        key={ti}
                        onClick={() => {
                          setSelected({ chapter: ci, topic: ti, subtopic: 0 });
                          if (tp.youtubeUrl || tp.pdf) {
                            setTab("materials");
                          }
                        }}
                        style={{
                          padding: "7px 8px",
                          cursor: "pointer",
                          color:
                            selected.chapter === ci && selected.topic === ti
                              ? BRAND.secondary
                              : BRAND.subtle,
                          fontSize: "11px",
                          fontWeight:
                            selected.chapter === ci && selected.topic === ti
                              ? "600"
                              : "500",
                          borderRadius: "5px",
                          marginBottom: "3px",
                          background:
                            selected.chapter === ci && selected.topic === ti
                              ? `${BRAND.secondary}10`
                              : "transparent",
                        }}
                      >
                        {tp.topic || `Topic ${ti + 1}`}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* CENTER - Video & Materials */}
          <div
            style={{
              margin: isMobile ? "0" : undefined,
              padding: isMobile ? "0" : undefined,
              fontSize: "18px",
            }}
          >
            {/* Tab Navigation */}
            <div
              style={{
                display: "flex",
                gap: "12px",
                marginBottom: "28px",
                borderBottom: `2px solid ${BRAND.line}`,
                paddingBottom: "0",
                flexWrap: isMobile ? "wrap" : "nowrap",
                justifyContent: isMobile ? "center" : "flex-start",
                fontSize: "18px",
              }}
            >
              { [
                { key: "overview", label: "📚 Overview" },
                { key: "materials", label: "📖 Materials" },
                { key: "practice", label: "🧠 Practice" },
                { key: "casestudy", label: "📊 Case Study" },
              ].map((t) => (
                <button
                  key={t.key}
                  onClick={() => setTab(t.key as TabKey)}
                  style={{
                    padding: isMobile ? "10px 12px" : "12px 20px",
                    background: "transparent",
                    border: "none",
                    borderBottom:
                      tab === t.key
                        ? `3px solid ${BRAND.primary}`
                        : "3px solid transparent",
                    color: tab === t.key ? BRAND.primary : BRAND.subtle,
                    fontWeight: tab === t.key ? "700" : "500",
                    cursor: "pointer",
                    fontSize: isMobile ? "13px" : "14px",
                    transition: "all 0.3s ease",
                    flex: isMobile ? "1 1 40%" : undefined,
                  }}
                >
                  {t.label}
                </button>
              ))}
            </div>

            {/* Tab Content */}
            {tab === "overview" && (
              <div>
                {/* Show intro video only if Introduction is selected */}
                {curriculum?.introVideoUrl && selected.chapter === -1 && (
                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ color: BRAND.primary, fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>
                      🎬 Course Introduction
                    </h4>
                    <div
                      style={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                        overflow: "hidden",
                        borderRadius: "12px",
                        border: `2px solid ${BRAND.line}`,
                      }}
                    >
                      {getYouTubeId(curriculum.introVideoUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(curriculum.introVideoUrl)}`}
                          title="Course Introduction"
                          allowFullScreen
                          allow="autoplay; encrypted-media"
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                          }}
                        />
                      ) : (
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                          Invalid YouTube URL
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Show topic video if selected topic has a video and overview tab is active */}
                {selected.chapter >= 0 && topic?.youtubeUrl && (
                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ color: BRAND.primary, fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>
                      🎥 {topic?.topic || "Video Lecture"}
                    </h4>
                    <div
                      style={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                        overflow: "hidden",
                        borderRadius: "12px",
                        border: `2px solid ${BRAND.line}`,
                      }}
                    >
                      {getYouTubeId(topic?.youtubeUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(topic?.youtubeUrl)}`}
                          title="Video Lecture"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                          }}
                        />
                      ) : (
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                          Invalid YouTube URL
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Show subtopic video if selected subtopic has a video and overview tab is active */}
                {selected.chapter >= 0 && topic?.subtopics && topic.subtopics.length > 0 && subtopic?.youtubeUrl && (
                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ color: BRAND.primary, fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>
                      🎥 {subtopic?.title || "Subtopic Video"}
                    </h4>
                    <div
                      style={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                        overflow: "hidden",
                        borderRadius: "12px",
                        border: `2px solid ${BRAND.line}`,
                      }}
                    >
                      {getYouTubeId(subtopic?.youtubeUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(subtopic?.youtubeUrl)}`}
                          title="Subtopic Video"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                          }}
                        />
                      ) : (
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                          Invalid YouTube URL
                        </div>
                      )}
                    </div>
                  </div>
                )}
                {/* Show about course section only when Introduction is selected or no specific chapter is selected */}
                {(selected.chapter === -1 || selected.chapter >= 0) && (
                  <div style={{ background: BRAND.card, padding: "24px", borderRadius: "12px", border: `1px solid ${BRAND.line}` }}>
                    <h4 style={{ color: BRAND.primary, fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>
                      About This Course
                    </h4>
                    <p style={{ color: BRAND.subtle, lineHeight: "1.6", marginBottom: "20px", fontSize: "14px" }}>
                      This comprehensive course covers essential topics in {curriculum?.subject}. Each chapter includes detailed
                      video lectures, PDF materials, practice questions, and clinical case studies.
                    </p>
                    <div style={{ background: `${BRAND.secondary}10`, padding: "16px", borderRadius: "8px", borderLeft: `4px solid ${BRAND.secondary}` }}>
                      <h6 style={{ color: BRAND.primary, fontWeight: "600", marginBottom: "10px", fontSize: "14px" }}>💡 Learning Path:</h6>
                      <ul style={{ color: BRAND.subtle, paddingLeft: "18px", margin: 0, fontSize: "13px" }}>
                        <li>Watch video lectures for each topic</li>
                        <li>Review PDF materials and take notes</li>
                        <li>Test your knowledge with practice MCQs</li>
                        <li>Study clinical case studies for real-world application</li>
                      </ul>
                    </div>
                  </div>
                )}
              </div>
            )}

            {tab === "materials" && (
              <div>
                {/* Show subtopic video if available, else topic video */}
                {subtopic?.youtubeUrl ? (
                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ color: BRAND.primary, fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>
                      🎥 {subtopic?.title || "Subtopic Video"}
                    </h4>
                    <div
                      style={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                        overflow: "hidden",
                        borderRadius: "12px",
                        border: `2px solid ${BRAND.line}`,
                      }}
                    >
                      {getYouTubeId(subtopic?.youtubeUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(subtopic?.youtubeUrl)}`}
                          title="Subtopic Video"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                          }}
                        />
                      ) : (
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                          Invalid YouTube URL
                        </div>
                      )}
                    </div>
                  </div>
                ) : topic?.youtubeUrl ? (
                  <div style={{ marginBottom: "24px" }}>
                    <h4 style={{ color: BRAND.primary, fontSize: "18px", fontWeight: "700", marginBottom: "12px" }}>
                      🎥 {topic?.topic || "Video Lecture"}
                    </h4>
                    <div
                      style={{
                        position: "relative",
                        paddingBottom: "56.25%",
                        height: 0,
                        overflow: "hidden",
                        borderRadius: "12px",
                        border: `2px solid ${BRAND.line}`,
                      }}
                    >
                      {getYouTubeId(topic?.youtubeUrl) ? (
                        <iframe
                          src={`https://www.youtube.com/embed/${getYouTubeId(topic?.youtubeUrl)}`}
                          title="Video Lecture"
                          allow="autoplay; encrypted-media"
                          allowFullScreen
                          style={{
                            position: "absolute",
                            top: 0,
                            left: 0,
                            width: "100%",
                            height: "100%",
                            border: 0,
                          }}
                        />
                      ) : (
                        <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", background: "#eee", display: "flex", alignItems: "center", justifyContent: "center", color: "#888" }}>
                          Invalid YouTube URL
                        </div>
                      )}
                    </div>
                  </div>
                ) : null}
                {/* PDF Material - Full Width */}
                {(subtopic?.pdf || topic?.pdf) && (
                  <div style={{ background: BRAND.card, borderRadius: "12px", border: `1px solid ${BRAND.line}`, overflow: "hidden", position: "relative" }}>
                    <div style={{ position: "relative", height: "700px", overflow: "hidden" }}>
                      <iframe
                        src={`https://docs.google.com/viewer?url=${encodeURIComponent(subtopic?.pdf || topic?.pdf || "")}&embedded=true`}
                        title="PDF Preview"
                        style={{ width: "100%", height: "100%", border: 0 }}
                      />
                      {((subtopic?.pdfAccess || topic?.pdfAccess) === "PAID") && (
                        <>
                          <div
                            style={{
                              position: "absolute",
                              top: "25%",
                              left: 0,
                              right: 0,
                              bottom: 0,
                              background: "linear-gradient(to bottom, transparent 0%, rgba(255, 255, 255, 0.3) 10%, rgba(255, 255, 255, 0.7) 30%, rgba(255, 255, 255, 0.95) 50%)",
                              backdropFilter: "blur(8px)",
                              pointerEvents: "none",
                            }}
                          />
                          <div
                            style={{
                              position: "absolute",
                              top: "50%",
                              left: 0,
                              right: 0,
                              bottom: 0,
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                              pointerEvents: "auto",
                            }}
                          >
                            <div style={{ textAlign: "center", maxWidth: "400px", padding: "40px 20px" }}>
                              <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔒</div>
                              <h4 style={{ color: BRAND.primary, fontSize: "24px", fontWeight: "700", marginBottom: "12px" }}>
                                Premium Content
                              </h4>
                              <p style={{ color: BRAND.subtle, fontSize: "15px", marginBottom: "24px" }}>
                                Sign in or upgrade to access the full PDF study material.
                              </p>
                              <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                                <button
                                  onClick={() => window.location.href = "/pricing"}
                                  style={{
                                    padding: "14px 28px",
                                    background: BRAND.primary,
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  🔓 Sign In
                                </button>
                                <button
                                  onClick={() => alert("Razorpay payment integration coming soon!")}
                                  style={{
                                    padding: "14px 28px",
                                    background: BRAND.secondary,
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "8px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    fontSize: "16px",
                                    transition: "all 0.3s ease",
                                  }}
                                >
                                  💳 Purchase
                                </button>
                              </div>
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                    <div style={{ padding: "16px 24px", background: BRAND.bg, borderTop: `1px solid ${BRAND.line}` }}>
                      <h5 style={{ color: BRAND.primary, fontSize: "16px", fontWeight: "700", marginBottom: "4px" }}>
                        📄 Study Material
                      </h5>
                      <p style={{ color: BRAND.subtle, fontSize: "13px", margin: 0 }}>
                        {((subtopic?.pdfAccess || topic?.pdfAccess) === "PAID") ? "🔒 Premium" : "✅ Free"}
                      </p>
                    </div>
                  </div>
                )}

                {/* No Materials Message */}
                {!(subtopic?.youtubeUrl || topic?.youtubeUrl) && !(subtopic?.pdf || topic?.pdf) && (
                  <div style={{ textAlign: "center", padding: "60px 20px", background: BRAND.bg, borderRadius: "12px", border: `2px dashed ${BRAND.line}` }}>
                    <div style={{ fontSize: "48px", marginBottom: "16px", opacity: 0.6 }}>📚</div>
                    <h4 style={{ color: BRAND.primary, marginBottom: "8px" }}>No Learning Materials Available</h4>
                    <p style={{ color: BRAND.subtle, fontSize: "15px" }}>
                      Select a topic from the sidebar to view materials
                    </p>
                  </div>
                )}
              </div>
            )}

            {tab === "practice" && (
              <div>
                <h4 style={{ color: BRAND.primary, fontSize: "22px", fontWeight: "700", marginBottom: "20px" }}>
                  🧠 Practice Questions ({activeMcqs.length})
                </h4>
                <div style={{ background: BRAND.card, borderRadius: "12px", border: `1px solid ${BRAND.line}`, padding: "24px" }}>
                  {activeMcqs.length === 0 ? (
                    <p style={{ color: BRAND.subtle, textAlign: "center", fontSize: "16px" }}>
                      No practice questions available for this topic.
                    </p>
                  ) : (
                    activeMcqs.map((mcq, index) => {
                      const questionKey = `practice-${index}`;
                      const userAnswer = mcqAnswers[questionKey];
                      const isSubmitted = mcqSubmitted[questionKey];
                      const isCorrect = userAnswer !== null && mcq.correctAnswerIndex === userAnswer;

                      // Option labels: A, B, C, D, ...
                      const optionLabels = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

                      return (
                        <div
                          key={index}
                          style={{
                            marginBottom: "24px",
                            padding: "18px",
                            borderRadius: "10px",
                            border: `1px solid ${BRAND.line}`,
                            background: "transparent",
                          }}
                        >
                          <div style={{ marginBottom: "16px", color: BRAND.primary, fontWeight: "700", fontSize: "18px" }}>
                            {`${index + 1}. ${mcq.question}`}
                          </div>
                          <div>
                            {mcq.options.map((option, i) => {
                              const isSelected = userAnswer === i;
                              const showTick = isSubmitted && i === mcq.correctAnswerIndex;
                              const showCross = isSubmitted && isSelected && i !== mcq.correctAnswerIndex;
                              return (
                                <div
                                  key={i}
                                  onClick={() => {
                                    if (!isSubmitted) {
                                      setMcqAnswers((prev) => ({ ...prev, [questionKey]: i }));
                                    }
                                  }}
                                  style={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: "12px",
                                    padding: "12px",
                                    borderRadius: "7px",
                                    cursor: isSubmitted ? "not-allowed" : "pointer",
                                    border: isSelected ? `2px solid ${BRAND.primary}` : `1px solid ${BRAND.line}`,
                                    background: "transparent",
                                    fontSize: "17px",
                                    fontWeight: isSelected ? "600" : "500",
                                    color: BRAND.primary,
                                    marginBottom: "10px",
                                    position: "relative",
                                    transition: "border 0.2s",
                                  }}
                                >
                                  <span
                                    style={{
                                      display: "inline-block",
                                      width: "28px",
                                      height: "28px",
                                      borderRadius: "50%",
                                      background: "#f3f4f6",
                                      color: BRAND.primary,
                                      fontWeight: "700",
                                      fontSize: "16px",
                                      textAlign: "center",
                                      lineHeight: "28px",
                                      border: isSelected ? `2px solid ${BRAND.primary}` : `1px solid #e5e7eb`,
                                      marginRight: "4px",
                                    }}
                                  >
                                    {optionLabels[i]}
                                  </span>
                                  <span style={{ flex: 1 }}>{option}</span>
                                  {showTick && (
                                    <span style={{ color: "#22c55e", fontSize: "22px", marginLeft: "8px" }}>✔</span>
                                  )}
                                  {showCross && (
                                    <span style={{ color: "#ef4444", fontSize: "22px", marginLeft: "8px" }}>✖</span>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                          
                          {/* Check Answer Button */}
                          {!isSubmitted && userAnswer !== null && (
                            <button
                              onClick={() => setMcqSubmitted((prev) => ({ ...prev, [questionKey]: true }))}
                              style={{
                                marginTop: "16px",
                                padding: "12px 28px",
                                background: BRAND.primary,
                                color: "#fff",
                                border: "none",
                                borderRadius: "8px",
                                fontWeight: "700",
                                cursor: "pointer",
                                fontSize: "18px",
                                transition: "all 0.3s ease",
                              }}
                            >
                              Check Answer
                            </button>
                          )}

                          {/* Explanation - Only show after submission */}
                          {isSubmitted && mcq.explanation && (
                            <div style={{
                              marginTop: "16px",
                              padding: "14px",
                              background: "#f3f4f6",
                              borderRadius: "8px",
                              fontSize: "16px",
                              lineHeight: "1.6",
                              borderLeft: `4px solid ${isCorrect ? "#22c55e" : "#ef4444"}`,
                              color: isCorrect ? "#22c55e" : "#ef4444",
                              fontWeight: "600",
                            }}>
                              <strong>💡 Explanation:</strong> <span style={{ color: BRAND.primary, fontWeight: "500" }}>{mcq.explanation}</span>
                            </div>
                          )}
                        </div>
                      );
                    })
                  )}
                </div>
              </div>
            )}

            {tab === "casestudy" && (
              <div style={{ position: "relative" }}>
                <h4 style={{ color: BRAND.primary, fontSize: "18px", fontWeight: "700", marginBottom: "16px" }}>
                  📊 Case Study MCQs ({activeCaseStudyMcqs.length})
                </h4>
                
                <div style={{ background: BRAND.card, borderRadius: "12px", border: `1px solid ${BRAND.line}`, padding: "20px", position: "relative" }}>
                  {activeCaseStudyMcqs.length === 0 ? (
                    <p style={{ color: BRAND.subtle, textAlign: "center", fontSize: "14px" }}>
                      No case study questions available for this topic.
                    </p>
                  ) : (
                    <>
                      {activeCaseStudyMcqs.map((mcq, index) => {
                        const questionKey = `casestudy-${index}`;
                        const userAnswer = mcqAnswers[questionKey];
                        const isSubmitted = mcqSubmitted[questionKey];
                        const isCorrect = userAnswer !== null && mcq.correctAnswerIndex === userAnswer;
                        const isLocked = index >= 2;

                        return (
                          <div
                            key={index}
                            style={{
                              marginBottom: "16px",
                              padding: "16px",
                              borderRadius: "8px",
                              border: `1px solid ${BRAND.line}`,
                              background: isSubmitted ? (isCorrect ? `${BRAND.secondary}15` : `${BRAND.primary}08`) : "transparent",
                              position: "relative",
                              filter: isLocked ? "blur(4px)" : "none",
                              pointerEvents: isLocked ? "none" : "auto",
                              opacity: isLocked ? 0.6 : 1,
                            }}
                          >
                            <div style={{ marginBottom: "12px", color: BRAND.primary, fontWeight: "600", fontSize: "14px" }}>
                              {`${index + 1}. ${mcq.question}`}
                            </div>
                            <div>
                              {mcq.options.map((option, i) => (
                                <div
                                  key={i}
                                  onClick={() => {
                                    if (!isLocked && !isSubmitted) {
                                      setMcqAnswers((prev) => ({ ...prev, [questionKey]: i }));
                                    }
                                  }}
                                  style={{
                                    padding: "10px",
                                    borderRadius: "6px",
                                    cursor: isLocked || isSubmitted ? "not-allowed" : "pointer",
                                    background: userAnswer === i ? (isSubmitted ? (isCorrect ? `${BRAND.secondary}20` : `${BRAND.primary}15`) : `${BRAND.primary}15`) : "transparent",
                                    border: `1px solid ${userAnswer === i ? (isSubmitted ? (isCorrect ? BRAND.secondary : BRAND.primary) : BRAND.primary) : "transparent"}`,
                                    color: userAnswer === i ? (isSubmitted ? (isCorrect ? BRAND.secondary : BRAND.primary) : BRAND.primary) : BRAND.subtle,
                                    marginBottom: "8px",
                                    position: "relative",
                                    fontSize: "13px",
                                  }}
                                >
                                  {option}
                                  {isSubmitted && i === mcq.correctAnswerIndex && !isLocked && (
                                    <span style={{ position: "absolute", right: "10px", top: "50%", transform: "translateY(-50%)", fontSize: "16px", color: BRAND.secondary }}>
                                      ✓
                                    </span>
                                  )}
                                </div>
                              ))}
                            </div>

                            {/* Check Answer Button */}
                            {!isSubmitted && !isLocked && userAnswer !== null && (
                              <button
                                onClick={() => setMcqSubmitted((prev) => ({ ...prev, [questionKey]: true }))}
                                style={{
                                  marginTop: "12px",
                                  padding: "10px 20px",
                                  background: BRAND.primary,
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "6px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  fontSize: "14px",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                Check Answer
                              </button>
                            )}

                            {/* Explanation - Only show after submission */}
                            {isSubmitted && mcq.explanation && !isLocked && (
                              <div style={{ marginTop: "12px", padding: "12px", background: isCorrect ? `${BRAND.secondary}15` : `${BRAND.primary}10`, borderRadius: "6px", fontSize: "13px", lineHeight: "1.5", borderLeft: `3px solid ${isCorrect ? BRAND.secondary : BRAND.primary}` }}>
                                <strong style={{ color: isCorrect ? BRAND.secondary : BRAND.primary }}>💡 Explanation:</strong> {mcq.explanation}
                              </div>
                            )}
                          </div>
                        );
                      })}

                      {/* Lock Overlay for Questions 3+ */}
                      {activeCaseStudyMcqs.length > 2 && (
                        <div
                          style={{
                            position: "absolute",
                            top: "50%",
                            left: "50%",
                            transform: "translate(-50%, -50%)",
                            textAlign: "center",
                            zIndex: 10,
                            pointerEvents: "auto",
                          }}
                        >
                          <div style={{ background: "rgba(255, 255, 255, 0.95)", padding: "40px 30px", borderRadius: "16px", border: `2px solid ${BRAND.primary}`, boxShadow: BRAND.glow }}>
                            <div style={{ fontSize: "64px", marginBottom: "16px" }}>🔒</div>
                            <h4 style={{ color: BRAND.primary, fontSize: "24px", fontWeight: "700", marginBottom: "12px" }}>
                              Premium Case Studies
                            </h4>
                            <p style={{ color: BRAND.subtle, fontSize: "15px", marginBottom: "8px" }}>
                              You have viewed <strong>2 of {activeCaseStudyMcqs.length}</strong> case study questions.
                            </p>
                            <p style={{ color: BRAND.subtle, fontSize: "15px", marginBottom: "24px" }}>
                              Sign in or upgrade to access all {activeCaseStudyMcqs.length} clinical case studies.
                            </p>
                            <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
                              <button
                                onClick={() => window.location.href = "/sign-in"}
                                style={{
                                  padding: "14px 28px",
                                  background: BRAND.primary,
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "8px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                🔓 Sign In to Access
                              </button>
                              <button
                                onClick={() => alert("Razorpay payment integration coming soon!")}
                                style={{
                                  padding: "14px 28px",
                                  background: BRAND.secondary,
                                  color: "#fff",
                                  border: "none",
                                  borderRadius: "8px",
                                  fontWeight: "600",
                                  cursor: "pointer",
                                  fontSize: "16px",
                                  transition: "all 0.3s ease",
                                }}
                              >
                                💳 Purchase Full Access
                              </button>
                            </div>
                            <p style={{ color: BRAND.subtle, fontSize: "13px", marginTop: "16px" }}>
                              ⭐ Lifetime access • 📊 All case studies • 🎓 Expert explanations
                            </p>
                          </div>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT SIDEBAR - Upcoming Lessons */}
          <div
            style={{
              background: isMobile ? "#fff" : BRAND.card,
              borderRadius: isMobile ? "12px" : "16px",
              padding: isMobile ? "16px" : "28px",
              border: isMobile ? "1px solid #e2e8f0" : `1px solid ${BRAND.line}`,
              marginTop: isMobile ? "22px" : undefined,
              maxWidth: isMobile ? "100vw" : undefined,
              position: !isMobile ? "sticky" : undefined,
              top: !isMobile ? "24px" : undefined,
              maxHeight: !isMobile ? "calc(100vh - 100px)" : undefined,
              overflowY: !isMobile ? "auto" : undefined,
              fontSize: "18px",
            }}
          >
            <h3 style={{ color: BRAND.primary, fontSize: isMobile ? "20px" : "22px", fontWeight: "700", marginBottom: isMobile ? "16px" : "22px", display: "flex", alignItems: "center", gap: "8px" }}>
              <span style={{ fontSize: isMobile ? "22px" : "26px" }}>⏭️</span> Upcoming
            </h3>
            {/* Show first chapter's first topic as next if on Introduction */}
            {selected.chapter === -1 && chapters.length > 0 && chapters[0].topics && chapters[0].topics.length > 0 && (
              <div style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: "700", color: BRAND.primary, fontSize: "13px", marginBottom: "8px", paddingLeft: "8px", borderLeft: `3px solid ${BRAND.primary}` }}>
                  Start Learning
                </div>
                <div
                  onClick={() => setSelected({ chapter: 0, topic: 0, subtopic: 0 })}
                  style={{
                    padding: "8px 10px",
                    marginBottom: "6px",
                    borderRadius: "8px",
                    cursor: "pointer",
                    background: `${BRAND.secondary}10`,
                    border: `1px solid ${BRAND.secondary}`,
                    fontSize: "12px",
                    color: BRAND.secondary,
                    fontWeight: "600",
                    transition: "all 0.2s ease",
                  }}
                >
                  {chapters[0].topics[0].topic || "Topic 1"}
                  <span style={{ marginLeft: "8px" }}>→</span>
                </div>
              </div>
            )}
            
            {/* Regular upcoming topics */}
            {chapters.map((ch, ci) => (
              <div key={ci} style={{ marginBottom: "12px" }}>
                <div style={{ fontWeight: "700", color: BRAND.primary, fontSize: "15px", marginBottom: "8px", paddingLeft: "8px", borderLeft: `3px solid ${BRAND.primary}` }}>
                  {ch.chapter}
                </div>
                {(ch.topics || []).slice(0, 3).map((tp, ti) => {
                  const isNext = ci === selected.chapter && ti === selected.topic + 1;
                  return (
                    <div
                      key={ti}
                      onClick={() => {
                        setSelected({ chapter: ci, topic: ti, subtopic: 0 });
                        // Auto-switch to materials tab when clicking upcoming topics
                        if (tp.youtubeUrl || tp.pdf) {
                          setTab("materials");
                        }
                      }}
                      style={{
                        padding: "8px 10px",
                        marginBottom: "6px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        background: isNext ? `${BRAND.secondary}10` : BRAND.bg,
                        border: `1px solid ${isNext ? BRAND.secondary : BRAND.line}`,
                        fontSize: "15px",
                        color: isNext ? BRAND.secondary : BRAND.subtle,
                        fontWeight: isNext ? "600" : "500",
                        transition: "all 0.2s ease",
                      }}
                    >
                      {tp.topic || `Topic ${ti + 1}`}
                      {isNext && <span style={{ marginLeft: "8px" }}>→</span>}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>
        </div>
      </div>
      {/* Responsive styles for mobile */}
      <style jsx>{`
        @media (max-width: 900px) {
          .course-details-mobile-sidebar {
            display: block !important;
            background: #fff;
            border-radius: 12px;
            margin-bottom: 18px;
            padding: 12px;
            border: 1px solid #e2e8f0;
            overflow-x: auto;
            max-width: 100vw;
          }
        }
        @media (max-width: 600px) {
          .course-details-mobile-sidebar {
            padding: 8px;
            border-radius: 8px;
          }
        }
      `}</style>
    </>
  );
};

export default CourseDetailsPage;

// Utility to extract YouTube video ID from any URL or raw ID
function getYouTubeId(input?: string | null): string | null {
  if (!input) return null;
  const raw = input.trim();
  if (/^[a-zA-Z0-9_-]{11}$/.test(raw)) return raw;
  try {
    const url = new URL(raw);
    const v = url.searchParams.get("v");
    if (v && /^[a-zA-Z0-9_-]{11}$/.test(v)) return v;
    const parts = url.pathname.split("/").filter(Boolean).reverse();
    for (const seg of parts) {
      if (/^[a-zA-Z0-9_-]{11}$/.test(seg)) return seg;
    }
    return null;
  } catch {
    return null;
  }
}
