"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Wrapper from "@/layouts/Wrapper";
import PricingPlansManager from "@/dashboard/instructor-dashboard/instructor-dashboard/pricing-plans";

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    if (status === "loading") {
      return;
    }

    if (!session || session?.user?.role !== "instructor") {
      router.replace("/login");
    } else {
      setIsAuthorized(true);
    }
  }, [session, status, router]);

  if (status === "loading" || !isAuthorized) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <div>Loading...</div>
      </div>
    );
  }

  return (
    <Wrapper>
      <PricingPlansManager />
    </Wrapper>
  );
}
