"use client";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Providers from "./Providers";
import FooterTwo from "@/layouts/footers/FooterTwo";
import Preloader from "@/components/Preloader";
import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { CookieConsent } from "@/components/common/CookieConsent";

// Lazy load performance monitor only in production (named export)
const PerformanceMonitor = dynamic(
  () => import("@/components/PerformanceMonitor").then((m) => m.PerformanceMonitor),
  { ssr: false }
);

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Reduced preloader time for better UX
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  return (
    <>
      {loading && <Preloader />}
      {!loading && (
        <Providers>
          {process.env.NODE_ENV === 'production' && <PerformanceMonitor />}
          <main className="min-h-[calc(100vh-200px)]">{children}</main>
          <CookieConsent />
          <ToastContainer position="top-right" autoClose={3000} />
          <FooterTwo />
        </Providers>
      )}
    </>
  );
}
