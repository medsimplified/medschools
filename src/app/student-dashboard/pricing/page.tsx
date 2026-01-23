"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import StudentPricingDashboard from "@/dashboard/student-dashboard/student-pricing-dashboard";
import Wrapper from "@/layouts/Wrapper";

const StudentPricingPage = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
  }, [status, router]);

  if (status === "loading") {
    return (
      <div className="text-center py-20">
        <div className="spinner-border" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Wrapper>
      <StudentPricingDashboard />
    </Wrapper>
  );
};

export default StudentPricingPage;
