"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button, Form } from "react-bootstrap";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
import * as XLSX from "xlsx";
import { useSession } from "next-auth/react";

// ============================================================================
// INTERFACES
// ============================================================================

interface MCQ {
  id?: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
}

interface Subtopic {
  title: string;
  youtubeUrl: string;
  pdfAccess: string;
  pdf: File | string | null;
  caseStudyMcqs?: MCQ[];
}

interface Topic {
  topic: string;
  hasSubtopics: boolean;
  youtubeUrl?: string;
  pdfAccess?: string;
  pdf?: File | string | null;
  caseStudyMcqs?: MCQ[];
  subtopics?: Subtopic[];
}

interface Chapter {
  chapter: string;
  topics: Topic[];
}

interface Curriculum {
  id?: string;
  subject: string;
  introVideoUrl?: string;
  mcqs?: MCQ[];
  chapters: Chapter[];
  courseId?: string;
  instructorId?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

const UploadContent = () => {
  // ========================================================================

  // STATE MANAGEMENT
  // ========================================================================
  const { data: session } = useSession();
  const [courseId, setCourseId] = useState<string>("");
  const [courses, setCourses] = useState<{ id: string; title: string; instructorId?: string; instructorName?: string }[]>([]);
  // Fetch courses for dropdown
  useEffect(() => {
    if (!session) return; // Wait for session to load
    const fetchCourses = async () => {
      try {
        const res = await fetch("/api/courses");
        const data = await res.json();
        // Debug: log what you get
        console.log("Fetched courses:", data);
        console.log("Session user:", session?.user);

        // Show all courses for admin/instructor, only own for course_uploader
        let filteredCourses = [];
        if (session?.user?.role === "course_uploader") {
          filteredCourses = Array.isArray(data)
            ? data.filter(
                (course: any) =>
                  (course.instructorId && course.instructorId === session?.user?.id) ||
                  (course.instructorName && course.instructorName === session?.user?.name)
              )
            : [];
        } else {
          filteredCourses = Array.isArray(data) ? data : [];
        }
        
        setCourses(filteredCourses);
        
        // Auto-select if only one course available
        if (filteredCourses.length === 1 && !courseId) {
          setCourseId(filteredCourses[0].id);
          console.log("Auto-selected course:", filteredCourses[0].title, filteredCourses[0].id);
        }
      } catch (e) {
        setCourses([]);
      }
    };
    fetchCourses();
  }, [session, courseId]);
  const [curriculum, setCurriculum] = useState<Curriculum[]>([
    {
      subject: "",
      introVideoUrl: "",
      mcqs: [],
      chapters: [
        {
          chapter: "",
          topics: [
            {
              topic: "",
              hasSubtopics: false,
              youtubeUrl: "",
              pdfAccess: "VIEW",
              pdf: null,
            },
          ],
        },
      ],
    }
  ]);

  const [allCurriculums, setAllCurriculums] = useState<Curriculum[]>([]);
  const [editCurriculum, setEditCurriculum] = useState<Curriculum | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingCurriculums, setLoadingCurriculums] = useState(false);

