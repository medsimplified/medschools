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
}

const InstructorUploadCourse = () => {
  const [courses, setCourses] = useState<Course[]>([]);
  const [form, setForm] = useState<Omit<Course, "id">>({
    title: "",
    category: "",
    description: "",
    thumb: "",
    instructors: "",
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
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {courses.length === 0 && (
                    <tr>
                      <td colSpan={5} className="text-center">
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