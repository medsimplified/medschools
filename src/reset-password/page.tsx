"use client";

import { useState, useEffect } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [cpassword, setCPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const searchParams = useSearchParams();
  const token = searchParams?.get("token");
  const router = useRouter(); // Fixed: Complete the router declaration

  useEffect(() => {
    if (!token) {
      toast.error("Invalid reset link.");
      router.push("/login");
    }
  }, [token, router]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!token) {
      toast.error("Invalid reset link.");
      return;
    }

    if (!password || !cpassword) {
      toast.error("All fields are required.");
      return;
    }

    if (password !== cpassword) {
      toast.error("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);
      const res = await fetch("/api/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });
      
      const result = await res.json();

      if (res.ok) {
        toast.success("Password reset successful!");
        setTimeout(() => router.push("/login"), 2000);
      } else {
        toast.error(result.error || "Something went wrong");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    } finally {
      setLoading(false);
    }
  };

  // Don't render form if no token
  if (!token) {
    return (
      <section className="singUp-area section-py-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="singUp-wrap">
                <h2 className="title">Invalid Reset Link</h2>
                <p>The reset link is invalid or has expired. Please request a new password reset.</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="singUp-area section-py-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8">
            <div className="singUp-wrap">
              <h2 className="title">Reset Password</h2>
              <p>Enter your new password below.</p>

              <form onSubmit={handleSubmit} className="account__form">
                <div className="form-grp">
                  <label>New Password</label>
                  <input
                    type="password"
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                </div>
                <div className="form-grp">
                  <label>Confirm Password</label>
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    value={cpassword}
                    onChange={(e) => setCPassword(e.target.value)}
                    required
                  />
                </div>
                <button type="submit" className="btn btn-two arrow-btn mt-3" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
