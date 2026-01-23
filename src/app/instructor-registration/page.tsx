"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import HeaderSeven from "@/layouts/headers/HeaderSeven";
export default function InstructorRegistration() {
  const router = useRouter();
  const [form, setForm] = useState({
    email: "",
    password: "",
    name: "",
    role: "instructor", // default
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/instructor-register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    if (res.ok) {
      setSuccess("Registration successful! Redirecting...");
      setError("");
      if (form.role === "uploader") {
        setTimeout(() => router.replace("/instructor-uploader-dashboard"), 1200);
      } else {
        setTimeout(() => router.replace("/instructor-login"), 1200);
      }
    } else {
      setError("Registration failed. Try again.");
      setSuccess("");
    }
  };

  return (
    <>
      <HeaderSeven />
      <section className="singUp-area section-py-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="singUp-wrap">
                <h2 className="title">Instructor Registration</h2>
                <p>
                  Fill in your details to create an instructor account.
                </p>
                <form onSubmit={handleSubmit}>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="role">Registering as</label>
                    <select
                      id="role"
                      name="role"
                      className="form-control rounded-3"
                      value={form.role}
                      onChange={handleChange}
                      required
                    >
                      <option value="instructor">Instructor</option>
                      <option value="uploader">Course Uploader</option>
                    </select>
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="name">Name</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      className="form-control rounded-3"
                      placeholder="Enter your name"
                      value={form.name}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="email">Email</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      className="form-control rounded-3"
                      placeholder="Enter your email"
                      value={form.email}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label fw-semibold" htmlFor="password">Password</label>
                    <input
                      type="password"
                      id="password"
                      name="password"
                      className="form-control rounded-3"
                      placeholder="Enter your password"
                      value={form.password}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  {error && <div className="alert alert-danger py-2">{error}</div>}
                  {success && <div className="alert alert-success py-2">{success}</div>}
                  <button
                    type="submit"
                    className="btn w-100 fw-bold"
                    style={{
                      background: "linear-gradient(90deg,#a86b2e 60%,#f9a116 100%)",
                      color: "#fff",
                      borderRadius: "30px",
                      padding: "10px 0",
                      fontSize: 18,
                      boxShadow: "0 2px 12px #a86b2e33",
                    }}
                  >
                    Register
                  </button>
                </form>
                <div className="account__switch mt-4 text-center">
                  <p>
                    Already have an account? <a href="/instructor-login">Login</a>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}