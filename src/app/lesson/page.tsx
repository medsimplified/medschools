"use client";
import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
import Wrapper from "@/layouts/Wrapper";

// Dynamically import components that use DOM APIs
const LessonContent = dynamic(
  () => import('./LessonContent'),
  { 
    ssr: false,
    loading: () => <div>Loading lesson...</div>
  }
);

// export const metadata = {
//    title: "Lesson Dr.Bhanu Prakash Online Educational Platform",
// };
const LessonPage = () => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Set document title client-side
    document.title = "Lesson - Dr.Bhanu Prakash Online Educational Platform";
  }, []);

  if (!mounted) {
    return (
      <div style={{ 
        padding: 40, 
        textAlign: 'center',
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        Loading...
      </div>
    );
  }

  return (
      <Wrapper>
        <div style={{ 
          padding: 40,
          minHeight: '100vh',
          background: '#f5f5f5'
        }}>
          <div style={{
            maxWidth: 1000,
            margin: '0 auto',
            background: 'white',
            padding: 40,
            borderRadius: 12,
            boxShadow: '0 4px 20px rgba(0,0,0,0.1)'
          }}>
            <h1 style={{ 
              color: '#5624d0',
              marginBottom: 20,
              textAlign: 'center'
            }}>
              Lesson Page
            </h1>
            
            <div style={{
              background: 'linear-gradient(135deg, #5624d0, #f7b32b)',
              color: 'white',
              padding: 30,
              borderRadius: 8,
              textAlign: 'center',
              marginBottom: 30
            }}>
              <h2 style={{ margin: 0 }}>Interactive Learning Experience</h2>
              <p style={{ margin: '10px 0 0 0', opacity: 0.9 }}>
                Comprehensive lessons with videos, PDFs, and quizzes
              </p>
            </div>

            <div style={{ 
              fontSize: 18,
              color: '#666',
              lineHeight: 1.6,
              textAlign: 'center'
            }}>
              <p>🎯 Video lessons</p>
              <p>📚 PDF materials</p>
              <p>❓ Interactive quizzes</p>
              <p>📊 Progress tracking</p>
            </div>
          </div>
        </div>
      </Wrapper>
   )
}

// Make sure to export the correctly named component
export default LessonPage;