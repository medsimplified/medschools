"use client";

import React, { useEffect, useState, useCallback } from "react";
import { Button, Form, Modal, Table } from "react-bootstrap";
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
  createdAt?: string;
  updatedAt?: string;
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
  const [showEditModal, setShowEditModal] = useState(false);
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
      // Add cache-busting timestamp to force fresh data
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/curriculum?courseId=${courseId}&t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await res.json();
      console.log('Fetched curriculums:', data);
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
  // EXCEL IMPORT HANDLER
  // ========================================================================
  const handleExcelImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const data = new Uint8Array(event.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        const jsonData = XLSX.utils.sheet_to_json(worksheet);

        // Parse Excel data into curriculum structure
        // Expected columns: Chapter, Topic, HasSubtopics, Subtopic, YouTubeURL, PDFAccess
        const chapters: Chapter[] = [];
        let currentChapter: Chapter | null = null;
        let currentTopic: Topic | null = null;

        jsonData.forEach((row: any) => {
          // New chapter
          if (row.Chapter && row.Chapter !== currentChapter?.chapter) {
            // Save previous topic to previous chapter
            if (currentChapter && currentTopic) {
              (currentChapter as Chapter).topics.push(currentTopic as Topic);
              currentTopic = null;
            }
            // Save previous chapter
            if (currentChapter) {
              chapters.push(currentChapter as Chapter);
            }
            // Create new chapter
            currentChapter = {
              chapter: row.Chapter,
              topics: [],
            };
            currentTopic = null;
          }

          // New topic
          if (row.Topic && currentChapter) {
            // Save previous topic to current chapter
            if (currentTopic && currentTopic.topic !== row.Topic) {
              (currentChapter as Chapter).topics.push(currentTopic as Topic);
              currentTopic = null;
            }
            
            // Create new topic if needed
            if (!currentTopic) {
              const hasSubtopics = row.HasSubtopics?.toLowerCase() === 'yes' || row.HasSubtopics?.toLowerCase() === 'true';
              currentTopic = {
                topic: row.Topic,
                hasSubtopics,
                youtubeUrl: hasSubtopics ? undefined : (row.YouTubeURL || ''),
                pdfAccess: hasSubtopics ? undefined : (row.PDFAccess || 'VIEW'),
                pdf: null,
                subtopics: hasSubtopics ? [] : undefined,
              };
            }

            // Add subtopic if exists
            if (row.Subtopic && currentTopic && currentTopic.hasSubtopics && currentTopic.subtopics) {
              currentTopic.subtopics.push({
                title: row.Subtopic,
                youtubeUrl: row.YouTubeURL || '',
                pdfAccess: row.PDFAccess || 'VIEW',
                pdf: null,
              });
            }
          }
        });

        // Push last chapter and topic
        if (currentChapter && currentTopic) {
          (currentChapter as Chapter).topics.push(currentTopic as Topic);
        }
        if (currentChapter) {
          chapters.push(currentChapter as Chapter);
        }

        // Update curriculum state
        const next = [...curriculum];
        next[0].chapters = chapters;
        setCurriculum(next);
        setSuccessMessage(`Excel imported successfully! ${chapters.length} chapters loaded.`);
      } catch (err) {
        setErrorMessage(`Failed to parse Excel: ${err instanceof Error ? err.message : 'Unknown error'}`);
      }
    };
    reader.readAsArrayBuffer(file);
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
      
      const savedCurriculum = await res.json();
      console.log('Curriculum saved:', savedCurriculum);
      
      setSuccessMessage("Curriculum uploaded successfully! Refreshing list...");
      
      // Reset form
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
      
      // Force immediate refresh
      await fetchCurriculums();
      setSuccessMessage("Curriculum uploaded successfully!");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Unknown error");
    } finally {
      setSaving(false);
    }
  };

  // ========================================================================
  // EDIT & DELETE HANDLERS
  // ========================================================================
  const handleEditClick = (curriculum: Curriculum) => {
    setEditCurriculum(curriculum);
    setShowEditModal(true);
  };

  const handleEditSubmit = async () => {
    if (!editCurriculum || !editCurriculum.id) return;
    
    setErrorMessage(null);
    setSuccessMessage(null);
    setSaving(true);

    try {
      const res = await fetch(`/api/curriculum/${editCurriculum.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: editCurriculum.subject,
          introVideoUrl: editCurriculum.introVideoUrl,
          mcqs: editCurriculum.mcqs,
          chapters: editCurriculum.chapters,
        }),
      });

      if (!res.ok) throw new Error("Failed to update curriculum");
      
      const updatedData = await res.json();
      console.log('Curriculum updated:', updatedData);
      
      setShowEditModal(false);
      setEditCurriculum(null);
      
      // Force immediate refresh
      await fetchCurriculums();
      setSuccessMessage("Curriculum updated successfully!");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to update curriculum");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this curriculum? This action cannot be undone.")) {
      return;
    }

    try {
      const res = await fetch(`/api/curriculum/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete curriculum");
      
      console.log('Curriculum deleted:', id);
      
      // Force immediate refresh
      await fetchCurriculums();
      setSuccessMessage("Curriculum deleted successfully!");
    } catch (err) {
      setErrorMessage(err instanceof Error ? err.message : "Failed to delete curriculum");
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

                {/* Excel Import Section */}
                <div className="alert alert-info mb-4">
                  <h6 className="mb-2">📊 Bulk Import from Excel</h6>
                  <p className="mb-2 small">
                    Import curriculum structure from Excel file. Required columns: 
                    <strong> Chapter, Topic, HasSubtopics, Subtopic, YouTubeURL, PDFAccess</strong>
                  </p>
                  <Form.Control
                    type="file"
                    accept=".xlsx,.xls"
                    onChange={handleExcelImport}
                    className="mb-2"
                  />
                  <Form.Text className="text-muted">
                    After import, you can still manually edit chapters/topics below before saving.
                  </Form.Text>
                </div>

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

                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="mb-0">Existing Curriculums</h5>
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => fetchCurriculums()}
                    disabled={loadingCurriculums}
                  >
                    {loadingCurriculums ? '🔄 Refreshing...' : '🔄 Refresh List'}
                  </Button>
                </div>
                {loadingCurriculums ? (
                  <p>Loading...</p>
                ) : allCurriculums.length === 0 ? (
                  <p className="text-muted">No curriculums found for this course.</p>
                ) : (
                  <div className="table-responsive">
                    <Table striped bordered hover>
                      <thead>
                        <tr>
                          <th>Subject</th>
                          <th>Chapters</th>
                          <th>Topics</th>
                          <th>Created</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {allCurriculums.map((c) => {
                          const chaptersCount = c.chapters?.length || 0;
                          const topicsCount = c.chapters?.reduce((sum, ch) => sum + (ch.topics?.length || 0), 0) || 0;
                          const createdDate = c.createdAt ? new Date(c.createdAt).toLocaleDateString() : 'N/A';
                          
                          return (
                            <tr key={c.id}>
                              <td style={{ fontWeight: 600 }}>{c.subject}</td>
                              <td>{chaptersCount}</td>
                              <td>{topicsCount}</td>
                              <td>{createdDate}</td>
                              <td>
                                <div className="d-flex gap-2">
                                  <Button
                                    size="sm"
                                    variant="primary"
                                    onClick={() => handleEditClick(c)}
                                  >
                                    Edit
                                  </Button>
                                  <Button
                                    size="sm"
                                    variant="danger"
                                    onClick={() => c.id && handleDelete(c.id)}
                                  >
                                    Delete
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </Table>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* EDIT MODAL */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="xl" centered>
        <Modal.Header closeButton>
          <Modal.Title>Edit Curriculum - Full Details</Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ maxHeight: '75vh', overflowY: 'auto' }}>
          {editCurriculum && (
            <Form>
              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Subject</Form.Label>
                <Form.Control
                  type="text"
                  value={editCurriculum.subject}
                  onChange={(e) => setEditCurriculum({ ...editCurriculum, subject: e.target.value })}
                  required
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="fw-semibold">Intro Video URL</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="https://www.youtube.com/watch?v=..."
                  value={editCurriculum.introVideoUrl || ''}
                  onChange={(e) => setEditCurriculum({ ...editCurriculum, introVideoUrl: e.target.value })}
                />
              </Form.Group>

              <h6 className="mt-4 mb-3 fw-bold">Chapters & Topics</h6>
              {editCurriculum.chapters?.map((chapter, chIndex) => (
                <div key={chIndex} className="border p-3 mb-3 rounded bg-light">
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-semibold">Chapter {chIndex + 1}</Form.Label>
                    <Form.Control
                      type="text"
                      value={chapter.chapter}
                      onChange={(e) => {
                        const updatedChapters = [...editCurriculum.chapters];
                        updatedChapters[chIndex].chapter = e.target.value;
                        setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                      }}
                      required
                    />
                  </Form.Group>

                  {chapter.topics?.map((topic, tIndex) => (
                    <div key={tIndex} className="bg-white p-3 rounded mb-3 border">
                      <Form.Group className="mb-2">
                        <Form.Label className="fw-semibold" style={{ fontSize: '0.95rem' }}>
                          Topic {tIndex + 1}
                        </Form.Label>
                        <Form.Control
                          type="text"
                          size="sm"
                          value={topic.topic}
                          onChange={(e) => {
                            const updatedChapters = [...editCurriculum.chapters];
                            updatedChapters[chIndex].topics[tIndex].topic = e.target.value;
                            setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                          }}
                          required
                        />
                      </Form.Group>

                      <Form.Group className="mb-2">
                        <Form.Label style={{ fontSize: '0.9rem' }}>Has Subtopics?</Form.Label>
                        <div>
                          <Form.Check
                            inline
                            label="Yes"
                            type="radio"
                            name={`edit-subtopic-${chIndex}-${tIndex}`}
                            checked={topic.hasSubtopics}
                            onChange={() => {
                              const updatedChapters = [...editCurriculum.chapters];
                              updatedChapters[chIndex].topics[tIndex].hasSubtopics = true;
                              if (!updatedChapters[chIndex].topics[tIndex].subtopics) {
                                updatedChapters[chIndex].topics[tIndex].subtopics = [
                                  { title: "", youtubeUrl: "", pdfAccess: "VIEW", pdf: null },
                                ];
                              }
                              setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                            }}
                          />
                          <Form.Check
                            inline
                            label="No"
                            type="radio"
                            name={`edit-subtopic-${chIndex}-${tIndex}`}
                            checked={!topic.hasSubtopics}
                            onChange={() => {
                              const updatedChapters = [...editCurriculum.chapters];
                              updatedChapters[chIndex].topics[tIndex].hasSubtopics = false;
                              delete updatedChapters[chIndex].topics[tIndex].subtopics;
                              setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                            }}
                          />
                        </div>
                      </Form.Group>

                      {/* SUBTOPICS */}
                      {topic.hasSubtopics && topic.subtopics?.map((sub, sIndex) => (
                        <div key={sIndex} className="p-2 mb-2 bg-info bg-opacity-10 rounded border">
                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: '0.85rem' }}>Subtopic {sIndex + 1}</Form.Label>
                            <Form.Control
                              size="sm"
                              value={sub.title}
                              onChange={(e) => {
                                const updatedChapters = [...editCurriculum.chapters];
                                if (updatedChapters[chIndex].topics[tIndex].subtopics?.[sIndex]) {
                                  updatedChapters[chIndex].topics[tIndex].subtopics![sIndex].title = e.target.value;
                                }
                                setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                              }}
                              placeholder="Subtopic title"
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: '0.85rem' }}>YouTube URL</Form.Label>
                            <Form.Control
                              size="sm"
                              value={sub.youtubeUrl}
                              onChange={(e) => {
                                const updatedChapters = [...editCurriculum.chapters];
                                if (updatedChapters[chIndex].topics[tIndex].subtopics?.[sIndex]) {
                                  updatedChapters[chIndex].topics[tIndex].subtopics![sIndex].youtubeUrl = e.target.value;
                                }
                                setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                              }}
                              placeholder="https://youtube.com/..."
                            />
                          </Form.Group>

                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: '0.85rem' }}>PDF Access</Form.Label>
                            <Form.Select
                              size="sm"
                              value={sub.pdfAccess}
                              onChange={(e) => {
                                const updatedChapters = [...editCurriculum.chapters];
                                if (updatedChapters[chIndex].topics[tIndex].subtopics?.[sIndex]) {
                                  updatedChapters[chIndex].topics[tIndex].subtopics![sIndex].pdfAccess = e.target.value;
                                }
                                setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                              }}
                            >
                              <option value="VIEW">View Only</option>
                              <option value="DOWNLOAD">Download</option>
                              <option value="PAID">Paid</option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: '0.85rem' }}>
                              {typeof sub.pdf === 'string' && sub.pdf ? 'Replace PDF' : 'Upload PDF'}
                            </Form.Label>
                            <Form.Control
                              type="file"
                              size="sm"
                              accept=".pdf"
                              onChange={async (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  // Upload immediately and get URL
                                  try {
                                    const url = await handleFileUpload(file);
                                    const updatedChapters = [...editCurriculum.chapters];
                                    if (updatedChapters[chIndex].topics[tIndex].subtopics?.[sIndex]) {
                                      updatedChapters[chIndex].topics[tIndex].subtopics![sIndex].pdf = url;
                                    }
                                    setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                                  } catch (err) {
                                    alert('Failed to upload PDF: ' + (err instanceof Error ? err.message : 'Unknown error'));
                                  }
                                }
                              }}
                            />
                            {typeof sub.pdf === 'string' && sub.pdf && (
                              <Form.Text className="text-muted d-block">
                                Current: <a href={sub.pdf} target="_blank" rel="noopener noreferrer">View PDF</a>
                              </Form.Text>
                            )}
                          </Form.Group>

                          <Button
                            size="sm"
                            variant="outline-danger"
                            onClick={() => {
                              const updatedChapters = [...editCurriculum.chapters];
                              updatedChapters[chIndex].topics[tIndex].subtopics?.splice(sIndex, 1);
                              setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                            }}
                          >
                            Remove Subtopic
                          </Button>
                        </div>
                      ))}

                      {topic.hasSubtopics && (
                        <Button
                          size="sm"
                          variant="outline-info"
                          className="mb-2"
                          onClick={() => {
                            const updatedChapters = [...editCurriculum.chapters];
                            if (!updatedChapters[chIndex].topics[tIndex].subtopics) {
                              updatedChapters[chIndex].topics[tIndex].subtopics = [];
                            }
                            updatedChapters[chIndex].topics[tIndex].subtopics!.push({
                              title: "",
                              youtubeUrl: "",
                              pdfAccess: "VIEW",
                              pdf: null,
                            });
                            setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                          }}
                        >
                          + Add Subtopic
                        </Button>
                      )}

                      {/* DIRECT TOPIC CONTENT (NO SUBTOPICS) */}
                      {!topic.hasSubtopics && (
                        <>
                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: '0.85rem' }}>YouTube URL</Form.Label>
                            <Form.Control
                              type="text"
                              size="sm"
                              placeholder="https://www.youtube.com/watch?v=..."
                              value={topic.youtubeUrl || ''}
                              onChange={(e) => {
                                const updatedChapters = [...editCurriculum.chapters];
                                updatedChapters[chIndex].topics[tIndex].youtubeUrl = e.target.value;
                                setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                              }}
                            />
                          </Form.Group>
                          
                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: '0.85rem' }}>PDF Access</Form.Label>
                            <Form.Select
                              size="sm"
                              value={topic.pdfAccess || 'VIEW'}
                              onChange={(e) => {
                                const updatedChapters = [...editCurriculum.chapters];
                                updatedChapters[chIndex].topics[tIndex].pdfAccess = e.target.value;
                                setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                              }}
                            >
                              <option value="VIEW">View Only</option>
                              <option value="DOWNLOAD">Download</option>
                              <option value="PAID">Paid</option>
                            </Form.Select>
                          </Form.Group>

                          <Form.Group className="mb-2">
                            <Form.Label style={{ fontSize: '0.85rem' }}>
                              {typeof topic.pdf === 'string' && topic.pdf ? 'Replace PDF' : 'Upload PDF'}
                            </Form.Label>
                            <Form.Control
                              type="file"
                              size="sm"
                              accept=".pdf"
                              onChange={async (e) => {
                                const file = (e.target as HTMLInputElement).files?.[0];
                                if (file) {
                                  try {
                                    const url = await handleFileUpload(file);
                                    const updatedChapters = [...editCurriculum.chapters];
                                    updatedChapters[chIndex].topics[tIndex].pdf = url;
                                    setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                                  } catch (err) {
                                    alert('Failed to upload PDF: ' + (err instanceof Error ? err.message : 'Unknown error'));
                                  }
                                }
                              }}
                            />
                            {typeof topic.pdf === 'string' && topic.pdf && (
                              <Form.Text className="text-muted d-block">
                                Current: <a href={topic.pdf} target="_blank" rel="noopener noreferrer">View PDF</a>
                              </Form.Text>
                            )}
                          </Form.Group>
                        </>
                      )}
                      
                      <Button
                        size="sm"
                        variant="outline-danger"
                        className="mt-2"
                        onClick={() => {
                          const updatedChapters = [...editCurriculum.chapters];
                          updatedChapters[chIndex].topics.splice(tIndex, 1);
                          setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                        }}
                      >
                        Remove Topic
                      </Button>
                    </div>
                  ))}

                  <div className="d-flex gap-2 mt-2">
                    <Button
                      size="sm"
                      variant="outline-success"
                      onClick={() => {
                        const updatedChapters = [...editCurriculum.chapters];
                        updatedChapters[chIndex].topics.push({
                          topic: "",
                          hasSubtopics: false,
                          youtubeUrl: "",
                          pdfAccess: "VIEW",
                          pdf: null,
                        });
                        setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                      }}
                    >
                      + Add Topic
                    </Button>
                    <Button
                      size="sm"
                      variant="outline-danger"
                      onClick={() => {
                        const updatedChapters = editCurriculum.chapters.filter((_, idx) => idx !== chIndex);
                        setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                      }}
                    >
                      Remove Chapter
                    </Button>
                  </div>
                </div>
              ))}

              <Button
                size="sm"
                variant="outline-primary"
                className="mb-3"
                onClick={() => {
                  const updatedChapters = [
                    ...editCurriculum.chapters,
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
                  ];
                  setEditCurriculum({ ...editCurriculum, chapters: updatedChapters });
                }}
              >
                + Add Chapter
              </Button>

              {/* MCQ Editor Section */}
              <hr className="my-4" />
              <h6 className="mb-3 fw-bold">📝 Subject-Level MCQs (Optional)</h6>
              <p className="text-muted small mb-3">
                Add multiple choice questions for the entire subject/curriculum.
              </p>
              
              {editCurriculum.mcqs?.map((mcq, mcqIndex) => (
                <div key={mcqIndex} className="border p-3 mb-3 rounded bg-light">
                  <Form.Group className="mb-2">
                    <Form.Label className="fw-semibold">Question {mcqIndex + 1}</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      value={mcq.question}
                      onChange={(e) => {
                        const updatedMcqs = [...(editCurriculum.mcqs || [])];
                        updatedMcqs[mcqIndex].question = e.target.value;
                        setEditCurriculum({ ...editCurriculum, mcqs: updatedMcqs });
                      }}
                      placeholder="Enter question"
                    />
                  </Form.Group>

                  {mcq.options?.map((option, optIndex) => (
                    <Form.Group key={optIndex} className="mb-2">
                      <Form.Label style={{ fontSize: '0.9rem' }}>Option {optIndex + 1}</Form.Label>
                      <div className="d-flex gap-2">
                        <Form.Check
                          type="radio"
                          name={`mcq-${mcqIndex}`}
                          checked={mcq.correctAnswerIndex === optIndex}
                          onChange={() => {
                            const updatedMcqs = [...(editCurriculum.mcqs || [])];
                            updatedMcqs[mcqIndex].correctAnswerIndex = optIndex;
                            setEditCurriculum({ ...editCurriculum, mcqs: updatedMcqs });
                          }}
                          label=""
                        />
                        <Form.Control
                          size="sm"
                          value={option}
                          onChange={(e) => {
                            const updatedMcqs = [...(editCurriculum.mcqs || [])];
                            updatedMcqs[mcqIndex].options[optIndex] = e.target.value;
                            setEditCurriculum({ ...editCurriculum, mcqs: updatedMcqs });
                          }}
                          placeholder={`Option ${optIndex + 1}`}
                        />
                      </div>
                    </Form.Group>
                  ))}

                  <Form.Group className="mb-2">
                    <Form.Label style={{ fontSize: '0.9rem' }}>Explanation (Optional)</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={2}
                      size="sm"
                      value={mcq.explanation || ''}
                      onChange={(e) => {
                        const updatedMcqs = [...(editCurriculum.mcqs || [])];
                        updatedMcqs[mcqIndex].explanation = e.target.value;
                        setEditCurriculum({ ...editCurriculum, mcqs: updatedMcqs });
                      }}
                      placeholder="Explain the correct answer"
                    />
                  </Form.Group>

                  <Button
                    size="sm"
                    variant="outline-danger"
                    onClick={() => {
                      const updatedMcqs = (editCurriculum.mcqs || []).filter((_, idx) => idx !== mcqIndex);
                      setEditCurriculum({ ...editCurriculum, mcqs: updatedMcqs });
                    }}
                  >
                    Remove MCQ
                  </Button>
                </div>
              ))}

              <Button
                size="sm"
                variant="outline-success"
                onClick={() => {
                  const updatedMcqs = [
                    ...(editCurriculum.mcqs || []),
                    {
                      id: `mcq-${Date.now()}`,
                      question: "",
                      options: ["", "", "", ""],
                      correctAnswerIndex: 0,
                      explanation: "",
                    },
                  ];
                  setEditCurriculum({ ...editCurriculum, mcqs: updatedMcqs });
                }}
              >
                + Add MCQ
              </Button>

              <div className="alert alert-warning mt-3">
                <strong>Note:</strong> Case Study MCQs for individual topics/subtopics are preserved but not editable in this modal. 
                You would need a dedicated case study MCQ editor for those.
              </div>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleEditSubmit}
            disabled={saving}
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </Button>
        </Modal.Footer>
      </Modal>

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
