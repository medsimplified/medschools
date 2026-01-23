"use client";

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import {
  FaLock,
  FaUnlock,
  FaExclamationTriangle,
  FaSearch,
  FaUserCircle,
  FaClock,
  FaLanguage,
  FaGraduationCap,
  FaBrain,
  FaListUl,
  FaBookmark,
  FaFilePdf,
  FaStethoscope,
  FaSitemap,
  FaCircle,
  FaRocket,
  FaStar,
  FaPlayCircle,
  FaInfinity,
  FaCreditCard,
  FaCrown,
  FaYoutube
} from '@/lib/fontAwesomeIconsComplete';

interface CourseDetailsProps {
  courseTitle: string;
}

const CourseDetailsArea = ({ courseTitle }: CourseDetailsProps) => {
  const [course, setCourse] = useState<any>(null);
  const [curriculum, setCurriculum] = useState<any>(null);
  const [isRegistered, setIsRegistered] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedContent, setSelectedContent] = useState<{type: string, title: string} | null>(null);
  const router = useRouter();

  // Brand colors - YOUR ACTUAL BRAND COLORS
  const brandColors = {
    primary: '#0d447a',      // Medical Blue - YOUR PRIMARY COLOR
    secondary: '#5dba47',    // Medical Green - YOUR SECONDARY COLOR  
    accent: '#ffd700',       // Gold
    light: '#f8fafc',
    white: '#ffffff',
    gray: '#64748b',
    lightBg: '#f1f5f9'
  };

  // Fix: Wrap fetchCourseDetails in useCallback to avoid useEffect dependency warning
  const fetchCourseDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      console.log('🚀 Starting data fetch for:', courseTitle);
      
      const curriculumRes = await fetch(`/api/course-curriculum/${encodeURIComponent(courseTitle)}`);
      console.log('📡 Curriculum API response status:', curriculumRes.status);
      
      if (curriculumRes.ok) {
        const curriculumData = await curriculumRes.json();
        console.log('✅ Curriculum data received:', curriculumData);
        setCurriculum(curriculumData);
        
        const courseData = {
          id: curriculumData.id,
          title: curriculumData.subject,
          category: "Medical Education",
          description: `Complete medical course on ${curriculumData.subject}`,
          thumb: "/assets/img/courses/course_thumb01.jpg",
          instructors: "Dr. Bhanu Prakash",
          price: 29.99,
          videoUrl: curriculumData.introVideoUrl,
        };
        setCourse(courseData);
        console.log('✅ Generated course data:', courseData);
      } else {
        const errorText = await curriculumRes.text();
        console.error('❌ Curriculum API failed:', errorText);
        setError(`Failed to load course: ${errorText}`);
      }
      
    } catch (error) {
      console.error('💥 Fetch error:', error);
      setError('Failed to load course content');
    } finally {
      setLoading(false);
    }
  }, [courseTitle]);

  const checkUserRegistration = () => {
    setIsRegistered(false);
  };

  useEffect(() => {
    console.log('🔄 CourseDetailsArea mounted with courseTitle:', courseTitle);
    fetchCourseDetails();
    checkUserRegistration();
  }, [courseTitle, fetchCourseDetails]);

  const handleRestrictedContent = (type: string, title: string) => {
    setSelectedContent({ type, title });
    setShowPaymentModal(true);
  };

  const handleSubscriptionRedirect = async () => {
    try {
      router.push('/student-registration');
    } catch (error) {
      console.error('Payment error:', error);
      router.push('/student-registration');
    }
  };

  const BlurredContent = ({ 
    children, 
    type, 
    title 
  }: { 
    children?: React.ReactNode; 
    type: string; 
    title: string;
  }) => (
    <div className="position-relative overflow-hidden rounded-3" style={{ minHeight: '120px' }}>
      <div 
        className="position-absolute top-0 start-0 w-100 h-100 d-flex align-items-center justify-content-center"
        style={{ 
          background: `linear-gradient(135deg, ${brandColors.primary}f0 0%, ${brandColors.secondary}f0 100%)`,
          cursor: 'pointer',
          zIndex: 1
        }}
        onClick={() => handleRestrictedContent(type, title)}
      >
        <div className="text-center text-white p-3">
          <FaLock className="mb-3" style={{ fontSize: '2rem', color: brandColors.accent }} />
          <h6 className="fw-bold mb-2" style={{ color: brandColors.white }}>Premium {type}</h6>
          <p className="mb-3 small opacity-90">Click to unlock access</p>
          <button 
            className="btn btn-sm px-3 py-2 fw-bold"
            style={{
              backgroundColor: brandColors.accent,
              border: 'none',
              color: brandColors.primary,
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}
          >
            <FaUnlock className="me-1" />
            Unlock Now
          </button>
        </div>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "60vh", backgroundColor: brandColors.light }}>
        <div className="text-center">
          <div 
            className="spinner-border mb-3" 
            role="status"
            style={{ color: brandColors.primary, width: '3rem', height: '3rem' }}
          >
            <span className="visually-hidden">Loading...</span>
          </div>
          <p style={{ color: brandColors.primary, fontWeight: '600', fontSize: '1.1rem' }}>Loading course content...</p>
          <small style={{ color: brandColors.gray }}>Course: {courseTitle}</small>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container py-5" style={{ backgroundColor: brandColors.light, minHeight: '60vh' }}>
        <div className="text-center">
          <FaExclamationTriangle className="mb-3" style={{ color: '#dc3545', fontSize: '3rem' }} />
          <h3 style={{ color: '#dc3545' }}>Error Loading Course</h3>
          <p style={{ color: brandColors.gray }}>{error}</p>
          <button 
            className="btn btn-primary me-2"
            onClick={() => fetchCourseDetails()}
            style={{ backgroundColor: brandColors.primary, borderColor: brandColors.primary }}
          >
            Try Again
          </button>
          <button 
            className="btn btn-outline-secondary"
            onClick={() => router.push('/courses')}
            style={{ borderColor: brandColors.gray, color: brandColors.gray }}
          >
            Browse Courses
          </button>
        </div>
      </div>
    );
  }

  if (!curriculum) {
    return (
      <div className="container py-5" style={{ backgroundColor: brandColors.light, minHeight: '60vh' }}>
        <div className="text-center">
          <FaSearch className="mb-3" style={{ color: brandColors.primary, fontSize: '3rem' }} />
          <h3 style={{ color: brandColors.primary }}>Course Not Found</h3>
          {/* Escape double quotes */}
          <p style={{ color: brandColors.gray }}>The course &quot;{courseTitle}&quot; could not be found in our database.</p>
          <button 
            className="btn btn-primary"
            onClick={() => router.push('/courses')}
            style={{ backgroundColor: brandColors.primary, borderColor: brandColors.primary }}
          >
            Browse All Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="course-details-area py-5" style={{ backgroundColor: brandColors.light, minHeight: '100vh' }}>
        <div className="container">
          <div className="row">
            {/* Course Header */}
            <div className="col-12 mb-4">
              <div 
                className="p-4 rounded-4 shadow-sm"
                style={{ backgroundColor: brandColors.white, border: `2px solid ${brandColors.lightBg}` }}
              >
                <div className="row align-items-center">
                  <div className="col-md-8">
                    <span 
                      className="badge mb-3 px-3 py-2"
                      style={{ 
                        backgroundColor: brandColors.primary, 
                        color: brandColors.white, 
                        fontSize: '0.9rem',
                        fontWeight: '600'
                      }}
                    >
                      Medical Education
                    </span>
                    <h1 
                      className="mb-3" 
                      style={{ 
                        color: brandColors.primary, 
                        fontWeight: '800',
                        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                        lineHeight: '1.2'
                      }}
                    >
                      {curriculum?.subject || courseTitle}
                    </h1>
                    <div className="d-flex flex-wrap gap-4">
                      <div className="d-flex align-items-center">
                        <FaUserCircle className="me-2" style={{ color: brandColors.secondary, fontSize: '1.2rem' }} />
                        <span style={{ color: brandColors.gray, fontWeight: '500' }}>Dr. Bhanu Prakash</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaClock className="me-2" style={{ color: brandColors.secondary, fontSize: '1.2rem' }} />
                        <span style={{ color: brandColors.gray, fontWeight: '500' }}>Self-paced</span>
                      </div>
                      <div className="d-flex align-items-center">
                        <FaLanguage className="me-2" style={{ color: brandColors.secondary, fontSize: '1.2rem' }} />
                        <span style={{ color: brandColors.gray, fontWeight: '500' }}>English</span>
                      </div>
                    </div>
                  </div>
                  <div className="col-md-4 text-end">
                    <Image 
                      src="/assets/img/courses/course_thumb01.jpg" 
                      alt={curriculum?.subject || courseTitle}
                      width={300}
                      height={180}
                      className="rounded-3 shadow-sm"
                      style={{ objectFit: 'cover' }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Course Content */}
            <div className="col-lg-8">
              {/* Subject Introduction Video */}
              {curriculum?.introVideoUrl && (
                <div className="mb-4">
                  <div className="p-4 rounded-3" style={{ backgroundColor: brandColors.white, border: `2px solid ${brandColors.lightBg}` }}>
                    <h5 className="mb-3 d-flex align-items-center" style={{ color: brandColors.primary, fontWeight: '700' }}>
                          <FaGraduationCap className="me-2" style={{ color: brandColors.secondary, fontSize: '1.3rem' }} />
                      Course Introduction
                    </h5>
                    <div className="ratio ratio-16x9">
                      <iframe 
                        src={curriculum.introVideoUrl}
                        title="Course Introduction"
                        allowFullScreen
                        className="rounded-2"
                        style={{ border: `3px solid ${brandColors.secondary}` }}
                      ></iframe>
                    </div>
                  </div>
                </div>
              )}

              {/* Universal MCQs Badge */}
              {curriculum?.mcqs && curriculum.mcqs.length > 0 && (
                <div className="mb-4">
                  <div 
                    className="alert d-flex align-items-center p-4"
                    style={{ 
                      backgroundColor: `${brandColors.accent}20`,
                      border: `2px solid ${brandColors.accent}`,
                      borderRadius: '12px'
                    }}
                  >
                        <FaBrain className="me-3" style={{ color: brandColors.primary, fontSize: '2rem' }} />
                    <div>
                      <h6 className="mb-1 fw-bold" style={{ color: brandColors.primary }}>Practice MCQs Available!</h6>
                      <p className="mb-0" style={{ color: brandColors.gray }}>
                        This course includes <strong style={{ color: brandColors.secondary }}>{curriculum.mcqs.length}</strong> practice questions for self-assessment.
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Curriculum Chapters */}
              {curriculum?.chapters && curriculum.chapters.length > 0 ? (
                <div>
                  <h4 className="mb-4 d-flex align-items-center" style={{ color: brandColors.primary, fontWeight: '800' }}>
                      <FaListUl className="me-3" style={{ color: brandColors.secondary, fontSize: '1.4rem' }} />
                    Course Curriculum ({curriculum.chapters.length} Chapters)
                  </h4>
                  
                  <div className="accordion" id="curriculumAccordion">
                    {curriculum.chapters.map((chapter: any, chapterIndex: number) => (
                      <div key={chapterIndex} className="accordion-item mb-3 border-0 shadow-sm rounded-3 overflow-hidden">
                        <h2 className="accordion-header">
                          <button
                            className="accordion-button collapsed fw-bold"
                            type="button"
                            data-bs-toggle="collapse"
                            data-bs-target={`#chapter${chapterIndex}`}
                            style={{ 
                              backgroundColor: brandColors.primary,
                              color: brandColors.white,
                              border: 'none',
                              borderRadius: '0',
                              padding: '1.2rem 1.5rem',
                              fontSize: '1.1rem'
                            }}
                          >
                            <span 
                              className="me-3 d-flex align-items-center justify-content-center fw-bold"
                              style={{
                                backgroundColor: 'rgba(255,255,255,0.25)',
                                width: '35px',
                                height: '35px',
                                borderRadius: '50%',
                                fontSize: '1rem'
                              }}
                            >
                              {chapterIndex + 1}
                            </span>
                            <div>
                              <div style={{ fontSize: '1.1rem' }}>{chapter.chapter}</div>
                              <small className="opacity-80" style={{ fontSize: '0.85rem' }}>
                                {chapter.topics?.length || 0} topics available
                              </small>
                            </div>
                          </button>
                        </h2>
                        <div
                          id={`chapter${chapterIndex}`}
                          className="accordion-collapse collapse"
                          data-bs-parent="#curriculumAccordion"
                        >
                          <div className="accordion-body p-4" style={{ backgroundColor: brandColors.white }}>
                            {chapter.topics && chapter.topics.length > 0 ? (
                              chapter.topics.map((topic: any, topicIndex: number) => (
                                <div 
                                  key={topicIndex} 
                                  className="mb-4 p-4 rounded-3 shadow-sm"
                                  style={{ 
                                    backgroundColor: brandColors.light, 
                                    border: `2px solid ${brandColors.lightBg}` 
                                  }}
                                >
                                  <h6 className="d-flex align-items-center mb-3" style={{ color: brandColors.primary, fontWeight: '700', fontSize: '1.1rem' }}>
                                    <FaBookmark className="me-2" style={{ color: brandColors.secondary, fontSize: '1.1rem' }} />
                                    {topic.topic}
                                  </h6>

                                  {/* Topic Video */}
                                  {topic.youtubeUrl && (
                                    <div className="mb-3">
                                      <div className="ratio ratio-16x9">
                                        <iframe 
                                          src={topic.youtubeUrl}
                                          title={topic.topic}
                                          allowFullScreen
                                          className="rounded-2"
                                          style={{ border: `3px solid ${brandColors.secondary}` }}
                                        ></iframe>
                                      </div>
                                    </div>
                                  )}

                                  {/* Topic Resources */}
                                  <div className="row g-3 mb-3">
                                    {topic.pdf && (
                                      <div className="col-md-6">
                                        {isRegistered ? (
                                          <a 
                                            href={topic.pdf} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn w-100 py-3"
                                            style={{ 
                                              backgroundColor: brandColors.white,
                                              borderColor: brandColors.primary, 
                                              color: brandColors.primary,
                                              border: `3px solid ${brandColors.primary}`,
                                              fontWeight: '700',
                                              borderRadius: '12px'
                                            }}
                                          >
                                            <FaFilePdf className="me-2" />
                                            Download PDF
                                          </a>
                                        ) : (
                                          <BlurredContent type="PDF" title={topic.topic} />
                                        )}
                                      </div>
                                    )}

                                    {topic.caseStudy && (
                                      <div className="col-md-6">
                                        {isRegistered ? (
                                          <a 
                                            href={topic.caseStudy} 
                                            target="_blank" 
                                            rel="noopener noreferrer"
                                            className="btn w-100 py-3"
                                            style={{ 
                                              backgroundColor: brandColors.white,
                                              borderColor: brandColors.secondary, 
                                              color: brandColors.secondary,
                                              border: `3px solid ${brandColors.secondary}`,
                                              fontWeight: '700',
                                              borderRadius: '12px'
                                            }}
                                          >
                                            <FaStethoscope className="me-2" />
                                            Case Study
                                          </a>
                                        ) : (
                                          <BlurredContent type="Case Study" title={topic.topic} />
                                        )}
                                      </div>
                                    )}
                                  </div>

                                  {/* Subtopics */}
                                  {topic.subtopics && topic.subtopics.length > 0 && (
                                    <div>
                                      <h6 className="mb-3 d-flex align-items-center" style={{ color: brandColors.secondary, fontWeight: '700' }}>
                                        <FaSitemap className="me-2" />
                                        Subtopics ({topic.subtopics.length})
                                      </h6>
                                      <div className="row g-3">
                                        {topic.subtopics.map((subtopic: any, subtopicIndex: number) => (
                                          <div key={subtopicIndex} className="col-md-6">
                                            <div 
                                              className="p-3 rounded-2 border shadow-sm"
                                              style={{ 
                                                backgroundColor: brandColors.white,
                                                borderColor: brandColors.lightBg,
                                                border: `2px solid ${brandColors.lightBg}`
                                              }}
                                            >
                                              <h6 className="mb-2" style={{ color: brandColors.primary, fontSize: '0.95rem', fontWeight: '600' }}>
                                                <FaCircle className="me-2" style={{ color: brandColors.secondary, fontSize: '0.6rem' }} />
                                                {subtopic.title}
                                              </h6>
                                              
                                              <div className="d-flex gap-2 flex-wrap">
                                                {subtopic.pdf && (
                                                  isRegistered ? (
                                                    <a 
                                                      href={subtopic.pdf} 
                                                      target="_blank"
                                                      className="btn btn-sm"
                                                      style={{ 
                                                        backgroundColor: brandColors.primary, 
                                                        color: brandColors.white, 
                                                        fontSize: '0.8rem',
                                                        fontWeight: '600',
                                                        border: 'none',
                                                        borderRadius: '8px'
                                                      }}
                                                    >
                                                      <FaFilePdf className="me-1" />
                                                      PDF
                                                    </a>
                                                  ) : (
                                                    <button 
                                                      className="btn btn-sm"
                                                      style={{ 
                                                        backgroundColor: brandColors.primary, 
                                                        color: brandColors.white, 
                                                        fontSize: '0.8rem',
                                                        fontWeight: '600',
                                                        border: 'none',
                                                        borderRadius: '8px'
                                                      }}
                                                      onClick={() => handleRestrictedContent('PDF', subtopic.title)}
                                                    >
                                                      <FaLock className="me-1" />
                                                      PDF
                                                    </button>
                                                  )
                                                )}
                                                
                                                {subtopic.youtubeUrl && (
                                                  <a 
                                                    href={subtopic.youtubeUrl} 
                                                    target="_blank"
                                                    className="btn btn-sm"
                                                    style={{ 
                                                      backgroundColor: '#dc3545', 
                                                      color: brandColors.white, 
                                                      fontSize: '0.8rem',
                                                      fontWeight: '600',
                                                      border: 'none',
                                                      borderRadius: '8px'
                                                    }}
                                                  >
                                                    <FaYoutube className="me-1" />
                                                    Video
                                                  </a>
                                                )}
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              ))
                            ) : (
                              <p style={{ color: brandColors.gray }}>No topics available for this chapter.</p>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="alert alert-warning">
                  <h5>No Curriculum Data Available</h5>
                  {/* Escape single quote */}
                  <p>This course doesn&apos;t have detailed curriculum information yet.</p>
                </div>
              )}
            </div>

            {/* Sidebar */}
            <div className="col-lg-4">
              <div className="sticky-top" style={{ top: '20px' }}>
                {/* Enrollment Card */}
                <div 
                  className="p-4 rounded-3 shadow-sm mb-4 text-center"
                  style={{ 
                    background: `linear-gradient(135deg, ${brandColors.primary} 0%, #1e40af 100%)`,
                    color: brandColors.white
                  }}
                >
                  <FaGraduationCap className="mb-3" style={{ opacity: 0.9, fontSize: '4rem' }} />
                  <h5 className="fw-bold mb-2">Ready to Start Learning?</h5>
                  <p className="mb-4 opacity-90">Join our medical education community</p>
                  <div className="mb-3">
                    <div className="h3 fw-bold mb-0">$29.99</div>
                    <small className="opacity-75">One-time • Lifetime access</small>
                  </div>
                  <button 
                    className="btn btn-lg w-100 mb-3 fw-bold py-3"
                    style={{ 
                      backgroundColor: brandColors.accent,
                      border: 'none',
                      color: brandColors.primary,
                      borderRadius: '12px',
                      fontWeight: '700'
                    }}
                    onClick={() => setShowPaymentModal(true)}
                  >
                    <FaRocket className="me-2" />
                    Enroll Now
                  </button>
                  <div className="d-flex gap-2">
                    <button 
                      className="btn btn-sm btn-outline-light flex-fill"
                      onClick={() => router.push('/login')}
                      style={{ fontWeight: '500' }}
                    >
                      Login
                    </button>
                    <button 
                      className="btn btn-sm btn-outline-light flex-fill"
                      onClick={() => router.push('/student-registration')}
                      style={{ fontWeight: '500' }}
                    >
                      Register
                    </button>
                  </div>
                </div>

                {/* Features Card */}
                <div className="p-4 rounded-3 shadow-sm" style={{ backgroundColor: brandColors.white }}>
                  <h6 className="fw-bold mb-3 d-flex align-items-center" style={{ color: brandColors.primary }}>
                    <FaStar className="me-2" style={{ color: brandColors.accent }} />
                    What is Included
                  </h6>
                  <div className="list-unstyled">
                    <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                      <FaPlayCircle className="me-3" style={{ color: brandColors.secondary, fontSize: '1.2rem' }} />
                      <span style={{ color: brandColors.gray, fontWeight: '500' }}>HD Video Lectures</span>
                    </div>
                    <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                      <FaFilePdf className="me-3" style={{ color: '#dc3545', fontSize: '1.2rem' }} />
                      <span style={{ color: brandColors.gray, fontWeight: '500' }}>Downloadable Notes</span>
                    </div>
                    <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                      <FaBrain className="me-3" style={{ color: '#6f42c1', fontSize: '1.2rem' }} />
                      <span style={{ color: brandColors.gray, fontWeight: '500' }}>Practice MCQs</span>
                    </div>
                    <div className="d-flex align-items-center mb-3 pb-2 border-bottom">
                      <FaStethoscope className="me-3" style={{ color: '#20c997', fontSize: '1.2rem' }} />
                      <span style={{ color: brandColors.gray, fontWeight: '500' }}>Case Studies</span>
                    </div>
                    <div className="d-flex align-items-center">
                      <FaInfinity className="me-3" style={{ color: '#fd7e14', fontSize: '1.2rem' }} />
                      <span style={{ color: brandColors.gray, fontWeight: '500' }}>Lifetime Access</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div 
          className="modal show d-block" 
          tabIndex={-1} 
          style={{ background: 'rgba(0,0,0,0.8)' }}
          onClick={() => setShowPaymentModal(false)}
        >
          <div className="modal-dialog modal-dialog-centered" onClick={e => e.stopPropagation()}>
            <div className="modal-content border-0 shadow-lg rounded-4">
              <div 
                className="modal-header text-white border-0"
                style={{ 
                  background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
                  borderRadius: '16px 16px 0 0'
                }}
              >
                <div className="d-flex align-items-center">
                  <FaGraduationCap className="me-3" style={{ fontSize: '2rem' }} />
                  <div>
                    <h5 className="modal-title fw-bold mb-0">Unlock Premium Access</h5>
                    <small className="opacity-90">Join our medical community</small>
                  </div>
                </div>
                <button 
                  type="button" 
                  className="btn-close btn-close-white" 
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              
              <div className="modal-body p-4 text-center">
                <FaCrown className="mb-3" style={{ color: brandColors.accent, fontSize: '3rem' }} />
                <h6 className="fw-bold" style={{ color: brandColors.primary }}>
                  Access: <span style={{ color: brandColors.secondary }}>{selectedContent?.title}</span>
                </h6>
                <p style={{ color: brandColors.gray }} className="mb-4">
                  This {selectedContent?.type} is part of our premium medical curriculum
                </p>
                
                <div className="p-3 rounded mb-4" style={{ backgroundColor: brandColors.light }}>
                  <div className="h4 fw-bold mb-0" style={{ color: brandColors.secondary }}>$29.99</div>
                  <small style={{ color: brandColors.gray }}>Complete Course Access</small>
                </div>
              </div>
              
              <div className="modal-footer border-0 p-4">
                <button 
                  className="btn btn-lg w-100 fw-bold py-3"
                  style={{
                    background: `linear-gradient(135deg, ${brandColors.primary} 0%, ${brandColors.secondary} 100%)`,
                    border: 'none',
                    color: brandColors.white,
                    borderRadius: '12px'
                  }}
                  onClick={handleSubscriptionRedirect}
                >
                  <FaCreditCard className="me-2" />
                  Continue to Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .accordion-button:not(.collapsed) {
          background-color: ${brandColors.secondary} !important;
          color: ${brandColors.white} !important;
        }
        
        .accordion-button:focus {
          box-shadow: 0 0 0 0.25rem rgba(13, 68, 122, 0.25) !important;
        }
      `}</style>
    </>
  );
};

export default CourseDetailsArea;
