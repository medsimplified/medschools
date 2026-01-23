"use client";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
import React, { useEffect, useState } from "react";

interface Course {
  id: number;
  title: string;
  category: string;
  description: string;
  thumb: string;
  instructors: string;
  price: string;
  videoUrl: string;
  pdfUrl?: string;         // PDF field
  caseStudyUrl?: string;   // Case Study field
}

const InstructorUploadCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Omit<Course, "id">>({
    title: "",
    category: "",
    description: "",
    thumb: "",
    instructors: "",
    price: "",
    videoUrl: "",
    pdfUrl: "",
    caseStudyUrl: "",
  });
  const [editId, setEditId] = useState<number | null>(null);
  const [editForm, setEditForm] = useState<Omit<Course, "id"> | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/courses");
      const data = await res.json();
      setCourses(data || []);
    } catch {
      setCourses([]);
    }
    setLoading(false);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setEditForm((f) => (f ? { ...f, [e.target.name]: e.target.value } : null));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = editId ? editForm : form;
    if (!payload) return;
    const url = editId ? `/api/courses/${editId}` : "/api/courses";
    const method = editId ? "PUT" : "POST";
    const body = JSON.stringify(payload);
    const res = await fetch(url, {
      method,
      headers: { "Content-Type": "application/json" },
      body,
    });
    if (res.ok) {
      fetchCourses();
      setForm({
        title: "",
        category: "",
        description: "",
        thumb: "",
        instructors: "",
        price: "",
        videoUrl: "",
        pdfUrl: "",
        caseStudyUrl: "",
      });
      setEditId(null);
      setEditForm(null);
    }
  };

  const startEdit = (course: Course) => {
    setEditId(course.id);
    setEditForm({
      title: course.title,
      category: course.category,
      description: course.description,
      thumb: course.thumb,
      instructors: course.instructors,
      price: course.price,
      videoUrl: course.videoUrl,
    });
  };

  const cancelEdit = () => {
    setEditId(null);
    setEditForm(null);
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm("Are you sure you want to delete this course?")) return;
    await fetch(`/api/courses/${id}`, {
      method: "DELETE",
    });
    fetchCourses();
  };

  return (
    <div className="container my-5">
      <div className="row">
        <div className="col-lg-3">
          <DashboardSidebar />
        </div>
        <div className="col-lg-9">
          <form className="row g-3 mb-4" onSubmit={handleSubmit}>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Course Title</label>
              <input
                className="form-control"
                placeholder="Course Title"
                name="title"
                value={editId ? editForm?.title ?? "" : form.title}
                onChange={editId ? handleEditChange : handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Category</label>
              <input
                className="form-control"
                placeholder="Category"
                name="category"
                value={editId ? editForm?.category ?? "" : form.category}
                onChange={editId ? handleEditChange : handleChange}
                required
              />
            </div>
            <div className="col-md-12">
              <label className="form-label fw-semibold">Description</label>
              <textarea
                className="form-control"
                placeholder="Description"
                name="description"
                value={editId ? editForm?.description ?? "" : form.description}
                onChange={editId ? handleEditChange : handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Thumbnail Image URL</label>
              <input
                className="form-control"
                placeholder="Image URL"
                name="thumb"
                value={editId ? editForm?.thumb ?? "" : form.thumb}
                onChange={editId ? handleEditChange : handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Instructor Name</label>
              <input
                className="form-control"
                placeholder="Instructor Name"
                name="instructors"
                value={editId ? editForm?.instructors ?? "" : form.instructors}
                onChange={editId ? handleEditChange : handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Price</label>
              <input
                className="form-control"
                type="number"
                placeholder="Price"
                name="price"
                value={editId ? editForm?.price ?? "" : form.price}
                onChange={editId ? handleEditChange : handleChange}
                required
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Intro Video URL</label>
              <input
                className="form-control"
                placeholder="Intro Video URL"
                name="videoUrl"
                value={editId ? editForm?.videoUrl ?? "" : form.videoUrl}
                onChange={editId ? handleEditChange : handleChange}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">PDF Upload</label>
              <input
                className="form-control"
                type="file"
                accept="application/pdf"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("upload_preset", "bhanuprakash_upload");
                  const res = await fetch("https://api.cloudinary.com/v1_1/dnycvwq6ad/upload", {
                    method: "POST",
                    body: formData,
                  });
                  const data = await res.json();
                  if (editId) {
                    setEditForm((f) => f ? { ...f, pdfUrl: data.secure_url } : null);
                  } else {
                    setForm((f) => ({ ...f, pdfUrl: data.secure_url }));
                  }
                }}
              />
            </div>
            <div className="col-md-6">
              <label className="form-label fw-semibold">Case Study Upload</label>
              <input
                className="form-control"
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={async (e) => {
                  const file = e.target.files?.[0];
                  if (!file) return;
                  const formData = new FormData();
                  formData.append("file", file);
                  formData.append("upload_preset", "bhanuprakash_upload");
                  const res = await fetch("https://api.cloudinary.com/v1_1/dnycvwq6ad/upload", {
                    method: "POST",
                    body: formData,
                  });
                  const data = await res.json();
                  if (editId) {
                    setEditForm((f) => f ? { ...f, caseStudyUrl: data.secure_url } : null);
                  } else {
                    setForm((f) => ({ ...f, caseStudyUrl: data.secure_url }));
                  }
                }}
              />
            </div>
            <div className="col-12">
              <button type="submit" className="btn btn-primary">
                {editId ? "Update Course" : "Add Course"}
              </button>
              {editId && (
                <button
                  type="button"
                  className="btn btn-secondary ms-2"
                  onClick={cancelEdit}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>

          <div className="dashboard__content-title mt-5 mb-3">
            <h4 className="title">All Courses</h4>
          </div>
          {loading ? (
            <div>Loading...</div>
          ) : (
            <div className="table-responsive">
              <table className="table table-bordered table-striped">
                <thead>
                  <tr>
                    <th>Title</th>
                    <th>Category</th>
                    <th>Description</th>
                    <th>Instructor</th>
                    <th>Price</th>
                    <th>Video</th>
                    <th>PDF</th>
                    <th>Case Study</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan={9} className="text-center">
                        No courses found.
                      </td>
                    </tr>
                  )}
                  {courses.map((course) => (
                    <tr key={course.id}>
                      <td>{course.title}</td>
                      <td>{course.category}</td>
                      <td>{course.description}</td>
                      <td>{course.instructors}</td>
                      <td>{course.price}</td>
                      <td>
                        {course.videoUrl ? (
                          <a
                            href={course.videoUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                          >
                            Video
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {course.pdfUrl ? (
                          <a href={course.pdfUrl} target="_blank" rel="noopener noreferrer">
                            PDF
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        {course.caseStudyUrl ? (
                          <a href={course.caseStudyUrl} target="_blank" rel="noopener noreferrer">
                            Case Study
                          </a>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td>
                        <button
                          className="btn btn-warning btn-sm me-2"
                          onClick={() => startEdit(course)}
                        >
                          Edit
                        </button>
                        <button
                          className="btn btn-danger btn-sm"
                          onClick={() => handleDelete(course.id)}
                        >
                          Delete
                        </button>
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
  );
};

export default InstructorUploadCourse;