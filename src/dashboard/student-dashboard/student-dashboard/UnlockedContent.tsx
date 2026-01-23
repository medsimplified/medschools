"use client";
import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { FaYoutube, FaFilePdf, FaQuestionCircle, FaStethoscope } from "@/lib/fontAwesomeIconsComplete";

const UnlockedContent = () => {
  const { data: session } = useSession();
  const [content, setContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchUnlockedContent();
  }, []);

  const fetchUnlockedContent = async () => {
    try {
      const res = await fetch("/api/student/unlocked-content");
      const data = await res.json();
      setContent(data.content || []);
    } catch (err) {
      console.error("Failed to fetch unlocked content", err);
    } finally {
      setLoading(false);
    }
  };

  const downloadPDF = async (topicId: string, type: 'pdf' | 'mcq' | 'caseStudy', fileName: string) => {
    try {
      const res = await fetch(`/api/student/download?topicId=${topicId}&type=${type}`);
      
      if (!res.ok) {
        alert("You don't have access to this content. Please subscribe.");
        return;
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (err) {
      console.error("Download error:", err);
      alert("Failed to download. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="dashboard__content-wrap">
        <div className="dashboard__content-title">
          <h4 className="title">My Learning Materials</h4>
        </div>
        <div style={{ textAlign: 'center', padding: 60 }}>Loading...</div>
      </div>
    );
  }

  return (
    <div className="dashboard__content-wrap">
      <div className="dashboard__content-title" style={{ marginBottom: 24 }}>
        <h4 className="title" style={{ fontWeight: 900, fontSize: 24 }}>My Learning Materials</h4>
        <p style={{ color: '#666', fontSize: 14, marginTop: 8 }}>
          Download PDFs, MCQs, and Case Studies from your subscribed courses
        </p>
      </div>

      {content.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: 18,
          padding: 60,
          textAlign: 'center',
          boxShadow: '0 4px 24px #e3e6ed44'
        }}>
          <div style={{ fontSize: 64, marginBottom: 20 }}>📚</div>
          <h5 style={{ fontSize: 20, fontWeight: 700, marginBottom: 12, color: '#222' }}>
            No content available yet
          </h5>
          <p style={{ color: '#888', fontSize: 15 }}>
            Content will appear here once course materials are added
          </p>
        </div>
      ) : (
        <div className="row">
          {content.map((subject: any) => (
            <div key={subject.id} className="col-12 mb-4">
              <div style={{
                background: '#fff',
                borderRadius: 18,
                padding: 24,
                boxShadow: '0 4px 24px #e3e6ed44',
                border: '1.5px solid #e3e6ed'
              }}>
                <h5 style={{
                  fontSize: 20,
                  fontWeight: 800,
                  marginBottom: 20,
                  color: '#0d447a',
                  borderBottom: '2px solid #f7b32b',
                  paddingBottom: 12
                }}>
                  {subject.name}
                </h5>

                {subject.chapters?.map((chapter: any) => (
                  <div key={chapter.id} style={{ marginBottom: 24 }}>
                    <h6 style={{ fontSize: 16, fontWeight: 700, marginBottom: 12, color: '#222' }}>
                      📖 {chapter.title}
                    </h6>

                    {chapter.topics?.map((topic: any) => (
                      <div
                        key={topic.id}
                        style={{
                          background: '#f7f8fa',
                          borderRadius: 12,
                          padding: 16,
                          marginBottom: 12,
                          border: '1px solid #e3e6ed'
                        }}
                      >
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <div style={{ flex: 1 }}>
                            <h6 style={{ fontSize: 15, fontWeight: 600, marginBottom: 4, color: '#222' }}>
                              {topic.title}
                            </h6>
                            {topic.youtubeUrl && (
                              <a
                                href={topic.youtubeUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                style={{
                                  fontSize: 13,
                                  color: '#5624d0',
                                  textDecoration: 'none',
                                  display: 'inline-flex',
                                  alignItems: 'center',
                                  marginTop: 4
                                }}
                              >
                                <FaYoutube style={{ marginRight: 6 }} />
                                Watch Video
                              </a>
                            )}
                          </div>

                          <div style={{ display: 'flex', gap: 8 }}>
                            {topic.pdfUrl && (
                              <button
                                onClick={() => downloadPDF(topic.id, 'pdf', `${topic.title}_PDF.pdf`)}
                                style={{
                                  background: 'linear-gradient(135deg, #5624d0 0%, #f7b32b 100%)',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 8,
                                  padding: '8px 16px',
                                  fontSize: 13,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6
                                }}
                              >
                                <FaFilePdf /> PDF
                              </button>
                            )}

                            {topic.mcqUrl && (
                              <button
                                onClick={() => downloadPDF(topic.id, 'mcq', `${topic.title}_MCQ.pdf`)}
                                style={{
                                  background: 'linear-gradient(135deg, #f7b32b 0%, #5624d0 100%)',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 8,
                                  padding: '8px 16px',
                                  fontSize: 13,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6
                                }}
                              >
                                <FaQuestionCircle /> MCQ
                              </button>
                            )}

                            {topic.caseStudyUrl && (
                              <button
                                onClick={() => downloadPDF(topic.id, 'caseStudy', `${topic.title}_CaseStudy.pdf`)}
                                style={{
                                  background: 'linear-gradient(135deg, #0d447a 0%, #5dba47 100%)',
                                  color: '#fff',
                                  border: 'none',
                                  borderRadius: 8,
                                  padding: '8px 16px',
                                  fontSize: 13,
                                  fontWeight: 600,
                                  cursor: 'pointer',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: 6
                                }}
                              >
                                <FaStethoscope /> Case Study
                              </button>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default UnlockedContent;
