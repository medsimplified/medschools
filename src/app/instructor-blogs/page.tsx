"use client";

import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
import Image from "next/image";
// import bg_img from "@/assets/img/bg/dashboard_bg.jpg";
import AuthGuard from "@/components/common/AuthGuard";

type BlogForm = {
  title: string;
  content: string;
  author: string;
  tags: string;   // comma separated for UI
  image: string;  // URL (optional)
};

type Blog = {
  id?: number;
  title: string;
  content: string;
  author: string;
  tags: string[];     // stored as array via API
  image?: string | null;
  createdAt?: string; // server-managed
};

const emptyForm: BlogForm = {
  title: "",
  content: "",
  author: "",
  tags: "",
  image: "",
};

function InstructorBlogsPage() {
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Optional: show existing blogs below (like “All Banners” section).
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [fetching, setFetching] = useState(false);

  const fetchBlogs = async () => {
    try {
      setFetching(true);
      const res = await fetch("/api/blogs");
      const data = await res.json();
      setBlogs(Array.isArray(data) ? data : []);
    } catch {
      // ignore listing errors silently
    } finally {
      setFetching(false);
    }
  };

  useEffect(() => {
    fetchBlogs();
  }, []);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          author: form.author.trim(),
          image: form.image.trim() || null,
          tags: form.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to upload blog");
      }

      setSuccess("Blog uploaded!");
      setForm(emptyForm);
      fetchBlogs();
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="dashboard__area section-pb-120">
      {/* Banner image at the top, styled like other dashboard pages */}
      <div
        className="dashboard__top-wrap mt-120"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "48px",
          marginTop: "48px",
        }}
      >
        <div
          className="dashboard__top-bg"
          style={{
            backgroundImage: `url(/assets/img/bg/instructor_dashboard_bg.png)`,
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            width: "100%",
            maxWidth: "1400px",
            height: "260px",
            borderRadius: "18px",
            boxShadow: "0 4px 24px rgba(13,68,122,0.08)",
            marginTop: "60px",
          }}
        ></div>
      </div>
      <div className="dashboard__bg">
        {/* <Image src={bg_img} alt="bg" /> */}
      </div>

      <div className="container">
        <div className="dashboard__inner-wrap row">
          <DashboardSidebar />

          <div className="col-lg-9">
            <h4 className="title">Instructor Blogs</h4>

            {/* CREATE FORM */}
            <Form
              className="p-4 bg-white shadow-sm border rounded"
              onSubmit={handleSubmit}
            >
              <div className="row g-3">
                <div className="col-12">
                  <Form.Label className="fw-semibold">Title</Form.Label>
                  <Form.Control
                    name="title"
                    value={form.title}
                    onChange={handleChange}
                    placeholder="Enter blog title"
                    required
                  />
                </div>

                <div className="col-12">
                  <Form.Label className="fw-semibold">Content</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={8}
                    name="content"
                    value={form.content}
                    onChange={handleChange}
                    placeholder="Write your blog content here..."
                    required
                  />
                </div>

                <div className="col-md-6">
                  <Form.Label className="fw-semibold">Author</Form.Label>
                  <Form.Control
                    name="author"
                    value={form.author}
                    onChange={handleChange}
                    placeholder="Author name"
                    required
                  />
                </div>

                <div className="col-md-6">
                  <Form.Label className="fw-semibold">
                    Tags (comma separated)
                  </Form.Label>
                  <Form.Control
                    name="tags"
                    value={form.tags}
                    onChange={handleChange}
                    placeholder="e.g. LMS, Education, Next.js"
                  />
                </div>

                <div className="col-12">
                  <Form.Label className="fw-semibold">Image URL</Form.Label>
                  <Form.Control
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/cover.jpg (optional)"
                  />
                  <Form.Text muted>
                    Optional: a cover image URL for the blog card/preview.
                  </Form.Text>
                </div>
              </div>

              <div className="d-flex gap-3 justify-content-end mt-4">
                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="rounded-3 px-3 py-1"
                  style={{
                    fontSize: "1rem",
                    fontWeight: 500,
                    boxShadow: "none",
                    letterSpacing: "0.5px",
                  }}
                  disabled={loading}
                >
                  {loading ? "Uploading..." : "Upload"}
                </Button>
              </div>

              {success && (
                <div className="mt-3 text-success fw-semibold">{success}</div>
              )}
              {error && (
                <div className="mt-3 text-danger fw-semibold">{error}</div>
              )}
            </Form>

            <hr className="my-5" />
            <h4 className="title mb-3">All Blogs</h4>

            {fetching ? (
              <div>Loading...</div>
            ) : blogs.length === 0 ? (
              <div className="text-center text-muted mb-4">
                No blogs found.
              </div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Author</th>
                      <th>Tags</th>
                      <th>Image</th>
                    </tr>
                  </thead>
                  <tbody>
                    {blogs.map((b) => (
                      <tr key={b.id ?? `${b.title}-${b.author}`}>
                        <td style={{ fontWeight: 600 }}>{b.title}</td>
                        <td>{b.author}</td>
                        <td>
                          {Array.isArray(b.tags) && b.tags.length
                            ? b.tags.join(", ")
                            : <em className="text-muted">—</em>}
                        </td>
                        <td>
                          {b.image ? (
                            <a
                              href={b.image}
                              target="_blank"
                              rel="noreferrer"
                            >
                              Open
                            </a>
                          ) : (
                            <em className="text-muted">—</em>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
export default function Page() {
  return (
    <AuthGuard>
      <InstructorBlogsPage />
    </AuthGuard>
  );
}
