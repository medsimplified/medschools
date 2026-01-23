"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

const PurchasePage = () => {
  const router = useRouter();

  useEffect(() => {
    // Redirect to main student dashboard
    // Subscription prompt is now shown inside the dashboard
    router.replace("/student-dashboard");
  }, [router]);

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      minHeight: '100vh',
      background: '#f7f8fa'
    }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{
          fontSize: 48,
          marginBottom: 16,
          animation: 'spin 1s linear infinite'
        }}>⏳</div>
        <p style={{ fontSize: 18, color: '#666' }}>Redirecting to dashboard...</p>
      </div>
    </div>
  );
};

export default PurchasePage;
