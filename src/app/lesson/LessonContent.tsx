"use client";
import { useState } from 'react';

const LessonContent = () => {
  const [currentLesson, setCurrentLesson] = useState(0);

  const lessons = [
    {
      title: "Introduction to the Course",
      description: "Welcome to this comprehensive learning experience.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      content: "This lesson covers the basics and what you'll learn throughout the course."
    },
    {
      title: "Getting Started",
      description: "Let's begin with the fundamentals.",
      videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
      content: "In this lesson, we'll explore the core concepts you need to know."
    }
  ];

  return (
    <div style={{ 
      padding: 40,
      minHeight: '100vh',
      background: '#f5f5f5'
    }}>
      <div style={{
        maxWidth: 1200,
        margin: '0 auto',
        background: 'white',
        borderRadius: 12,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
      }}>
        {/* Header */}
        <div style={{
          background: 'linear-gradient(135deg, #5624d0, #f7b32b)',
          color: 'white',
          padding: 30,
          textAlign: 'center'
        }}>
          <h1 style={{ 
            margin: 0,
            fontSize: 28,
            fontWeight: 'bold'
          }}>
            Interactive Lesson
          </h1>
          <p style={{ 
            margin: '10px 0 0 0',
            opacity: 0.9 
          }}>
            Lesson {currentLesson + 1} of {lessons.length}
          </p>
        </div>

        {/* Content */}
        <div style={{ 
          display: 'flex',
          minHeight: 600
        }}>
          {/* Sidebar */}
          <div style={{
            width: 300,
            background: '#f8f9fa',
            padding: 20,
            borderRight: '1px solid #e9ecef'
          }}>
            <h3 style={{ 
              color: '#5624d0',
              marginTop: 0,
              marginBottom: 20 
            }}>
              Lessons
            </h3>
            {lessons.map((lesson, index) => (
              <div
                key={index}
                onClick={() => setCurrentLesson(index)}
                style={{
                  padding: 15,
                  marginBottom: 10,
                  background: currentLesson === index ? '#5624d0' : 'white',
                  color: currentLesson === index ? 'white' : '#333',
                  borderRadius: 8,
                  cursor: 'pointer',
                  border: '1px solid #e9ecef',
                  transition: 'all 0.3s ease'
                }}
              >
                <div style={{ fontWeight: 'bold', fontSize: 14 }}>
                  Lesson {index + 1}
                </div>
                <div style={{ fontSize: 12, marginTop: 5, opacity: 0.8 }}>
                  {lesson.title}
                </div>
              </div>
            ))}
          </div>

          {/* Main Content */}
          <div style={{ 
            flex: 1,
            padding: 30
          }}>
            {/* Lesson Title */}
            <h2 style={{ 
              color: '#333',
              marginTop: 0,
              marginBottom: 10 
            }}>
              {lessons[currentLesson].title}
            </h2>
            
            <p style={{ 
              color: '#666',
              marginBottom: 30,
              fontSize: 16 
            }}>
              {lessons[currentLesson].description}
            </p>

            {/* Video Player */}
            <div style={{
              position: 'relative',
              paddingBottom: '56.25%', // 16:9 aspect ratio
              height: 0,
              marginBottom: 30,
              borderRadius: 8,
              overflow: 'hidden',
              background: '#000'
            }}>
              <iframe
                src={lessons[currentLesson].videoUrl}
                title={lessons[currentLesson].title}
                style={{
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  width: '100%',
                  height: '100%',
                  border: 'none'
                }}
                allowFullScreen
              />
            </div>

            {/* Lesson Content */}
            <div style={{
              background: '#f8f9fa',
              padding: 20,
              borderRadius: 8,
              border: '1px solid #e9ecef'
            }}>
              <h4 style={{ 
                color: '#5624d0',
                marginTop: 0 
              }}>
                Lesson Notes
              </h4>
              <p style={{ 
                color: '#333',
                lineHeight: 1.6,
                margin: 0 
              }}>
                {lessons[currentLesson].content}
              </p>
            </div>

            {/* Navigation */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              marginTop: 30
            }}>
              <button
                onClick={() => setCurrentLesson(Math.max(0, currentLesson - 1))}
                disabled={currentLesson === 0}
                style={{
                  padding: '12px 24px',
                  background: currentLesson === 0 ? '#ccc' : '#6c757d',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: currentLesson === 0 ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 'bold'
                }}
              >
                Previous Lesson
              </button>

              <button
                onClick={() => setCurrentLesson(Math.min(lessons.length - 1, currentLesson + 1))}
                disabled={currentLesson === lessons.length - 1}
                style={{
                  padding: '12px 24px',
                  background: currentLesson === lessons.length - 1 ? '#ccc' : '#5624d0',
                  color: 'white',
                  border: 'none',
                  borderRadius: 6,
                  cursor: currentLesson === lessons.length - 1 ? 'not-allowed' : 'pointer',
                  fontSize: 14,
                  fontWeight: 'bold'
                }}
              >
                Next Lesson
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LessonContent;