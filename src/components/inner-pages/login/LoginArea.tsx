"use client";

import { useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import LoginForm from "@/forms/LoginForm";

const LoginArea = () => {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "authenticated") {
      const user = session?.user as any;
      if (user?.role === 'course_uploader') {
        router.replace("/instructor-uploader-dashboard");
      } else if (user?.role === 'instructor') {
        router.replace("/instructor-dashboard");
      } else {
        router.replace("/student-dashboard");
      }
    }
  }, [status, session, router]);

  if (status === "loading") {
    return <div className="text-center py-20">Loading...</div>;
  }

  if (status === "authenticated") return null;

  return (
    <section className="singUp-area section-py-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8">
            <div className="singUp-wrap">
              <h2 className="title">Welcome back!</h2>
              <p>
                Log in to your account to access your dashboard and manage your courses.
              </p>

              <LoginForm />

              <div className="account__switch">
                <p>
                  Don&apos;t have an account? <Link href="/registration">Sign Up</Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginArea;
