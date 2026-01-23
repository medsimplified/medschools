"use client";

import { useSession } from "next-auth/react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (status === "unauthenticated") {
    // Optionally, show a message or nothing
    return <div className="text-center py-20 text-lg">You must be logged in to access this page.</div>;
  }

  return <>{children}</>;
}
