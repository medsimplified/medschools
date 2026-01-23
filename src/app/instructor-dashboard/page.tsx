"use client";

import DashboardHome from "@/dashboard/instructor-dashboard/dashboard-home";
import Wrapper from "@/layouts/Wrapper";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function Page() {
   const { data: session, status } = useSession();
   const router = useRouter();
   const [isAuthorized, setIsAuthorized] = useState(false);

   useEffect(() => {
      if (status === "loading") return;

      if (!session || session?.user?.role !== "instructor") {
         router.replace("/login");
      } else {
         setIsAuthorized(true);
      }
   }, [session, status, router]);

   // Show loading until we verify authorization
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
         <DashboardHome />
      </Wrapper>
   );
}