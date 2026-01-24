import HeaderSeven from "@/layouts/headers/HeaderSeven";
import LoginForm from "@/forms/LoginForm";
import Link from "next/link";

export default function InstructorLogin() {
  return (
    <>
      <HeaderSeven />
      <section className="singUp-area section-py-120">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-xl-6 col-lg-8">
              <div className="singUp-wrap">
                <h2 className="title">Instructor &amp; Course Uploader Login</h2>
                <p>
                  Select your role below to access the appropriate dashboard. Course uploaders receive their credentials from an instructor.
                </p>

                <LoginForm allowedRoles={["instructor", "course_uploader"]} />

                <div className="account__switch mt-4 text-center">
                  <p className="mb-1">
                    Need an instructor account? <Link href="/instructor-registration">Register here</Link>.
                  </p>
                  <p className="text-muted" style={{ fontSize: "0.9rem" }}>
                    Course uploaders are created by instructors and can only sign in from this page.
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