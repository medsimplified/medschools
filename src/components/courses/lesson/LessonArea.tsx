"use client";

import Link from "next/link";
import LessonFaq from "./LessonFaq";
import LessonNavTav from "./LessonNavTav";
import dynamic from "next/dynamic";
import "@react-pdf-viewer/core/lib/styles/index.css";
import { useState, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { FaTimes, FaArrowRight } from "@/lib/fontAwesomeIconsComplete";

// Set up the worker
pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

// Dynamically import LessonVideo
const LessonVideo = dynamic(() => import("./LessonVideo"), { ssr: false });

// Dynamically import PDF components with no SSR
const Worker = dynamic(
  () => import("@react-pdf-viewer/core").then((mod) => mod.Worker),
  { ssr: false }
);

const Viewer = dynamic(
  () => import("@react-pdf-viewer/core").then((mod) => mod.Viewer),
  { ssr: false }
);

const LessonArea = ({ lectures }: any) => {
  const [isClient, setIsClient] = useState(false);
  const [numPages, setNumPages] = useState<number>();
  const [pageNumber, setPageNumber] = useState<number>(1);

  useEffect(() => {
    setIsClient(true);
  }, []);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  if (!isClient) {
    return <div>Loading PDF viewer...</div>;
  }

  return (
    <section className="lesson__area section-pb-120">
      <div className="container-fluid p-0">
        <div className="row gx-0">
          {/* Left Sidebar */}
          <div className="col-xl-3 col-lg-4">
            <div className="lesson__content">
              <h2 className="title">Course Content</h2>
              <LessonFaq />
            </div>
          </div>

          {/* Main Content */}
          <div className="col-xl-9 col-lg-8">
            <div className="lesson__video-wrap">
              {/* Top Bar */}
              <div className="lesson__video-wrap-top">
                <div className="lesson__video-wrap-top-left">
                  <Link href="#">
                    <FaArrowRight />
                  </Link>
                  <span>The Complete Design Course: From Zero to Expert!</span>
                </div>
                <div className="lesson__video-wrap-top-right">
                  <Link href="#">
                    <FaTimes aria-hidden />
                  </Link>
                </div>
              </div>

              {/* Lesson Video */}
              <LessonVideo />

              {/* Next/Previous Buttons */}
              <div className="lesson__next-prev-button">
                <button
                  className="prev-button"
                  title="Create a Simple React App"
                >
                  <FaArrowRight />
                </button>
                <button
                  className="next-button"
                  title="React for the Rest of us"
                >
                  <FaArrowRight />
                </button>
              </div>
            </div>

            {/* Navigation Tabs */}
            <LessonNavTav />

            {/* Lecture PDFs Section */}
            <div className="lesson__pdf-section">
              <h3 className="title">Lecture PDFs</h3>
              {lectures && lectures.length > 0 ? (
                lectures.map((lecture: any, index: number) => (
                  <div key={index} className="lesson__pdf-item">
                    <p>{lecture.title}</p>
                    <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                      <Viewer fileUrl={`/pdf/${lecture.pdf}`} />
                    </Worker>
                  </div>
                ))
              ) : (
                <p>No lecture PDFs available.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LessonArea;