  // ========================================================================
  // EFFECTS & API CALLS
  // ========================================================================
  const fetchCurriculums = useCallback(async () => {
    setLoadingCurriculums(true);
    try {
      if (!courseId) return;
      const res = await fetch(`/api/curriculum?courseId=${courseId}`);
      const data = await res.json();
      setAllCurriculums(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error("Error fetching curriculums:", error);
    } finally {
      setLoadingCurriculums(false);
    }
  }, [courseId]);

  useEffect(() => {
    if (courseId && session?.user?.id) {
      fetchCurriculums();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [courseId, session?.user?.id]);

  // ========================================================================
  // FILE UPLOAD UTILITIES
  // ========================================================================
  const handleFileUpload = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append("file", file);

    const res = await fetch("/api/upload-file", {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const text = await res.text().catch(() => "");
      throw new Error(`Upload failed (${res.status}) ${text}`);
    }

    const data = await res.json();
    if (!data || typeof data.url !== "string") {
      throw new Error("Upload response missing 'url'");
    }
    return data.url;
  };

  // ========================================================================
  // FORM HANDLERS
  // ========================================================================
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      const src = curriculum[0];
      if (!src.subject || !src.subject.trim()) throw new Error("Subject name is required");
      if (!src.chapters || src.chapters.length === 0) throw new Error("At least one chapter is required");
      if (!courseId) throw new Error("Please select a course");
      if (!session?.user?.id) throw new Error("User not authenticated");

      const chapters = await Promise.all(
        (src.chapters || []).map(async (chapter) => {
          const processedTopics = await Promise.all(
            (chapter.topics || []).map(async (t) => {
              if (t.hasSubtopics) {
                const processedSubtopics = await Promise.all(
                  (t.subtopics || []).map(async (s) => {
                    let pdfUrl: string | null = null;
                    if (s.pdf instanceof File) pdfUrl = await handleFileUpload(s.pdf);
                    else if (typeof s.pdf === "string" && s.pdf.trim()) pdfUrl = s.pdf;
                    return {
                      title: s.title || "",
                      youtubeUrl: s.youtubeUrl || "",
                      pdfAccess: s.pdfAccess || "VIEW",
                      pdf: pdfUrl,
                      ...(s.caseStudyMcqs?.length ? { caseStudyMcqs: s.caseStudyMcqs } : {}),
                    };
                  })
                );
                return {
                  topic: t.topic || "",
                  hasSubtopics: true,
                  subtopics: processedSubtopics,
                };
              } else {
                let topicPdfUrl: string | null = null;
                if (t.pdf instanceof File) topicPdfUrl = await handleFileUpload(t.pdf);
                else if (typeof t.pdf === "string" && t.pdf.trim()) topicPdfUrl = t.pdf;
                return {
                  topic: t.topic || "",
                  hasSubtopics: false,
                  youtubeUrl: t.youtubeUrl || "",
                  pdfAccess: t.pdfAccess || "VIEW",
                  pdf: topicPdfUrl,
                  ...(t.caseStudyMcqs?.length ? { caseStudyMcqs: t.caseStudyMcqs } : {}),
                };
              }
            })
          );
          return {
            chapter: chapter.chapter || "",
            topics: processedTopics,
          };
        })
      );

      const payload = { ...src, chapters, courseId, instructorId: session?.user?.id };
      
      console.log("📤 Uploading curriculum with payload:", {
        subject: payload.subject,
        courseId: payload.courseId,
        instructorId: payload.instructorId,
        chaptersCount: chapters.length
      });
      
      const res = await fetch("/api/curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to save curriculum");
      setSuccessMessage("Curriculum uploaded successfully!");
      setCurriculum([
        {
          subject: "",
          introVideoUrl: "",
          mcqs: [],
          chapters: [
            {
              chapter: "",
              topics: [
                { topic: "", hasSubtopics: false, youtubeUrl: "", pdfAccess: "VIEW", pdf: null },
              ],
            },
          ],
        },
      ]);
      fetchCurriculums();
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  // ========================================================================
  // MAIN RENDER
  // ========================================================================
  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        backgroundImage: "url(/assets/img/bg/instructor_dashboard_bg.png)",
        backgroundPosition: "center top",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
      }}
    >
      {/* PAGE CONTENT (SIDEBAR LEFT, CONTENT RIGHT) */}
      <main style={{ flex: 1 }}>
        <div className="container-fluid" style={{ paddingTop: 24, paddingBottom: 24 }}>
          <div className="row g-3 align-items-start">
            {/* Sidebar */}
            <div className="col-12 col-xl-3">
              <div
                style={{
                  position: "sticky",
                  top: 16,
                  height: "calc(100vh - 32px)",
                  overflowY: "auto",
                  borderRadius: 16,
                  background: "rgba(255,255,255,0.95)",
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 4px 18px rgba(13,68,122,0.08)",
                }}
              >
                {/* optional top strip / header area inside sidebar */}
                <div
                  style={{
                    padding: 14,
                    borderBottom: "1px solid #e5e7eb",
                    background: "rgba(255,255,255,0.9)",
                    borderTopLeftRadius: 16,
                    borderTopRightRadius: 16,
                  }}
                >
                  <div style={{ fontWeight: 600 }}>Dashboard</div>
                </div>

                <div style={{ padding: 12 }}>
                  <DashboardSidebar />
                </div>
              </div>
            </div>

            {/* Main Content */}
            <div className="col-12 col-xl-9">
              <div
                style={{
                  background: "rgba(255,255,255,0.98)",
                  borderRadius: 16,
                  border: "1px solid #e5e7eb",
                  boxShadow: "0 6px 26px rgba(13,68,122,0.10)",
                  padding: 20,
                }}
              >
                <h3 className="mb-3">Upload Curriculum</h3>

                {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
                {successMessage && <div className="alert alert-success">{successMessage}</div>}

                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label>Select Course</Form.Label>
                    <Form.Select value={courseId} onChange={e => {
                      const selectedId = e.target.value;
                      setCourseId(selectedId);
                      const selectedCourse = courses.find(c => c.id === selectedId);
                      console.log('Selected course:', selectedCourse);
                    }} required>
                      <option value="">-- Select a course --</option>
                      {courses.length === 0 && (
                        <option disabled value="">No courses found for your account</option>
                      )}
                      {courses.map(c => (
                        <option key={c.id} value={c.id}>
                          {c.title} {c.instructorName ? `(by ${c.instructorName})` : ''} - {c.id.slice(-8)}
                        </option>
                      ))}
                    </Form.Select>
                    {courseId && (
                      <Form.Text className="text-muted">
                        Selected Course ID: {courseId}
                      </Form.Text>
                    )}
                  </Form.Group>
                  <Form.Group className="mb-3">
                    <Form.Label>Subject</Form.Label>
                    <Form.Control
                      value={curriculum[0].subject}
                      onChange={(e) => {
                        const next = [...curriculum];
                        next[0].subject = e.target.value;
                        setCurriculum(next);
                      }}
                      placeholder="Enter subject name"
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label>Intro Video URL</Form.Label>
                    <Form.Control
                      value={curriculum[0].introVideoUrl || ""}
                      onChange={(e) => {
                        const next = [...curriculum];
                        next[0].introVideoUrl = e.target.value;
                        setCurriculum(next);
                      }}
                      placeholder="https://youtube.com/..."
                    />
                  </Form.Group>

                  {/* Chapters / Topics / Subtopics */}
                  {curriculum[0].chapters.map((chapter, j) => (
                    <div key={j} className="border rounded p-3 mb-4 bg-light">
                      <Form.Group className="mb-2">
                        <Form.Label>Chapter {j + 1}</Form.Label>
                        <Form.Control
                          value={chapter.chapter}
                          onChange={(e) => {
                            const next = [...curriculum];
                            next[0].chapters[j].chapter = e.target.value;
                            setCurriculum(next);
                          }}
                          placeholder="Enter chapter title"
                        />
                      </Form.Group>

                      {chapter.topics.map((topic, k) => (
                        <div key={k} className="bg-white p-3 rounded mb-2 border">
                          <Form.Group className="mb-2">
                            <Form.Label>Topic {k + 1}</Form.Label>
                            <Form.Control
                              value={topic.topic}
                              onChange={(e) => {
                                const next = [...curriculum];
                                next[0].chapters[j].topics[k].topic = e.target.value;
                                setCurriculum(next);
                              }}
                              placeholder="Enter topic name"
                            />
                          </Form.Group>

                          <Form.Group className="mb-2">
                            <Form.Label>Has Subtopics?</Form.Label>
                            <div>
                              <Form.Check
                                inline
                                label="Yes"
                                type="radio"
                                name={`subtopic-${j}-${k}`}
                                checked={topic.hasSubtopics}
                                onChange={() => {
                                  const next = [...curriculum];
                                  next[0].chapters[j].topics[k].hasSubtopics = true;
                                  if (!next[0].chapters[j].topics[k].subtopics) {
                                    next[0].chapters[j].topics[k].subtopics = [
                                      { title: "", youtubeUrl: "", pdfAccess: "VIEW", pdf: null },
                                    ];
                                  }
                                  setCurriculum(next);
                                }}
                              />
                              <Form.Check
                                inline
                                label="No"
                                type="radio"
                                name={`subtopic-${j}-${k}`}
                                checked={!topic.hasSubtopics}
                                onChange={() => {
                                  const next = [...curriculum];
                                  next[0].chapters[j].topics[k].hasSubtopics = false;
                                  delete next[0].chapters[j].topics[k].subtopics;
                                  setCurriculum(next);
                                }}
                              />
                            </div>
                          </Form.Group>

                          {/* Subtopics */}
                          {topic.hasSubtopics &&
                            topic.subtopics &&
                            topic.subtopics.map((sub, s) => (
                              <div key={s} className="p-2 mb-2 bg-info bg-opacity-10 rounded border">
                                <Form.Group className="mb-2">
                                  <Form.Label>Subtopic {s + 1}</Form.Label>
                                  <Form.Control
                                    value={sub.title}
                                    onChange={(e) => {
                                      const next = [...curriculum];
                                      if (next[0].chapters[j].topics[k].subtopics?.[s]) {
                                        next[0].chapters[j].topics[k].subtopics![s].title = e.target.value;
                                      }
                                      setCurriculum(next);
                                    }}
                                    placeholder="Enter subtopic title"
                                  />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                  <Form.Label>YouTube Link</Form.Label>
                                  <Form.Control
                                    value={sub.youtubeUrl}
                                    onChange={(e) => {
                                      const next = [...curriculum];
                                      if (next[0].chapters[j].topics[k].subtopics?.[s]) {
                                        next[0].chapters[j].topics[k].subtopics![s].youtubeUrl = e.target.value;
                                      }
                                      setCurriculum(next);
                                    }}
                                    placeholder="YouTube link"
                                  />
                                </Form.Group>

                                <Form.Group className="mb-2">
                                  <Form.Label>PDF</Form.Label>
                                  <div className="d-flex gap-2 flex-wrap">
                                    <Form.Select
                                      value={sub.pdfAccess}
                                      onChange={(e) => {
                                        const next = [...curriculum];
                                        if (next[0].chapters[j].topics[k].subtopics?.[s]) {
                                          next[0].chapters[j].topics[k].subtopics![s].pdfAccess = e.target.value;
                                        }
                                        setCurriculum(next);
                                      }}
                                      style={{ maxWidth: 140 }}
                                    >
                                      <option value="VIEW">VIEW</option>
                                      <option value="DOWNLOAD">DOWNLOAD</option>
                                      <option value="PAID">PAID</option>
                                    </Form.Select>

                                    <Form.Control
                                      type="file"
                                      style={{ maxWidth: 280 }}
                                      onChange={(e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0] || null;
                                        const next = [...curriculum];
                                        if (next[0].chapters[j].topics[k].subtopics?.[s]) {
                                          next[0].chapters[j].topics[k].subtopics![s].pdf = file;
                                        }
                                        setCurriculum(next);
                                      }}
                                    />
                                  </div>
                                </Form.Group>
                              </div>
                            ))}

                          {/* Add Subtopic */}
                          {topic.hasSubtopics && (
                            <Button
                              size="sm"
                              variant="outline-info"
                              className="mb-2"
                              onClick={() => {
                                const next = [...curriculum];
                                if (!next[0].chapters[j].topics[k].subtopics) next[0].chapters[j].topics[k].subtopics = [];
                                next[0].chapters[j].topics[k].subtopics!.push({
                                  title: "",
                                  youtubeUrl: "",
                                  pdfAccess: "VIEW",
                                  pdf: null,
                                });
                                setCurriculum(next);
                              }}
                            >
                              ＋ Add Subtopic
                            </Button>
                          )}

                          {/* Direct Topic Content */}
                          {!topic.hasSubtopics && (
                            <>
                              <Form.Group className="mb-2">
                                <Form.Label>YouTube Link</Form.Label>
                                <Form.Control
                                  value={topic.youtubeUrl || ""}
                                  onChange={(e) => {
                                    const next = [...curriculum];
                                    next[0].chapters[j].topics[k].youtubeUrl = e.target.value;
                                    setCurriculum(next);
                                  }}
                                  placeholder="YouTube link"
                                />
                              </Form.Group>

                              <Form.Group className="mb-2">
                                <Form.Label>PDF</Form.Label>
                                <div className="d-flex gap-2 flex-wrap">
                                  <Form.Select
                                    value={topic.pdfAccess || "VIEW"}
                                    onChange={(e) => {
                                      const next = [...curriculum];
                                      next[0].chapters[j].topics[k].pdfAccess = e.target.value;
                                      setCurriculum(next);
                                    }}
                                    style={{ maxWidth: 140 }}
                                  >
                                    <option value="VIEW">VIEW</option>
                                    <option value="DOWNLOAD">DOWNLOAD</option>
                                    <option value="PAID">PAID</option>
                                  </Form.Select>

                                  <Form.Control
                                    type="file"
                                    style={{ maxWidth: 280 }}
                                    onChange={(e) => {
                                      const file = (e.target as HTMLInputElement).files?.[0] || null;
                                      const next = [...curriculum];
                                      next[0].chapters[j].topics[k].pdf = file;
                                      setCurriculum(next);
                                    }}
                                  />
                                </div>
                              </Form.Group>
                            </>
                          )}

                          {/* Add Topic */}
                          <Button
                            size="sm"
                            variant="outline-success"
                            className="mt-2"
                            onClick={() => {
                              const next = [...curriculum];
                              next[0].chapters[j].topics.push({
                                topic: "",
                                hasSubtopics: false,
                                youtubeUrl: "",
                                pdfAccess: "VIEW",
                                pdf: null,
                              });
                              setCurriculum(next);
                            }}
                          >
                            ＋ Add Topic
                          </Button>
                        </div>
                      ))}

                      {/* Add Chapter */}
                      <Button
                        size="sm"
                        variant="outline-primary"
                        className="mt-2"
                        onClick={() => {
                          const next = [...curriculum];
                          next[0].chapters.push({
                            chapter: "",
                            topics: [{ topic: "", hasSubtopics: false, youtubeUrl: "", pdfAccess: "VIEW", pdf: null }],
                          });
                          setCurriculum(next);
                        }}
                      >
                        ＋ Add Chapter
                      </Button>
                    </div>
                  ))}

                  <Button type="submit" disabled={saving} className="mt-3">
                    {saving ? "Saving..." : "Save Curriculum"}
                  </Button>
                </Form>

                <hr className="my-4" />

                <h5 className="mb-2">Existing Curriculums</h5>
                {loadingCurriculums ? (
                  <p>Loading...</p>
                ) : (
                  <ul className="mb-0">
                    {allCurriculums.map((c, idx) => (
                      <li key={c.id ?? idx}>{c.subject}</li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER (ke
      pt outside sticky grid so it never overlaps content) */}
      <footer
        style={{
          background: "rgba(255,255,255,0.92)",
          borderTop: "1px solid #e5e7eb",
          padding: "14px 18px",
        }}
      >
        <div className="container-fluid">
          <div style={{ fontSize: 13, color: "#334155" }}>
            © {new Date().getFullYear()} Your Company. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UploadContent;
