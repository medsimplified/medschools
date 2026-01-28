"use client";

import { useEffect, useState } from "react";
import { Button, Form, Modal } from "react-bootstrap";
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
  imageFile: File | null;  // for upload
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
  imageFile: null,
};

function InstructorBlogsPage() {
  const [form, setForm] = useState<BlogForm>(emptyForm);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Optional: show existing blogs below (like “All Banners” section).
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [fetching, setFetching] = useState(false);
  // Edit modal state
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingBlog, setEditingBlog] = useState<Blog | null>(null);
  const [editForm, setEditForm] = useState<BlogForm>(emptyForm);
  const [editLoading, setEditLoading] = useState(false);
  const fetchBlogs = async () => {
    try {
      setFetching(true);
      const timestamp = new Date().getTime();
      const res = await fetch(`/api/blogs?t=${timestamp}`, {
        cache: 'no-store',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache'
        }
      });
      const data = await res.json();
      console.log('Fetched blogs:', data);
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

  const handleEditChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setEditForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((prev) => ({ ...prev, imageFile: file }));
    }
  };

  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setEditForm((prev) => ({ ...prev, imageFile: file }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setSuccess(null);
    setError(null);
    try {
      let imageUrl = form.image.trim() || null;

      // Upload image file if provided
      if (form.imageFile) {
        const formData = new FormData();
        formData.append("file", form.imageFile);

        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      const res = await fetch("/api/blogs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: form.title.trim(),
          content: form.content.trim(),
          author: form.author.trim(),
          image: imageUrl,
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
      await fetchBlogs();
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (blog: Blog) => {
    setEditingBlog(blog);
    setEditForm({
      title: blog.title,
      content: blog.content,
      author: blog.author,
      tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
      image: blog.image || "",
      imageFile: null,
    });
    setShowEditModal(true);
  };

  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBlog?.id) return;

    setEditLoading(true);
    setError(null);
    try {
      let imageUrl = editForm.image.trim() || null;

      // Upload new image file if provided
      if (editForm.imageFile) {
        const formData = new FormData();
        formData.append("file", editForm.imageFile);

        const uploadRes = await fetch("/api/upload-image", {
          method: "POST",
          body: formData,
        });

        if (uploadRes.ok) {
          const uploadData = await uploadRes.json();
          imageUrl = uploadData.url;
        } else {
          throw new Error("Failed to upload image");
        }
      }

      const res = await fetch(`/api/blogs/${editingBlog.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: editForm.title.trim(),
          content: editForm.content.trim(),
          author: editForm.author.trim(),
          image: imageUrl,
          tags: editForm.tags
            .split(",")
            .map((t) => t.trim())
            .filter(Boolean),
        }),
      });

      if (!res.ok) {
        const msg = await res.text();
        throw new Error(msg || "Failed to update blog");
      }

      setShowEditModal(false);
      setEditingBlog(null);
      await fetchBlogs();
    } catch (err: any) {
      setError(err?.message || "Something went wrong");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (blogId: number) => {
    if (!confirm("Are you sure you want to delete this blog?")) return;

    try {
      const res = await fetch(`/api/blogs/${blogId}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete blog");
      }

      await fetchBlogs();
    } catch (err: any) {
      alert(err?.message || "Failed to delete blog");
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
                  <Form.Label className="fw-semibold">Image</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="mb-2"
                  />
                  <Form.Text muted className="d-block mb-2">
                    Upload an image file for the blog cover
                  </Form.Text>
                  <Form.Label className="fw-semibold mt-2">Or Image URL</Form.Label>
                  <Form.Control
                    name="image"
                    value={form.image}
                    onChange={handleChange}
                    placeholder="https://example.com/cover.jpg (optional)"
                  />
                  <Form.Text muted>
                    Alternatively, provide a direct image URL
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
                      <th>Actions</th>
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
                        <td>
                          <div className="d-flex gap-2">
                            <Button
                              size="sm"
                              variant="primary"
                              onClick={() => handleEditClick(b)}
                            >
                              Edit
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              onClick={() => b.id && handleDelete(b.id)}
                            >
                              Delete
                            </Button>
                          </div>
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

      {/* Edit Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Edit Blog</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleEditSubmit}>
            <div className="row g-3">
              <div className="col-12">
                <Form.Label className="fw-semibold">Title</Form.Label>
                <Form.Control
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
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
                  value={editForm.content}
                  onChange={handleEditChange}
                  placeholder="Write your blog content here..."
                  required
                />
              </div>

              <div className="col-md-6">
                <Form.Label className="fw-semibold">Author</Form.Label>
                <Form.Control
                  name="author"
                  value={editForm.author}
                  onChange={handleEditChange}
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
                  value={editForm.tags}
                  onChange={handleEditChange}
                  placeholder="e.g. LMS, Education, Next.js"
                />
              </div>

              <div className="col-12">
                <Form.Label className="fw-semibold">Image</Form.Label>
                <Form.Control
                  type="file"
                  accept="image/*"
                  onChange={handleEditFileChange}
                  className="mb-2"
                />
                <Form.Text muted className="d-block mb-2">
                  Upload a new image file to replace the current one
                </Form.Text>
                <Form.Label className="fw-semibold mt-2">Or Image URL</Form.Label>
                <Form.Control
                  name="image"
                  value={editForm.image}
                  onChange={handleEditChange}
                  placeholder="https://example.com/cover.jpg (optional)"
                />
                {editForm.image && (
                  <Form.Text muted className="d-block mt-1">
                    Current: {editForm.image}
                  </Form.Text>
                )}
              </div>
            </div>

            {error && (
              <div className="mt-3 text-danger fw-semibold">{error}</div>
            )}

            <div className="d-flex gap-3 justify-content-end mt-4">
              <Button
                variant="secondary"
                onClick={() => setShowEditModal(false)}
                disabled={editLoading}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={editLoading}
              >
                {editLoading ? "Updating..." : "Update Blog"}
              </Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
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
