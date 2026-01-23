"use client";
import Link from "next/link";
import Image from "next/image";
import { useEffect, useState } from "react";
import { FaArrowRight, FaGraduationCap } from "@/lib/fontAwesomeIconsComplete";

interface CourseType {
  id: string;
  title: string;
  thumb: string;
  createdAt: string;
}

const Categories = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/homepage-courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      } else {
        console.error('Failed to fetch courses');
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <section className="categories-area section-py-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-12 text-center">
              <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "300px" }}>
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading courses...</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="categories-area section-py-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-8 col-lg-10">
            <div className="section__title text-center mb-50">
              <span className="sub-title">Access a meticulously organized repository of medical sciences, tailored for academic rigor and clinical mastery.</span>
              <h2 className="title">Explore Medical Subjects</h2>
              <p className="desc">Discover comprehensive medical courses designed for excellence in learning and practice.</p>
            </div>
          </div>
        </div>

        <div className="row g-3">
          {courses.length > 0 ? (
            courses.map((course) => (
              <div key={course.id} className="col-xl-2 col-lg-3 col-md-4 col-sm-6 col-12">
                <Link href="/courses" className="text-decoration-none">
                  <div className="course-card h-100 bg-white rounded-3 overflow-hidden shadow-sm">
                    <div className="course-image-wrapper position-relative">
                      <Image
                        src={course.thumb}
                        alt={course.title}
                        width={400}
                        height={400}
                        className="course-image w-100"
                        style={{ 
                          height: "200px", 
                          objectFit: "cover",
                          transition: "all 0.3s ease"
                        }}
                      />
                      <div className="overlay-gradient position-absolute top-0 start-0 w-100 h-100 d-flex align-items-end p-2">
                        <div className="course-badge bg-primary text-white px-2 py-1 rounded-pill small fw-semibold">
                          Featured
                        </div>
                      </div>
                    </div>
                    
                    <div className="course-content p-3">
                      <div className="d-flex align-items-start justify-content-between">
                        <span className="course-title text-white fw-bold mb-2 lh-sm">
                          {course.title}
                        </span>
                        
                        <div className="course-arrow text-primary ms-2 mt-1">
                          <FaArrowRight aria-hidden />
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              </div>
            ))
          ) : (
            <div className="col-12 text-center py-5">
              <div className="empty-state">
                <FaGraduationCap className="text-muted mb-3" style={{ fontSize: "3rem" }} aria-hidden />
                <h5 className="text-muted mb-2">No Courses Available</h5>
                <p className="text-muted">Courses will appear here once they are added.</p>
              </div>
            </div>
          )}
        </div>

        {courses.length > 0 && (
          <div className="row mt-4">
            <div className="col-12 text-center">
              <Link 
                href="/courses" 
                className="hero-cta text-decoration-none"
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "12px",
                  background: "#5dba47",
                  color: "#fff",
                  borderRadius: "10px",
                  padding: "16px 30px",
                  fontWeight: 600,
                  fontSize: "18px",
                  transition: "all 0.3s ease",
                  width: "fit-content",
                  boxShadow: "0 4px 15px rgba(93, 186, 71, 0.3)",
                  border: "none",
                  position: "relative",
                  overflow: "hidden",
                }}
                onMouseEnter={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#4a9c38";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 25px rgba(93, 186, 71, 0.4)";
                }}
                onMouseLeave={(e) => {
                  (e.currentTarget as HTMLAnchorElement).style.background = "#5dba47";
                  (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
                  (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 4px 15px rgba(93, 186, 71, 0.3)";
                }}
              >
                <span
                  className="btn-shine"
                  style={{
                    position: "absolute",
                    top: "0",
                    left: "-100%",
                    width: "100%",
                    height: "100%",
                    background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                    transition: "left 0.5s ease",
                    zIndex: 1,
                  }}
                />
                <span
                  className="btn-text"
                  style={{
                    position: "relative",
                    zIndex: 2,
                  }}
                >
                  Explore All Courses
                </span>
                <span
                  className="btn-arrow"
                  style={{
                    position: "relative",
                    zIndex: 2,
                    fontSize: "14px",
                    transition: "transform 0.3s ease",
                    background: "rgba(255,255,255,0.2)",
                    width: "24px",
                    height: "24px",
                    borderRadius: "50%",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  &rarr;
                </span>
              </Link>
            </div>
          </div>
        )}
      </div>

      {/* Custom Styles */}
      <style jsx>{`
        .course-card {
          transition: all 0.3s ease;
          border: 2px solid #0d447a;
          max-width: 100%;
          cursor: pointer;
          min-height: 270px;
          display: flex;
          flex-direction: column;
        }
        .course-card:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1) !important;
          border-color: #5dba47;
        }
        .course-card:hover .course-image {
          transform: scale(1.05);
        }
        .course-card:hover .course-arrow {
          transform: translateX(3px);
        }
        .course-image-wrapper {
          overflow: hidden;
          position: relative;
        }
        .overlay-gradient {
          background: linear-gradient(
            to top,
            rgba(0, 0, 0, 0.6) 0%,
            rgba(0, 0, 0, 0.2) 50%,
            transparent 100%
          );
          opacity: 0;
          transition: all 0.3s ease;
        }
        .course-card:hover .overlay-gradient {
          opacity: 1;
        }
        .course-title {
          font-size: 0.95rem;
          line-height: 1.3;
          display: inline-block;
          background: #0d447a;
          padding: 6px 10px;
          border-radius: 6px;
          margin: 0;
          width: fit-content;
          max-width: calc(100% - 30px);
          word-wrap: break-word;
        }
        .course-badge {
          font-size: 0.75rem;
          background: #5dba47 !important;
          transform: translateY(0);
          opacity: 1;
          transition: all 0.3s ease;
        }
        .course-arrow {
          transition: all 0.3s ease;
          font-size: 0.9rem;
          flex-shrink: 0;
          color: #0d447a;
        }
        .course-content {
          min-height: 80px;
          display: flex;
          flex-direction: column;
        }
        .empty-state {
          padding: 3rem 0;
        }
        /* Responsive grid for course cards */
        @media (min-width: 1400px) {
          .col-xl-2 {
            flex: 0 0 20%;
            max-width: 20%;
          }
        }
        @media (max-width: 1399px) {
          .col-xl-2 {
            flex: 0 0 25%;
            max-width: 25%;
          }
        }
        @media (max-width: 1199px) {
          .col-xl-2, .col-lg-3 {
            flex: 0 0 33.3333%;
            max-width: 33.3333%;
          }
          .course-title {
            font-size: 0.9rem;
          }
        }
        @media (max-width: 991px) {
          .col-xl-2, .col-lg-3, .col-md-4 {
            flex: 0 0 50%;
            max-width: 50%;
          }
          .course-title {
            font-size: 1rem;
          }
          .course-content {
            padding: 1rem;
          }
          .course-image {
            height: 160px !important;
          }
        }
        @media (max-width: 767px) {
          .col-xl-2, .col-lg-3, .col-md-4, .col-sm-6 {
            flex: 0 0 100%;
            max-width: 100%;
          }
          .course-title {
            font-size: 1.1rem;
          }
          .course-content {
            padding: 1rem;
          }
          .course-image {
            height: 140px !important;
          }
        }
        @media (max-width: 575px) {
          .course-image {
            height: 120px !important;
          }
          .course-card {
            min-height: 180px;
          }
        }
        .hero-cta:hover .btn-shine {
          left: 100% !important;
        }
        .hero-cta:hover .btn-arrow {
          transform: translateX(3px) !important;
          background: rgba(255, 255, 255, 0.3) !important;
        }
      `}</style>
    </section>
  );
};

export default Categories;
