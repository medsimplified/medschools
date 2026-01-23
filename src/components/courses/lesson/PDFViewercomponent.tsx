"use client";
import { Worker, Viewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';

const PDFViewerComponent = () => {
  return (
    <div style={{ height: '750px' }}>
      <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
        <Viewer fileUrl="/path/to/your/file.pdf" />
      </Worker>
    </div>
  );
};

export default PDFViewerComponent;