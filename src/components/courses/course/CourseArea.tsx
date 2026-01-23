'use client';
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import ReactPaginate from 'react-paginate';
import CourseSidebar from './CourseSidebar';
import CourseTop from './CourseTop';
import { FaArrowRight, FaArrowLeft } from '@/lib/fontAwesomeIconsComplete';

const CourseArea = () => {
  const [courses, setCourses] = useState<any[]>([]);
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [itemOffset, setItemOffset] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  // Fetch courses from API
  useEffect(() => {
    fetch("/api/courses/all")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        console.log("Fetched courses:", data);
        if (Array.isArray(data)) {
          setCourses(data);
          setAllCourses(data);
        } else {
          console.error("API returned non-array data:", data);
          setCourses([]);
          setAllCourses([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error fetching courses:", err);
        setError(err.message);
        setCourses([]);
        setAllCourses([]);
        setLoading(false);
      });
  }, []);

  const itemsPerPage = 12;
  const endOffset = itemOffset + itemsPerPage;
  const currentItems = Array.isArray(courses) ? courses.slice(itemOffset, endOffset) : [];
  const pageCount = Math.ceil((courses?.length || 0) / itemsPerPage);
  const startOffset = itemOffset + 1;
  const totalItems = courses?.length || 0;

  const handlePageClick = (event: any) => {
    const newOffset = (event.selected * itemsPerPage) % (courses?.length || 1);
    setItemOffset(newOffset);
  };

  const handleTabClick = (index: number) => {
    setActiveTab(index);
    setItemOffset(0);
  };

  if (loading) {
    return (
      <section className="all-courses-area section-py-120" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className="d-flex justify-content-center align-items-center" style={{ minHeight: "400px" }}>
            <div className="spinner-border" style={{ color: "#0d447a" }} role="status">
              <span className="visually-hidden">Loading courses...</span>
            </div>
          </div>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="all-courses-area section-py-120" style={{ backgroundColor: '#f8fafc' }}>
        <div className="container">
          <div className="text-center py-5">
            <p className="text-danger">Error loading courses: {error}</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="all-courses-area section-py-120" style={{ backgroundColor: '#f8fafc' }}>
      <div className="container">
        <div className="row">
          <CourseSidebar setCourses={setCourses} allCourses={allCourses} />

          <div className="col-xl-9 col-lg-8">
            <CourseTop 
              startOffset={startOffset} 
              endOffset={Math.min(endOffset, totalItems)} 
              totalItems={totalItems}
              setCourses={setCourses}
              handleTabClick={handleTabClick}
              activeTab={activeTab}
            />

            {!courses || courses.length === 0 ? (
              <div className="text-center py-5">
                <p>No courses available at the moment.</p>
              </div>
            ) : (
              <>
                <div className="row courses__grid-wrap row-cols-1 row-cols-xl-3 row-cols-lg-2 row-cols-md-2 row-cols-sm-1 g-4">
                  {currentItems.map((item: any, index: number) => (
                    <div key={item.id || index} className="col">
                      <Link href={`/course-details/${item.slug || item.id}`} style={{ textDecoration: 'none' }}>
                        <div 
                          className="courses__item" 
                          style={{
                            position: 'relative',
                            borderRadius: '16px',
                            overflow: 'hidden',
                            boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
                            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
                            height: '400px',
                            cursor: 'pointer',
                            border: '2px solid transparent'
                          }}
                          onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.05)';
                            e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.2)';
                            e.currentTarget.style.borderColor = '#667eea';
                            e.currentTarget.style.zIndex = '10';
                          }}
                          onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.1)';
                            e.currentTarget.style.borderColor = 'transparent';
                            e.currentTarget.style.zIndex = '1';
                          }}
                        >
                          {/* Background Image */}
                          <div style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            background: `linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.3) 50%, rgba(0,0,0,0.9) 100%), url(${item.thumbnail || item.thumb || '/assets/img/courses/default.jpg'})`,
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            transition: 'transform 0.4s ease'
                          }} />

                          {/* Category Badge */}
                          {item.category && (
                            <div 
                              style={{
                                position: 'absolute',
                                top: '16px',
                                left: '16px',
                                background: 'rgba(255, 255, 255, 0.95)',
                                color: '#667eea',
                                padding: '6px 16px',
                                borderRadius: '20px',
                                fontSize: '12px',
                                fontWeight: '700',
                                textTransform: 'uppercase',
                                letterSpacing: '0.5px',
                                backdropFilter: 'blur(10px)',
                                zIndex: 2
                              }}
                            >
                              {item.category}
                            </div>
                          )}

                          {/* Content Overlay */}
                          <div 
                            style={{
                              position: 'absolute',
                              bottom: 0,
                              left: 0,
                              right: 0,
                              padding: '24px',
                              zIndex: 2,
                              color: '#fff'
                            }}
                          >
                            {/* Course Title */}
                            <h3 
                              style={{
                                fontSize: '22px',
                                fontWeight: '700',
                                marginBottom: '12px',
                                lineHeight: '1.3',
                                color: '#fff',
                                textShadow: '0 2px 8px rgba(0,0,0,0.5)'
                              }}
                            >
                              {item.title || 'Untitled Course'}
                            </h3>

                            {/* Description */}
                            {item.description && (
                              <p 
                                style={{
                                  fontSize: '14px',
                                  color: 'rgba(255,255,255,0.9)',
                                  marginBottom: '16px',
                                  lineHeight: '1.5',
                                  display: '-webkit-box',
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: 'vertical',
                                  overflow: 'hidden',
                                  textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                                }}
                              >
                                {item.description}
                              </p>
                            )}

                            {/* Instructor Info */}
                            <div 
                              style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginTop: '16px'
                              }}
                            >
                              <div 
                                style={{
                                  width: '40px',
                                  height: '40px',
                                  borderRadius: '50%',
                                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: '#fff',
                                  fontWeight: '700',
                                  fontSize: '16px',
                                  border: '2px solid rgba(255,255,255,0.3)',
                                  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
                                }}
                              >
                                {(item.instructor?.name || item.instructors || 'U').charAt(0).toUpperCase()}
                              </div>
                              <div>
                                <p 
                                  style={{
                                    margin: 0,
                                    fontSize: '14px',
                                    fontWeight: '600',
                                    color: '#fff',
                                    textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                                  }}
                                >
                                  {item.instructor?.name || item.instructors || 'Unknown Instructor'}
                                </p>
                                <p 
                                  style={{
                                    margin: 0,
                                    fontSize: '12px',
                                    color: 'rgba(255,255,255,0.8)',
                                    textShadow: '0 1px 4px rgba(0,0,0,0.5)'
                                  }}
                                >
                                  Instructor
                                </p>
                              </div>
                            </div>

                            {/* Reserve Button */}
                            <button
                              style={{
                                width: '100%',
                                marginTop: '16px',
                                padding: '12px',
                                background: '#fff',
                                color: '#667eea',
                                border: 'none',
                                borderRadius: '8px',
                                fontSize: '14px',
                                fontWeight: '700',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                              }}
                              onMouseEnter={(e) => {
                                e.currentTarget.style.background = '#667eea';
                                e.currentTarget.style.color = '#fff';
                                e.currentTarget.style.transform = 'translateY(-2px)';
                              }}
                              onMouseLeave={(e) => {
                                e.currentTarget.style.background = '#fff';
                                e.currentTarget.style.color = '#667eea';
                                e.currentTarget.style.transform = 'translateY(0)';
                              }}
                            >
                              Get Started
                            </button>
                          </div>
                        </div>
                      </Link>
                    </div>
                  ))}
                </div>

                {pageCount > 1 && (
                  <nav className="pagination__wrap mt-30">
                    <ReactPaginate
                      breakLabel="..."
                      nextLabel={<FaArrowRight />}
                      onPageChange={handlePageClick}
                      pageRangeDisplayed={3}
                      pageCount={pageCount}
                      previousLabel={<FaArrowLeft />}
                      renderOnZeroPageCount={null}
                      className="list-wrap"
                    />
                  </nav>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default CourseArea;
