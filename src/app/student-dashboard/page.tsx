"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StudentDashboard from "@/dashboard/student-dashboard/student-dashboard";
import Wrapper from "@/layouts/Wrapper";

const Index = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [status, router]);

  // Show loading while checking
  if (status === "loading") {
    return (
      <div className="text-center py-20">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  // Show dashboard for all logged-in students
  // If no subscription, dashboard will show subscription prompt inside
  return (
    <Wrapper>
      <StudentDashboard />
    </Wrapper>
  );
};

export default Index;
