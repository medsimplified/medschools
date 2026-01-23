"use client";

import { useEffect, useState, Suspense } from "react";
import { useSession, signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import OtpModalWrapper from "@/components/modals/OtpModalWrapper";
import RegistrationForm, { FormData } from "@/components/forms/RegistrationForm";
import { toast } from "react-toastify";

function RegistrationContent() {
  const { data: session, status, update } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();

  const [showOtpModal, setShowOtpModal] = useState(false);
  const [emailForOtp, setEmailForOtp] = useState("");
  const [registrationData, setRegistrationData] = useState<FormData | null>(null);
  const [otpSentSuccess, setOtpSentSuccess] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);

  const isVerified = (session?.user as any)?.isVerified;

  useEffect(() => {
    if (status === "authenticated" && isVerified) {
      const user = session?.user as any;
      if (user?.role === 'course_uploader') {
        router.replace("/instructor-uploader-dashboard");
      } else if (user?.role === 'instructor') {
        router.replace("/instructor-dashboard");
      } else {
        router.replace("/student-dashboard");
      }
    }
  }, [status, isVerified, session, router]);

  useEffect(() => {
    const planFromUrl = searchParams?.get('plan');
    const planFromStorage = typeof window !== 'undefined' ? localStorage.getItem('selectedPlan') : null;
    
    setSelectedPlan(planFromUrl || planFromStorage);
  }, [searchParams]);

  const sendOtp = async (email: string) => {
    const res = await fetch("/api/send-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (res.ok) {
      setOtpSentSuccess(true);
      toast.success("OTP sent to your email!");
      setEmailForOtp(email);
      setShowOtpModal(true);
    } else {
      setOtpSentSuccess(false);
      const data = await res.json();
      toast.error(data.error || "Failed to send OTP");
    }
  };

  const handleOtpSentFromForm = async (data: FormData) => {
    setRegistrationData(data);
    await sendOtp(data.email);
  };

  const handleOtpVerifySuccess = async () => {
    if (!registrationData) {
      toast.error("Registration data missing. Please try again.");
      return;
    }

    // Validate required fields before sending to API
    const requiredFields = [
      'role', 'fullName', 'email', 'countryCode', 'phone', 'country', 'state', 'password', 'confirmPassword'
    ];
    for (const field of requiredFields) {
      if (!registrationData[field as keyof typeof registrationData]) {
        toast.error(`Missing required field: ${field}`);
        return;
      }
    }

    // Attach selectedPlan if present
    const payload = { ...registrationData, selectedPlan };

    const res = await fetch("/api/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (res.ok) {
      const data = await res.json();
      toast.success("Registration successful! Logging you in...");
      // Automatically sign in the user
      const signInRes = await signIn("credentials", {
        redirect: false,
        email: registrationData.email,
        password: registrationData.password,
        role: data.user?.role || registrationData.role,
      });
      if (signInRes && signInRes.ok) {
        await update();
        // Redirect based on backend user role
        const userRole = data.user?.role || registrationData.role;
        if (userRole === 'course_uploader') {
          router.replace("/instructor-uploader-dashboard");
        } else if (userRole === 'instructor') {
          router.replace("/instructor-dashboard");
        } else if (data.hasPendingSubscription) {
          router.replace("/student-dashboard/purchase");
        } else {
          router.replace("/student-dashboard");
        }
      } else {
        toast.error("Auto-login failed. Please log in manually.");
      }
    } else {
      let data;
      try {
        data = await res.json();
      } catch {
        data = {};
      }
      toast.error(data.error || "Registration failed");
    }
  };

  return (
    <>
      <section className="singUp-area section-py-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="singUp-wrap">
                <h2 className="title">Create Your Account</h2>
                
                
                <p>Register below to get started.</p>

                {otpSentSuccess && (
                  <div style={{
                    background: "#d4edda",
                    color: "#155724",
                    padding: "10px",
                    marginBottom: "10px",
                    borderRadius: "4px",
                    textAlign: "center"
                  }}>
                    OTP sent successfully!
                  </div>
                )}

                <RegistrationForm onOtpSent={handleOtpSentFromForm} />

                <div className="account__switch mt-4 text-center">
                  <p>
                    Already have an account? <Link href="/login">Login</Link>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {showOtpModal && emailForOtp && (
        <OtpModalWrapper
          email={emailForOtp}
          onVerifySuccess={handleOtpVerifySuccess}
          onClose={() => setShowOtpModal(false)}
        />
      )}
    </>
  );
}

export default function RegistrationArea() {
  return (
    <Suspense fallback={<div className="text-center py-20">Loading...</div>}>
      <RegistrationContent />
    </Suspense>
  );
}
