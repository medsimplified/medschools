"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import Image from "next/image";
import Wrapper from "@/layouts/Wrapper";

const CourseDetailsBySlug = () => {
  const params = useParams();
  const slug = params?.slug as string;
  const [course, setCourse] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!slug) return;

    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await fetch(`/api/courses/${encodeURIComponent(slug)}`);
        
        if (!res.ok) {
          throw new Error(`Course not found: ${slug}`);
        }
        
        const data = await res.json();
        setCourse(data);
      } catch (err) {
        console.error("Error fetching course:", err);
        setError(err instanceof Error ? err.message : "Failed to load course");
      } finally {
        setLoading(false);
      }
    };

    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <Wrapper>
        <div className="container py-5">
          <div className="text-center">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3">Loading course...</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  if (error || !course) {
    return (
      <Wrapper>
        <div className="container py-5">
          <div className="alert alert-danger">
            <h4>Course Not Found</h4>
            <p>{error || `Course with slug "${slug}" was not found.`}</p>
          </div>
        </div>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <div className="container py-5">
        <div className="row">
          <div className="col-lg-8">
            <h1>{course.title}</h1>
            {course.thumb && (
              <Image 
                src={course.thumb} 
                alt={course.title} 
                width={800}
                height={400}
                className="img-fluid rounded mb-4"
                style={{ objectFit: "cover" }}
              />
            )}
            
            <div className="course-description mb-4">
              <h3>Description</h3>
              <p>{course.description || "No description available."}</p>
            </div>

            {course.videoUrl && (
              <div className="course-video mb-4">
                <h3>Course Preview</h3>
                <div className="ratio ratio-16x9">
                  <iframe
                    src={course.videoUrl}
                    title={course.title}
                    allowFullScreen
                  ></iframe>
                </div>
              </div>
            )}
          </div>

          <div className="col-lg-4">
            <div className="card">
              <div className="card-body">
                <h5 className="card-title">Course Information</h5>
                
                {course.price !== undefined && (
                  <div className="mb-3">
                    <strong>Price:</strong>
                    <div className="h4 text-primary">
                      {course.price === 0 ? "Free" : `₹${course.price}`}
                    </div>
                  </div>
                )}

                {course.category && (
                  <div className="mb-3">
                    <strong>Category:</strong>
                    <div>{course.category}</div>
                  </div>
                )}

                {course.instructors && (
                  <div className="mb-3">
                    <strong>Instructor:</strong>
                    <div>{course.instructors}</div>
                  </div>
                )}

                <button className="btn btn-primary w-100 mt-3">
                  Enroll Now
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Wrapper>
  );
};

export default CourseDetailsBySlug;
