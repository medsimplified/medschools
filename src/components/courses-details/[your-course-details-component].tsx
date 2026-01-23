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
      const isNewUser = (session?.user as any)?.isNewUser;
      if (isNewUser) {
        router.replace("/registration");
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
                Hey there! Ready to log in? Just enter your username and password
                below and you&apos;ll be back in action in no time.
              </p>

              <LoginForm />

              <div className="account__switch">
                <p>
                  Don&apos;t have an account? <Link href="/registration">Sign Up</Link>
                </p>
              </div>

              {/* Replace the "Sign In" button with: */}
              <Link href="/pricing" className="btn">
                View Pricing & Sign In
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LoginArea;