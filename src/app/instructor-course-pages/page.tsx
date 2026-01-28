"use client";

import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { Button, Form } from "react-bootstrap";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
import Image from "next/image";
import { FaMagic, FaDownload, FaStethoscope } from "@/lib/fontAwesomeIconsComplete";
// import bg_img from "@/assets/img/bg/dashboard_bg.jpg";
import * as XLSX from 'xlsx';

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
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);
  const [curriculum, setCurriculum] = useState<Curriculum[]>([
    {
      subject: "",
      introVideoUrl: "",
      mcqs: [],
      chapters: [{
        chapter: "",
        topics: [{
          topic: "",
          hasSubtopics: false,
          youtubeUrl: "",
          pdfAccess: "VIEW",
          pdf: null,
        }],
      }],
    },
  ]);
  const [allCurriculums, setAllCurriculums] = useState<Curriculum[]>([]);
  const [editCurriculum, setEditCurriculum] = useState<Curriculum | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [loadingCurriculums, setLoadingCurriculums] = useState(false);

  // Fetch courses for the logged-in user (automatically filtered by role and ID on server)
  useEffect(() => {
    const fetchCourses = async () => {
      if (!session?.user?.id) return;
      try {
        const timestamp = new Date().getTime();
        const res = await fetch(`/api/courses?t=${timestamp}`, {
          cache: 'no-store',
          headers: {
            'Cache-Control': 'no-cache',
            'Pragma': 'no-cache'
          }
        });
        const data = await res.json();
        console.log('Fetched courses:', data);
        setCourses(Array.isArray(data) ? data : []);
      } catch (e) {
        setCourses([]);
      }
    };
    fetchCourses();
  }, [session?.user?.id]);

  // ========================================================================
  // EFFECTS & API CALLS
  // ========================================================================

  useEffect(() => {
    fetchCurriculums();
  }, []);

  const fetchCurriculums = async () => {
    setLoadingCurriculums(true);
    try {
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/curriculum?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await res.json();
      console.log('Fetched curriculums:', data);
      setAllCurriculums(data || []);
    } catch (error) {
      console.error("Error fetching curriculums:", error);
    } finally {
      setLoadingCurriculums(false);
    }
  };

  // ========================================================================
  // FILE UPLOAD UTILITIES
  // ========================================================================

  const handleFileUpload = async (file: File): Promise<string> => {
    try {
      console.log("🔥 Starting file upload:", { 
        name: file.name, 
        size: file.size, 
        type: file.type 
      });
      
      const formData = new FormData();
      formData.append("file", file);
      
      const res = await fetch("/api/upload-file", { 
        method: "POST", 
        body: formData 
      });
      
      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`Upload failed (${res.status}) ${text}`);
      }
      
      const data = await res.json();
      
      if (!data || typeof data.url !== "string") {
        throw new Error("Upload response missing 'url'");
      }
      
      console.log("✅ File uploaded successfully:", data.url);
      return data.url;
    } catch (err) {
      console.error("💥 handleFileUpload error:", err);
      setErrorMessage(`Failed to upload file: ${err instanceof Error ? err.message : 'Unknown error'}`);
      throw err;
    }
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
      console.log("🚀 Starting curriculum submission");
      const src = curriculum[0];

      // Validate required fields
      if (!src.subject || !src.subject.trim()) {
        throw new Error("Subject name is required");
      }

      if (!src.chapters || src.chapters.length === 0) {
        throw new Error("At least one chapter is required");
      }

      // Process all chapters
      const chapters = await Promise.all(
        (src.chapters || []).map(async (chapter) => {
          const processedTopics = await Promise.all(
            (chapter.topics || []).map(async (t) => {
              if (t.hasSubtopics) {
                // Process subtopics
                const processedSubtopics = await Promise.all(
                  (t.subtopics || []).map(async (s) => {
                    console.log(`📤 Processing subtopic: ${s.title}`);
                    
                    let pdfUrl = null;

                    // Upload PDF if it's a File
                    if (s.pdf instanceof File) {
                      console.log(`📄 Uploading PDF for subtopic: ${s.title}`, { 
                        name: s.pdf.name, 
                        size: s.pdf.size 
                      });
                      try {
                        pdfUrl = await handleFileUpload(s.pdf);
                        console.log(`✅ PDF uploaded successfully:`, pdfUrl);
                      } catch (error) {
                        console.error(`❌ Failed to upload PDF for ${s.title}:`, error);
                        throw new Error(`Failed to upload PDF for ${s.title}`);
                      }
                    } else if (typeof s.pdf === 'string' && s.pdf.trim()) {
                      pdfUrl = s.pdf;
                    }

                    return {
                      title: s.title || "",
                      youtubeUrl: s.youtubeUrl || "",
                      pdfAccess: s.pdfAccess || "VIEW",
                      pdf: pdfUrl,
                      ...(s.caseStudyMcqs && s.caseStudyMcqs.length > 0 ? { caseStudyMcqs: s.caseStudyMcqs } : {})
                    };
                  })
                );

                return {
                  topic: t.topic || "",
                  hasSubtopics: true,
                  subtopics: processedSubtopics,
                };
              } else {
                // Process topic-level files
                console.log(`📤 Processing topic: ${t.topic}`);
                
                let topicPdfUrl = null;

                // Upload Topic PDF if it's a File
                if (t.pdf instanceof File) {
                  console.log(`📄 Uploading PDF for topic: ${t.topic}`, { 
                    name: t.pdf.name, 
                    size: t.pdf.size 
                  });
                  try {
                    topicPdfUrl = await handleFileUpload(t.pdf);
                    console.log(`✅ Topic PDF uploaded successfully:`, topicPdfUrl);
                  } catch (error) {
                    console.error(`❌ Failed to upload PDF for topic ${t.topic}:`, error);
                    throw new Error(`Failed to upload PDF for topic ${t.topic}`);
                  }
                } else if (typeof t.pdf === 'string' && t.pdf.trim()) {
                  topicPdfUrl = t.pdf;
                }

                return {
                  topic: t.topic || "",
                  hasSubtopics: false,
                  youtubeUrl: t.youtubeUrl || "",
                  pdfAccess: t.pdfAccess || "VIEW",
                  pdf: topicPdfUrl,
                  ...(t.caseStudyMcqs && t.caseStudyMcqs.length > 0 ? { caseStudyMcqs: t.caseStudyMcqs } : {})
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


      // Debug logs for courseId and instructorId
      console.log("Selected courseId:", courseId);
      console.log("Session user id (instructorId):", session?.user?.id);
      if (!courseId) {
        setErrorMessage("Please select a course before submitting.");
        setSaving(false);
        return;
      }
      if (!session?.user?.id) {
        setErrorMessage("You must be logged in to submit a curriculum.");
        setSaving(false);
        return;
      }

      const payload = {
        subject: src.subject || "",
        introVideoUrl: src.introVideoUrl || "",
        mcqs: (src.mcqs && src.mcqs.length > 0) ? src.mcqs : [],
        chapters,
        courseId,
        instructorId: session?.user?.id,
      };

      console.log("📦 Final payload:", JSON.stringify(payload, null, 2));
      
      const res = await fetch("/api/curriculum", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        console.error("❌ API Error Response:", txt);
        throw new Error(`Failed to save curriculum (${res.status}): ${txt}`);
      }

      const result = await res.json();
      console.log("✅ Curriculum saved successfully:", result);

      setSuccessMessage("✅ Curriculum submitted successfully! All files uploaded.");
      
      // Force refresh
      await fetchCurriculums();
      
      // Reset form
      setCurriculum([{
        subject: "",
        introVideoUrl: "",
        mcqs: [],
        chapters: [{
          chapter: "",
          topics: [{
            topic: "",
            hasSubtopics: false,
            youtubeUrl: "",
            pdfAccess: "VIEW",
            pdf: null,
          }],
        }],
      }]);
      
      await fetchCurriculums();
    } catch (err: any) {
      console.error("💥 handleSubmit error:", err);
      setErrorMessage(`❌ ${err?.message ?? "Error submitting curriculum"}`);
    } finally {
      setSaving(false);
    }
  };

  const handleEditSubmit = async (event: React.MouseEvent<HTMLButtonElement>): Promise<void> => {
    event.preventDefault();
    if (!editCurriculum) return;
    
    setErrorMessage(null);
    setSaving(true);
    
    try {
      const updatedCurriculum: Curriculum = {
        id: editCurriculum.id ?? "",
        subject: editCurriculum.subject ?? "",
        chapters: editCurriculum.chapters || [],
      };

      // Process chapters and upload files
      for (const chapter of updatedCurriculum.chapters) {
        for (const topic of chapter.topics) {
          if (topic.pdf instanceof File) {
            topic.pdf = await handleFileUpload(topic.pdf);
          }
          
          if (topic.hasSubtopics && topic.subtopics) {
            for (const sub of topic.subtopics) {
              if (sub.pdf instanceof File) {
                sub.pdf = await handleFileUpload(sub.pdf);
              }
            }
          }
        }
      }

      const res = await fetch(`/api/curriculum/${editCurriculum.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedCurriculum),
      });
      
      if (!res.ok) {
        const txt = await res.text().catch(() => "");
        throw new Error(`Failed to update (${res.status}) ${txt}`);
      }

      setEditCurriculum(null);
      await fetchCurriculums();
      setSuccessMessage("Curriculum updated successfully");
    } catch (err: any) {
      console.error("💥 handleEditSubmit error:", err);
      setErrorMessage(err?.message ?? "Error updating curriculum");
    } finally {
      setSaving(false);
    }
  };

  // ========================================================================
  // EVENT HANDLERS
  // ========================================================================

  const handleFileChange = (
    file: File | null,
    type: "pdf",
    i: number,
    j: number,
    k: number,
    s?: number
  ) => {
    const newData = [...curriculum];
    
    if (typeof s === "number") {
      // Subtopic file
      if (!newData[i].chapters[j].topics[k].subtopics) {
        newData[i].chapters[j].topics[k].subtopics = [];
      }
      (newData[i].chapters[j].topics[k].subtopics![s] as any)[type] = file;
    } else {
      // Topic file
      (newData[i].chapters[j].topics[k] as any)[type] = file;
    }
    
    setCurriculum(newData);
  };

  const handleInputChange = (
    value: string, 
    field: keyof Topic, 
    i: number, 
    j: number, 
    k: number
  ) => {
    const newData = [...curriculum];
    newData[i].chapters[j].topics[k] = {
      ...newData[i].chapters[j].topics[k],
      [field]: value,
    };
    setCurriculum(newData);
  };

  const cancelEdit = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setEditCurriculum(null);
  };

  // ========================================================================
  // CURRICULUM MANIPULATION FUNCTIONS
  // ========================================================================

  const removeSubtopic = (i: number, j: number, k: number, s: number) => {
    const newData = [...curriculum];
    newData[i].chapters[j].topics[k].subtopics!.splice(s, 1);
    setCurriculum(newData);
  };

  const addSubtopic = (i: number, j: number, k: number) => {
    const newData = [...curriculum];
    if (!newData[i].chapters[j].topics[k].subtopics) {
      newData[i].chapters[j].topics[k].subtopics = [];
    }
    newData[i].chapters[j].topics[k].subtopics!.push({
      title: "",
      youtubeUrl: "",
      pdfAccess: "VIEW",
      pdf: null,
    });
    setCurriculum(newData);
  };

  const addTopic = (i: number, j: number) => {
    const newData = [...curriculum];
    newData[i].chapters[j].topics.push({
      topic: "",
      hasSubtopics: false,
      youtubeUrl: "",
      pdfAccess: "VIEW",
      pdf: null,
    });
    setCurriculum(newData);
  };

  const addChapter = (i: number) => {
    const newData = [...curriculum];
    newData[i].chapters.push({
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
    });
    setCurriculum(newData);
  };

  const toggleSubtopics = (i: number, j: number, k: number, hasSubtopics: boolean) => {
    const newData = [...curriculum];
    newData[i].chapters[j].topics[k].hasSubtopics = hasSubtopics;
    
    if (hasSubtopics) {
      if (!newData[i].chapters[j].topics[k].subtopics) {
        newData[i].chapters[j].topics[k].subtopics = [
          {
            title: "",
            youtubeUrl: "",
            pdfAccess: "VIEW",
            pdf: null,
          },
        ];
      }
    } else {
      delete newData[i].chapters[j].topics[k].subtopics;
    }
    
    setCurriculum(newData);
  };

  // ========================================================================
  // ADMIN FUNCTIONS
  // ========================================================================

  const startEdit = (cur: Curriculum) => {
    setEditCurriculum({
      id: cur.id ?? "",
      subject: cur.subject ?? "",
      chapters: Array.isArray(cur.chapters)
        ? cur.chapters
        : typeof cur.chapters === "string"
        ? JSON.parse(cur.chapters)
        : [],
    });
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this curriculum?")) return;
    
    try {
      await fetch(`/api/curriculum/${id}`, { method: "DELETE" });
      fetchCurriculums();
    } catch (error) {
      console.error("Error deleting curriculum:", error);
    }
  };

  // ========================================================================
  // MCQ EXCEL PROCESSING
  // ========================================================================
  const MAX_UPLOAD_BYTES = 5 * 1024 * 1024; // 5MB guardrail for XLSX uploads

  const assertFileSize = (file: File) => {
    if (file.size > MAX_UPLOAD_BYTES) {
      throw new Error("Upload file is too large. Please keep it under 5MB.");
    }
  };

  const processMCQExcel = async (file: File): Promise<MCQ[]> => {
    assertFileSize(file);
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const mcqs: MCQ[] = jsonData.map((row: any, index: number) => {
            const question = row.Question || row.question || row.QUESTION || '';
            const option1 = row.Option1 || row['Option 1'] || row.option1 || row.OPTION1 || '';
            const option2 = row.Option2 || row['Option 2'] || row.option2 || row.OPTION2 || '';
            const option3 = row.Option3 || row['Option 3'] || row.option3 || row.OPTION3 || '';
            const option4 = row.Option4 || row['Option 4'] || row.option4 || row.OPTION4 || '';
            const correctAnswer = row.CorrectAnswer || row['Correct Answer'] || row.correctAnswer || row.CORRECTANSWER || 1;
            const explanation = row.Explanation || row.explanation || row.EXPLANATION || '';

            if (!question.trim()) {
              throw new Error(`Question is missing in row ${index + 2}`);
            }

            return {
              question: question.trim(),
              options: [
                option1.trim(),
                option2.trim(), 
                option3.trim(),
                option4.trim()
              ].filter(opt => opt.length > 0),
              correctAnswerIndex: Math.max(0, Math.min(3, parseInt(correctAnswer) - 1)),
              explanation: explanation.trim() || undefined
            };
          }).filter(mcq => mcq.question && mcq.options.length >= 2);
          
          if (mcqs.length === 0) {
            throw new Error('No valid MCQs found in the Excel file');
          }
          
          resolve(mcqs);
        } catch (error) {
          console.error('Excel processing error:', error);
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  };

  const processEnhancedMCQExcel = async (file: File) => {
    assertFileSize(file);
    return new Promise<void>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = e.target?.result;
          const workbook = XLSX.read(data, { type: 'binary' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet);
          
          const mcqStructure: { [key: string]: { [key: string]: { [key: string]: MCQ[] } } } = {};
          const universalMCQs: MCQ[] = [];
          let processedCount = 0;
          
          jsonData.forEach((row: any, index: number) => {
            const chapterName = (row.Chapter || row.chapter || '').trim();
            const topicName = (row.Topic || row.topic || '').trim();
            const subtopicName = (row.Subtopic || row.subtopic || '').trim();
            
            const question = (row.Question || row.question || '').trim();
            const option1 = (row.Option1 || row.option1 || '').trim();
            const option2 = (row.Option2 || row.option2 || '').trim();
            const option3 = (row.Option3 || row.option3 || '').trim();
            const option4 = (row.Option4 || row.option4 || '').trim();
            const correctAnswer = row.CorrectAnswer || row.correctAnswer || 1;
            const explanation = (row.Explanation || row.explanation || '').trim();

            if (!question || !chapterName || !topicName) {
              console.warn(`Skipping row ${index + 2}: Missing required fields`);
              return;
            }

            const mcq: MCQ = {
              question,
              options: [option1, option2, option3, option4].filter(opt => opt.length > 0),
              correctAnswerIndex: Math.max(0, Math.min(3, parseInt(correctAnswer) - 1)),
              explanation: explanation || undefined
            };

            universalMCQs.push(mcq);

            if (!mcqStructure[chapterName]) {
              mcqStructure[chapterName] = {};
            }
            if (!mcqStructure[chapterName][topicName]) {
              mcqStructure[chapterName][topicName] = {};
            }
            if (!mcqStructure[chapterName][topicName][subtopicName]) {
              mcqStructure[chapterName][topicName][subtopicName] = [];
            }

            mcqStructure[chapterName][topicName][subtopicName].push(mcq);
            processedCount++;
          });

          const newData = [...curriculum];
          newData[0].mcqs = universalMCQs;
          
          Object.keys(mcqStructure).forEach(chapterName => {
            let chapterIndex = newData[0].chapters.findIndex(ch => 
              ch.chapter.toLowerCase().includes(chapterName.toLowerCase()) ||
              chapterName.toLowerCase().includes(ch.chapter.toLowerCase())
            );
            
            if (chapterIndex === -1) {
              newData[0].chapters.push({
                chapter: chapterName,
                topics: []
              });
              chapterIndex = newData[0].chapters.length - 1;
            }

            Object.keys(mcqStructure[chapterName]).forEach(topicName => {
              let topicIndex = newData[0].chapters[chapterIndex].topics.findIndex(topic =>
                topic.topic.toLowerCase().includes(topicName.toLowerCase()) ||
                topicName.toLowerCase().includes(topic.topic.toLowerCase())
              );

              if (topicIndex === -1) {
                newData[0].chapters[chapterIndex].topics.push({
                  topic: topicName,
                  hasSubtopics: false,
                  youtubeUrl: "",
                  pdfAccess: "VIEW",
                  pdf: null,
                });
                topicIndex = newData[0].chapters[chapterIndex].topics.length - 1;
              }

              Object.keys(mcqStructure[chapterName][topicName]).forEach(subtopicName => {
                if (subtopicName && subtopicName.length > 0) {
                  const topic = newData[0].chapters[chapterIndex].topics[topicIndex];
                  topic.hasSubtopics = true;
                  
                  if (!topic.subtopics) {
                    topic.subtopics = [];
                  }

                  let subtopicIndex = topic.subtopics.findIndex(sub =>
                    sub.title.toLowerCase().includes(subtopicName.toLowerCase()) ||
                    subtopicName.toLowerCase().includes(sub.title.toLowerCase())
                  );

                  if (subtopicIndex === -1) {
                    topic.subtopics.push({
                      title: subtopicName,
                      youtubeUrl: "",
                      pdfAccess: "VIEW",
                      pdf: null,
                    });
                  }
                }
              });
            });
          });

          setCurriculum(newData);
          setSuccessMessage(`✅ Successfully processed ${processedCount} MCQs and auto-organized into curriculum structure`);
          
          resolve();
        } catch (error) {
          console.error('Enhanced Excel processing error:', error);
          reject(error);
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsBinaryString(file);
    });
  };

  const handleEnhancedMCQFileUpload = async (file: File) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      await processEnhancedMCQExcel(file);
      setTimeout(() => setSuccessMessage(null), 8000);
      
    } catch (error) {
      console.error('Enhanced MCQ Excel processing error:', error);
      setErrorMessage(`❌ Error processing Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleUniversalMCQFileUpload = async (file: File, i: number) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      const mcqs = await processMCQExcel(file);
      const newData = [...curriculum];
      newData[i].mcqs = mcqs;
      
      setCurriculum(newData);
      setSuccessMessage(`✅ Successfully processed ${mcqs.length} universal MCQs from Excel file`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
    } catch (error) {
      console.error('Universal MCQ Excel processing error:', error);
      setErrorMessage(`❌ Error processing Excel file: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCaseStudyMCQFileUpload = async (file: File, i: number, j: number, k: number, s?: number) => {
    try {
      setErrorMessage(null);
      setSuccessMessage(null);
      
      const mcqs = await processMCQExcel(file);
      const newData = [...curriculum];
      
      if (typeof s === 'number') {
        if (!newData[i].chapters[j].topics[k].subtopics![s]) {
          newData[i].chapters[j].topics[k].subtopics![s] = {
            title: "",
            youtubeUrl: "",
            pdfAccess: "VIEW",
            pdf: null,
          };
        }
        newData[i].chapters[j].topics[k].subtopics![s].caseStudyMcqs = mcqs;
      } else {
        newData[i].chapters[j].topics[k].caseStudyMcqs = mcqs;
      }
      
      setCurriculum(newData);
      setSuccessMessage(`✅ Successfully processed ${mcqs.length} case study MCQs`);
      setTimeout(() => setSuccessMessage(null), 5000);
      
    } catch (error) {
      console.error('Case study MCQ error:', error);
      setErrorMessage(`❌ Error processing file`);
    }
  };

  const downloadMCQTemplate = () => {
    // Create sample MCQ data with medical examples
    const sampleData = [
      {
        Question: "Which bone is commonly known as the collarbone?",
        Option1: "Scapula",
        Option2: "Clavicle", 
        Option3: "Humerus",
        Option4: "Sternum",
        CorrectAnswer: 2,
        Explanation: "The clavicle is commonly known as the collarbone."
      },
      {
        Question: "What is the normal resting heart rate for a healthy adult?",
        Option1: "40-50 beats per minute",
        Option2: "60-100 beats per minute",
        Option3: "100-120 beats per minute",
        Option4: "120-140 beats per minute",
        CorrectAnswer: 2,
        Explanation: "The normal resting heart rate for healthy adults ranges from 60 to 100 beats per minute."
      },
      {
        Question: "Which vitamin is primarily synthesized in the skin when exposed to sunlight?",
        Option1: "Vitamin A",
        Option2: "Vitamin C",
        Option3: "Vitamin D",
        Option4: "Vitamin K",
        CorrectAnswer: 3,
        Explanation: "Vitamin D is synthesized in the skin when exposed to UVB radiation from sunlight."
      },
      {
        Question: "What is the medical term for high blood pressure?",
        Option1: "Hypotension",
        Option2: "Hypertension",
        Option3: "Tachycardia",
        Option4: "Bradycardia",
        CorrectAnswer: 2,
        Explanation: "Hypertension is the medical term for high blood pressure, while hypotension refers to low blood pressure."
      }
    ];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Medical MCQ Template");
    
    // Download the file
    XLSX.writeFile(workbook, "Medical_MCQ_Template.xlsx");
  };

  const downloadEnhancedMCQTemplate = () => {
    // Create enhanced sample MCQ data with medical/anatomy structure mapping
    const sampleData = [
      {
        Chapter: "Human Anatomy",
        Topic: "Cardiovascular System",
        Subtopic: "Heart Structure",
        Question: "Which chamber of the heart receives deoxygenated blood from the body?",
        Option1: "Left atrium",
        Option2: "Right atrium",
        Option3: "Left ventricle",
        Option4: "Right ventricle",
        CorrectAnswer: 2,
        Explanation: "The right atrium receives deoxygenated blood from the superior and inferior vena cava."
      },
      {
        Chapter: "Human Anatomy",
        Topic: "Cardiovascular System",
        Subtopic: "Blood Vessels",
        Question: "What is the largest artery in the human body?",
        Option1: "Pulmonary artery",
        Option2: "Carotid artery",
        Option3: "Aorta",
        Option4: "Femoral artery",
        CorrectAnswer: 3,
        Explanation: "The aorta is the largest artery, carrying oxygenated blood from the left ventricle to the body."
      },
      {
        Chapter: "Human Anatomy",
        Topic: "Respiratory System",
        Subtopic: "", // Empty subtopic - will go directly to topic
        Question: "Which structure prevents food from entering the trachea during swallowing?",
        Option1: "Epiglottis",
        Option2: "Larynx",
        Option3: "Pharynx",
        Option4: "Esophagus",
        CorrectAnswer: 1,
        Explanation: "The epiglottis is a flap of cartilage that covers the trachea during swallowing to prevent aspiration."
      },
      {
        Chapter: "Human Physiology",
        Topic: "Nervous System",
        Subtopic: "Neuron Structure",
        Question: "Which part of the neuron receives incoming signals from other neurons?",
        Option1: "Axon",
        Option2: "Dendrites",
        Option3: "Cell body",
        Option4: "Myelin sheath",
        CorrectAnswer: 2,
        Explanation: "Dendrites are branched extensions that receive signals from other neurons and conduct them toward the cell body."
      },
      {
        Chapter: "Human Physiology",
        Topic: "Digestive System",
        Subtopic: "Stomach Function",
        Question: "What is the primary function of pepsin in the stomach?",
        Option1: "Carbohydrate digestion",
        Option2: "Protein digestion",
        Option3: "Fat digestion",
        Option4: "Vitamin absorption",
        CorrectAnswer: 2,
        Explanation: "Pepsin is a proteolytic enzyme that breaks down proteins into smaller peptides in the acidic environment of the stomach."
      },
      {
        Chapter: "Medical Terminology",
        Topic: "Anatomical Positions",
        Subtopic: "Directional Terms",
        Question: "What does the term 'superior' mean in anatomical position?",
        Option1: "Towards the feet",
        Option2: "Towards the head",
        Option3: "Towards the front",
        Option4: "Towards the back",
        CorrectAnswer: 2,
        Explanation: "Superior means above or towards the head in anatomical position, opposite of inferior."
      },
      {
        Chapter: "Pathology",
        Topic: "Cardiovascular Diseases",
        Subtopic: "Myocardial Infarction",
        Question: "What is the most common cause of myocardial infarction?",
        Option1: "Coronary artery spasm",
        Option2: "Coronary thrombosis",
        Option3: "Aortic stenosis",
        Option4: "Pericarditis",
        CorrectAnswer: 2,
        Explanation: "Coronary thrombosis (blood clot in coronary artery) is the most common cause of myocardial infarction (heart attack)."
      },
      {
        Chapter: "Pharmacology",
        Topic: "Drug Classifications",
        Subtopic: "Antibiotics",
        Question: "Which antibiotic class inhibits bacterial cell wall synthesis?",
        Option1: "Aminoglycosides",
        Option2: "Beta-lactams",
        Option3: "Macrolides",
        Option4: "Fluoroquinolones",
        CorrectAnswer: 2,
        Explanation: "Beta-lactam antibiotics (penicillins, cephalosporins) inhibit bacterial cell wall synthesis by blocking peptidoglycan formation."
      }
    ];

    // Create workbook and worksheet
    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    
    // Add worksheet to workbook
    XLSX.utils.book_append_sheet(workbook, worksheet, "Medical MCQ Template");
    
    // Download the file
    XLSX.writeFile(workbook, "Medical_MCQ_Template.xlsx");
  };

  const downloadCaseStudyMCQTemplate = () => {
    // Create sample case study MCQ data with clinical scenarios
    const sampleData = [
      {
        Question: "A 55-year-old male presents with severe chest pain radiating to the left arm, accompanied by shortness of breath and diaphoresis. ECG shows ST-segment elevation in leads II, III, and aVF. What is the most likely diagnosis?",
        Option1: "Unstable angina",
        Option2: "Inferior wall myocardial infarction",
        Option3: "Acute pericarditis",
        Option4: "Aortic dissection",
        CorrectAnswer: 2,
        Explanation: "ST-segment elevation in leads II, III, and aVF indicates an inferior wall myocardial infarction, typically caused by occlusion of the right coronary artery."
      },
      {
        Question: "A 28-year-old woman presents with sudden onset of dyspnea, pleuritic chest pain, and hemoptysis. She recently returned from a long international flight. D-dimer is elevated. What is the most appropriate next step?",
        Option1: "Chest X-ray",
        Option2: "CT pulmonary angiography",
        Option3: "Ventilation-perfusion scan",
        Option4: "Echocardiography",
        CorrectAnswer: 2,
        Explanation: "Given the clinical presentation suggestive of pulmonary embolism and elevated D-dimer, CT pulmonary angiography (CTPA) is the gold standard diagnostic test."
      },
      {
        Question: "A 65-year-old diabetic patient presents with fever, dysuria, and left-sided flank pain. Urinalysis shows pyuria and bacteriuria. Blood cultures are pending. What is the most appropriate initial antibiotic therapy?",
        Option1: "Oral nitrofurantoin",
        Option2: "Intravenous fluoroquinolone",
        Option3: "Oral trimethoprim-sulfamethoxazole",
        Option4: "Intramuscular ceftriaxone",
        CorrectAnswer: 2,
        Explanation: "For acute pyelonephritis in a hospitalized diabetic patient, IV fluoroquinolone (or ceftriaxone) is preferred due to good tissue penetration and coverage of common uropathogens."
      },
      {
        Question: "A 45-year-old alcoholic male presents with severe epigastric pain radiating to the back, nausea, and vomiting. Serum amylase and lipase are elevated (>3x normal). What is the initial management priority?",
        Option1: "Immediate surgical consultation",
        Option2: "Aggressive IV fluid resuscitation",
        Option3: "Nasogastric tube insertion",
        Option4: "IV antibiotics",
        CorrectAnswer: 2,
        Explanation: "In acute pancreatitis, aggressive IV fluid resuscitation (250-500 mL/hour) is the cornerstone of early management to prevent hypovolemia and organ failure."
      }
    ];

    const workbook = XLSX.utils.book_new();
    const worksheet = XLSX.utils.json_to_sheet(sampleData);
    XLSX.utils.book_append_sheet(workbook, worksheet, "Case Study MCQ Template");
    XLSX.writeFile(workbook, "Case_Study_MCQ_Template.xlsx");
  };

  // ========================================================================
  // RENDER COMPONENT
  // ========================================================================

  return (
    <section className="dashboard__area section-pb-120">
      {/* Banner image at the top, styled like other pages */}
      <div
        className="dashboard__top-wrap mt-120"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "48px",
          marginTop: "48px",
        }}
      >
        <div
          className="dashboard__top-bg"
          style={{
            backgroundImage: `url(/assets/img/bg/instructor_dashboard_bg.png)`,
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            width: "100%",
            maxWidth: "1400px",
            height: "260px",
            borderRadius: "18px",
            boxShadow: "0 4px 24px rgba(13,68,122,0.08)",
            marginTop: "60px",
          }}
        ></div>
      </div>
      
      <div className="container">
        <div className="dashboard__inner-wrap row">
          <DashboardSidebar />
          
          <div className="col-lg-9">
            <h4 className="title">Upload Curriculum</h4>

            {/* Course Selection Dropdown */}
            <Form.Group className="mb-4">
              <Form.Label>Select Course</Form.Label>
              <Form.Select
                value={courseId}
                onChange={e => setCourseId(e.target.value)}
                required
              >
                <option value="">-- Select a Course --</option>
                {courses.map((course) => (
                  <option key={course.id} value={course.id}>{course.title}</option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form className="p-4 bg-white shadow-sm border rounded" onSubmit={handleSubmit}>
              {/* Smart MCQ Upload Section */}
              <div className="mb-4 p-3 bg-success bg-opacity-10 rounded border-start border-5 border-success">
                <h6 className="mb-2" style={{ color: '#0d447a' }}>
                  <FaMagic className="me-2" />
                  🚀 Smart MCQ Upload (Auto-Structure Creation)
                </h6>
                <p className="small text-muted mb-3">
                  Upload an Excel file with Chapter/Topic/Subtopic columns and watch the system automatically create your entire curriculum structure with MCQs!
                </p>
                
                <div className="row g-2 mb-3">
                  <div className="col-md-6">
                    <Button
                      variant="success"
                      size="sm"
                      onClick={downloadEnhancedMCQTemplate}
                      className="w-100"
                    >
                      <FaDownload className="me-1" />
                      Download Smart Template
                    </Button>
                  </div>
                  <div className="col-md-6">
                    <Form.Control
                      type="file"
                      accept=".xlsx,.xls"
                      onChange={async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          await handleEnhancedMCQFileUpload(file);
                        }
                      }}
                      size="sm"
                    />
                  </div>
                </div>
              </div>

              {/* Case Study MCQ Section */}
              <div className="mb-4 p-3 bg-info bg-opacity-10 rounded border-start border-5 border-info">
                <h6 className="mb-2" style={{ color: '#0d447a' }}>
                  <FaStethoscope className="me-2" />
                  📊 Case Study Upload
                </h6>
                <p className="small text-muted mb-3">
                  Upload clinical case study questions in Excel format.
                </p>
                
                <Button
                  variant="info"
                  size="sm"
                  onClick={downloadCaseStudyMCQTemplate}
                >
                  <FaDownload className="me-1" />
                  Download Case Study MCQ Template
                </Button>
              </div>

              {/* Alert Messages */}
              {errorMessage && (
                <div className="alert alert-danger" role="alert">
                  {errorMessage}
                </div>
              )}
              
              {successMessage && (
                <div className="alert alert-success" role="alert">
                  {successMessage}
                </div>
              )}

              {/* Curriculum Form Fields */}
              {curriculum.map((subj, i) => (
                <div key={i} className="mb-5">
                  {/* Subject Input */}
                  <Form.Control
                    className="mb-3"
                    value={subj.subject}
                    onChange={(e) => {
                      const newData = [...curriculum];
                      newData[i].subject = e.target.value;
                      setCurriculum(newData);
                    }}
                    placeholder="Enter Subject"
                  />

                  {/* Subject Introduction Video */}
                  <Form.Label>Subject Introduction Video URL</Form.Label>
                  <Form.Control
                    className="mb-3"
                    value={subj.introVideoUrl || ""}
                    onChange={(e) => {
                      const newData = [...curriculum];
                      newData[i].introVideoUrl = e.target.value;
                      setCurriculum(newData);
                    }}
                    placeholder="Enter Subject Introduction Video URL"
                  />

                  {/* Universal MCQ Upload */}
                  <Form.Label>Universal MCQs (Excel)</Form.Label>
                  <div className="d-flex align-items-center gap-2 mb-3">
                    <Form.Control
                      type="file"
                      accept=".xlsx,.xls"
                      size="sm"
                      onChange={async (e) => {
                        const file = (e.target as HTMLInputElement).files?.[0];
                        if (file) {
                          await handleUniversalMCQFileUpload(file, i);
                        }
                      }}
                    />
                    {subj.mcqs && subj.mcqs.length > 0 && (
                      <small className="text-success">
                        ✓ {subj.mcqs.length} MCQs
                      </small>
                    )}
                  </div>

                  {/* Chapters */}
                  {subj.chapters.map((chap, j) => (
                    <div key={j} className="border p-3 mb-4 rounded">
                      <Form.Label>Chapter {j + 1}</Form.Label>
                      <Form.Control
                        className="mb-3"
                        value={chap.chapter}
                        onChange={(e) => {
                          const newData = [...curriculum];
                          newData[i].chapters[j].chapter = e.target.value;
                          setCurriculum(newData);
                        }}
                        placeholder="Enter Chapter Title"
                      />

                      {/* Topics */}
                      {chap.topics.map((topic, k) => (
                        <div key={k} className="bg-light p-3 rounded mb-2">
                          <Form.Control
                            className="mb-2"
                            value={topic.topic}
                            onChange={(e) => {
                              const newData = [...curriculum];
                              newData[i].chapters[j].topics[k].topic = e.target.value;
                              setCurriculum(newData);
                            }}
                            placeholder="Enter Topic"
                          />

                          {/* Subtopic Toggle */}
                          <Form.Label>Has Subtopics?</Form.Label>
                          <div className="mb-2">
                            <Form.Check
                              inline
                              label="Yes"
                              type="radio"
                              name={`subtopic-${i}-${j}-${k}`}
                              checked={topic.hasSubtopics}
                              onChange={() => toggleSubtopics(i, j, k, true)}
                            />
                            <Form.Check
                              inline
                              label="No"
                              type="radio"
                              name={`subtopic-${i}-${j}-${k}`}
                              checked={!topic.hasSubtopics}
                              onChange={() => toggleSubtopics(i, j, k, false)}
                            />
                          </div>

                          {/* Conditional Rendering: Subtopics or Direct Content */}
                          {topic.hasSubtopics ? (
                            <div>
                              {/* Subtopics */}
                              {topic.subtopics?.map((sub, s) => (
                                <div 
                                  key={s} 
                                  className="card mb-3 border-0 shadow-sm rounded-lg p-3"
                                  style={{ background: '#f8fafc', borderLeft: '4px solid #0d6efd' }}
                                >
                                  <div className="d-flex justify-content-between align-items-center mb-2">
                                    <h6 className="mb-0">Subtopic {s + 1}</h6>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => removeSubtopic(i, j, k, s)}
                                    >
                                      ✕ Remove
                                    </Button>
                                  </div>
                                  
                                  <hr className="my-2" />
                                  
                                  {/* Subtopic Fields */}
                                  <Form.Label>Subtopic Title</Form.Label>
                                  <Form.Control
                                    className="mb-2"
                                    value={sub.title}
                                    onChange={(e) => {
                                      const newData = [...curriculum];
                                      newData[i].chapters[j].topics[k].subtopics![s].title = e.target.value;
                                      setCurriculum(newData);
                                    }}
                                    placeholder="Enter Subtopic Title"
                                  />

                                  <Form.Label>YouTube Link</Form.Label>
                                  <Form.Control
                                    className="mb-2"
                                    value={sub.youtubeUrl}
                                    onChange={(e) => {
                                      const newData = [...curriculum];
                                      newData[i].chapters[j].topics[k].subtopics![s].youtubeUrl = e.target.value;
                                      setCurriculum(newData);
                                    }}
                                    placeholder="Enter YouTube Link"
                                  />

                                  {/* PDF Upload */}
                                  <Form.Label>PDF</Form.Label>
                                  <div className="d-flex align-items-center mb-2">
                                    <Form.Select
                                      style={{ maxWidth: 120, marginRight: 8 }}
                                      value={sub.pdfAccess}
                                      onChange={(e) => {
                                        const newData = [...curriculum];
                                        newData[i].chapters[j].topics[k].subtopics![s].pdfAccess = e.target.value;
                                        setCurriculum(newData);
                                      }}
                                    >
                                      <option value="VIEW">VIEW</option>
                                      <option value="DOWNLOAD">DOWNLOAD</option>
                                      <option value="PAID">PAID</option>
                                    </Form.Select>
                                    <Form.Control
                                      type="file"
                                      style={{ maxWidth: 280 }}
                                      onChange={e => handleFileChange(
                                        (e.target as HTMLInputElement).files?.[0] || null, 
                                        "pdf", 
                                        i, j, k, s
                                      )}
                                    />
                                  </div>

                                  {/* Case Study MCQ Upload */}
                                  <Form.Label className="mt-2">📊 Case Study MCQs (Excel)</Form.Label>
                                  <div className="d-flex align-items-center gap-2">
                                    <Form.Control
                                      type="file"
                                      accept=".xlsx,.xls"
                                      size="sm"
                                      onChange={async (e) => {
                                        const file = (e.target as HTMLInputElement).files?.[0];
                                        if (file) {
                                          await handleCaseStudyMCQFileUpload(file, i, j, k, s);
                                        }
                                      }}
                                    />
                                    {sub.caseStudyMcqs && sub.caseStudyMcqs.length > 0 && (
                                      <small className="text-success fw-bold">
                                        ✅ {sub.caseStudyMcqs.length} MCQs
                                      </small>
                                    )}
                                  </div>
                                </div>
                              ))}
                              
                              {/* Add Subtopic Button */}
                              <div className="d-flex justify-content-end">
                                <Button
                                  variant="outline-info"
                                  size="sm"
                                  onClick={() => addSubtopic(i, j, k)}
                                >
                                  ＋ Add Subtopic
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              {/* Direct Topic Content */}
                              <Form.Label>YouTube Link</Form.Label>
                              <Form.Control
                                className="mb-2"
                                value={topic.youtubeUrl || ""}
                                onChange={(e) => {
                                  const newData = [...curriculum];
                                  newData[i].chapters[j].topics[k].youtubeUrl = e.target.value;
                                  setCurriculum(newData);
                                }}
                                placeholder="Enter YouTube Link"
                              />

                              {/* PDF Upload */}
                              <Form.Label>PDF</Form.Label>
                              <div className="d-flex align-items-center mb-2">
                                <Form.Select
                                  style={{ maxWidth: 120, marginRight: 8 }}
                                  value={topic.pdfAccess || "VIEW"}
                                  onChange={(e) => handleInputChange(e.target.value, "pdfAccess", i, j, k)}
                                >
                                  <option value="VIEW">VIEW</option>
                                  <option value="DOWNLOAD">DOWNLOAD</option>
                                  <option value="PAID">PAID</option>
                                </Form.Select>
                                <Form.Control
                                  type="file"
                                  style={{ maxWidth: 280 }}
                                  onChange={e => handleFileChange(
                                    (e.target as HTMLInputElement).files?.[0] || null, 
                                    "pdf", 
                                    i, j, k
                                  )}
                                />
                              </div>

                              {/* Case Study MCQ Upload */}
                              <Form.Label className="mt-2">📊 Case Study MCQs (Excel)</Form.Label>
                              <div className="d-flex align-items-center gap-2">
                                <Form.Control
                                  type="file"
                                  accept=".xlsx,.xls"
                                  size="sm"
                                  onChange={async (e) => {
                                    const file = (e.target as HTMLInputElement).files?.[0];
                                    if (file) {
                                      await handleCaseStudyMCQFileUpload(file, i, j, k);
                                    }
                                  }}
                                />
                                {topic.caseStudyMcqs && topic.caseStudyMcqs.length > 0 && (
                                  <small className="text-success fw-bold">
                                    ✅ {topic.caseStudyMcqs.length} MCQs
                                  </small>
                                )}
                              </div>
                            </div>
                          )}
                        </div>
                      ))}

                      {/* Add Topic Button */}
                      <Button
                        size="sm"
                        variant="outline-success"
                        onClick={() => addTopic(i, j)}
                      >
                        ＋ Add Topic
                      </Button>
                    </div>
                  ))}

                  {/* Add Chapter Button */}
                  <Button
                    size="sm"
                    variant="outline-primary"
                    onClick={() => addChapter(i)}
                  >
                    ＋ Add Chapter
                  </Button>
                </div>
              ))}

              {/* Submit Button */}
              <Button
                type="submit"
                variant="primary"
                size="sm"
                disabled={saving}
              >
                {saving ? 'Saving...' : 'Submit Curriculum'}
              </Button>
            </Form>

            {/* CURRICULUMS LIST */}
            <hr className="my-5" />
            <h4 className="title mb-3">All Curriculums</h4>

            {loadingCurriculums ? (
              <div className="text-center py-4">Loading...</div>
            ) : (
              <div>
                {allCurriculums.length === 0 ? (
                  <div className="text-center text-muted mb-4">No curriculums found.</div>
                ) : (
                  <table className="table table-bordered table-striped">
                    <thead>
                      <tr>
                        <th>Subject</th>
                        <th>Chapters</th>
                        <th>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {allCurriculums.map((cur, idx) => {
                        const chapters = Array.isArray(cur.chapters)
                          ? cur.chapters
                          : typeof cur.chapters === "string"
                          ? JSON.parse(cur.chapters)
                          : [];

                        return (
                          <tr key={cur.id || idx}>
                            <td style={{ fontWeight: 600 }}>{cur.subject}</td>
                            <td>
                              <ul style={{ paddingLeft: 18, marginBottom: 0 }}>
                                {chapters.map((chap: Chapter, cidx: number) => (
                                  <li key={cidx}>
                                    <strong>Chapter {cidx + 1}:</strong> {chap.chapter}
                                    <ul style={{ paddingLeft: 18 }}>
                                      {chap.topics.map((topic, tidx) => (
                                        <li key={tidx}>
                                          <strong>Topic {tidx + 1}:</strong> {topic.topic}
                                          {topic.hasSubtopics && topic.subtopics && (
                                            <ul style={{ paddingLeft: 18 }}>
                                              {topic.subtopics.map((sub, sidx) => (
                                                <li key={sidx}>
                                                  <strong>Subtopic {sidx + 1}:</strong> {sub.title}
                                                </li>
                                              ))}
                                            </ul>
                                          )}
                                        </li>
                                      ))}
                                    </ul>
                                  </li>
                                ))}
                              </ul>
                              {cur.mcqs && cur.mcqs.length > 0 && (
                                <small className="text-success ms-2">
                                  (Universal MCQs: {Array.isArray(cur.mcqs) ? cur.mcqs.length : 0})
                                </small>
                              )}
                            </td>
                            <td>
                              <button
                                className="btn btn-sm btn-warning me-2"
                                onClick={() => startEdit(cur)}
                              >
                                Edit
                              </button>
                              <button
                                className="btn btn-sm btn-danger"
                                onClick={() => handleDelete(cur.id!)}
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* EDIT MODAL */}
            {editCurriculum && (
              <div className="modal show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.5)" }}>
                <div className="modal-dialog modal-xl">
                  <div className="modal-content">
                    <div className="modal-header">
                      <h5 className="modal-title">Edit Curriculum: {editCurriculum.subject}</h5>
                      <button type="button" className="btn-close" onClick={cancelEdit}></button>
                    </div>
                    <div className="modal-body">
                      <Form>
                        <Form.Control
                          name="subject"
                          value={editCurriculum.subject}
                          onChange={(e) => setEditCurriculum({
                            ...editCurriculum,
                            subject: e.target.value ?? "",
                            chapters: editCurriculum.chapters ?? [],
                          })}
                          className="mb-3"
                          placeholder="Edit Subject"
                        />
                        <div className="text-muted">
                          <small>Edit functionality for chapters and MCQs can be expanded here</small>
                        </div>
                      </Form>
                    </div>
                    <div className="modal-footer">
                      <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                      <button className="btn btn-primary" onClick={handleEditSubmit} disabled={saving}>
                        {saving ? 'Saving...' : 'Save Changes'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default UploadContent;
