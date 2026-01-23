"use client";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
import { useState } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
// import bg_img from "@/assets/img/bg/dashboard_bg.jpg";
import React from "react";
import AuthGuard from "@/components/common/AuthGuard";

const AddLatestVideo = () => {
  const [form, setForm] = useState({
    title: "",
    tag: "",
    review: "",
    price: "",
    lesson: "",
    student: "",
    thumb: "",
    youtubeUrl: "",
  });
  const [file, setFile] = useState<File | null>(null);
  const [videos, setVideos] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [editForm, setEditForm] = useState<any>(null);
  const [editFile, setEditFile] = useState<File | null>(null);

  // Fetch all videos
  const fetchVideos = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/latest-videos");
      const data = await res.json();
      if (res.ok) {
        setVideos(data || []);
      } else {
        toast.error(data.error || "Failed to fetch videos");
      }
    } catch (err) {
      toast.error("Error fetching videos");
    }
    setLoading(false);
  };

  // On mount, fetch videos
  React.useEffect(() => {
    fetchVideos();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setFile(e.target.files[0]);
    }
  };

  // Edit handlers
  const handleEditChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditForm({ ...editForm, [e.target.name]: e.target.value });
  };
  const handleEditFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setEditFile(e.target.files[0]);
    }
  };

  // Add video
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    let uploadedThumb = "";

    if (file) {
      const imageForm = new FormData();
      imageForm.append("file", file);

      const uploadRes = await fetch("/api/upload-image", {
        method: "POST",
        body: imageForm,
      });

      const uploadData = await uploadRes.json();

      if (!uploadRes.ok) {
        toast.error("Image upload failed");
        return;
      }

      uploadedThumb = `/uploads/${uploadData.filename}`;
    }

    const finalForm = { ...form, thumb: uploadedThumb };

    try {
      const res = await fetch("/api/latest-videos/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalForm),
      });

      const data = await res.json();
      if (res.ok) {
        toast.success("Video added successfully!");
        setForm({
          title: "",
          tag: "",
          review: "",
          price: "",
          lesson: "",
          student: "",
          thumb: "",
          youtubeUrl: "",
        });
        setFile(null);
        fetchVideos();
      } else {
        toast.error(data.error || "Failed to add video");
      }
    } catch (err) {
      console.error(err);
      toast.error("Server error");
    }
  };

  // Delete video (DELETE)
  const handleDelete = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this video?")) return;
    try {
      const res = await fetch(`/api/latest-videos/${id}/delete`, { method: "DELETE" });
      const data = await res.json();
      if (res.ok) {
        toast.success("Video deleted");
        fetchVideos();
      } else {
        toast.error(data.error || "Failed to delete");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  // Start editing
  const startEdit = (video: any) => {
    setEditId(video.id);
    setEditForm({ ...video });
    setEditFile(null);
  };

  // Cancel editing
  const cancelEdit = () => {
    setEditId(null);
    setEditForm(null);
    setEditFile(null);
  };

  // Save edit (UPDATE)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let uploadedThumb = editForm.thumb;
    if (editFile) {
      const imageForm = new FormData();
      imageForm.append("file", editFile);
      const uploadRes = await fetch("/api/upload-image", {
        method: "POST",
        body: imageForm,
      });
      const uploadData = await uploadRes.json();
      if (!uploadRes.ok) {
        toast.error("Image upload failed");
        return;
      }
      uploadedThumb = `/uploads/${uploadData.filename}`;
    }
    const finalEdit = { ...editForm, thumb: uploadedThumb };
    try {
      const res = await fetch(`/api/latest-videos/${editId}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(finalEdit),
      });
      const data = await res.json();
      if (res.ok) {
        toast.success("Video updated");
        cancelEdit();
        fetchVideos();
      } else {
        toast.error(data.error || "Failed to update");
      }
    } catch (err) {
      toast.error("Server error");
    }
  };

  return (
    <section className="dashboard__area section-pb-120">
      <div className="dashboard__bg">
        {/* <Image src={bg_img} alt="bg" /> */}
      </div>
      <div className="container">
        <div className="dashboard__inner-wrap row">
          {/* ✅ Sidebar */}
          <DashboardSidebar />

          {/* ✅ Form Section */}
          <div className="col-lg-9">
            <div className="dashboard__content-title mb-4">
              <h4 className="title">Add Latest Video</h4>
            </div>
            <form onSubmit={handleSubmit}>
              {["title", "tag", "review", "price", "lesson", "student"].map((field) => (
                <div key={field} className="form-group mb-3">
                  <label>{field.charAt(0).toUpperCase() + field.slice(1)}</label>
                  <input
                    type="text"
                    name={field}
                    className="form-control"
                    value={(form as any)[field]}
                    onChange={handleChange}
                    required
                  />
                </div>
              ))}

              {/* Add this block for YouTube URL */}
              <div className="form-group mb-3">
                <label>YouTube URL</label>
                <input
                  type="url"
                  name="youtubeUrl"
                  className="form-control"
                  value={form.youtubeUrl}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="form-group mb-4">
                <label>Thumbnail Image</label>
                <input
                  type="file"
                  accept="image/*"
                  className="form-control"
                  onChange={handleFileChange}
                  required
                />
              </div>

              <button type="submit" className="btn btn-success">Add latest video</button>
            </form>

            {/* Video List Section */}
            <div className="dashboard__content-title mt-5 mb-3">
              <h4 className="title">All Latest Videos</h4>
            </div>
            {loading ? (
              <div>Loading...</div>
            ) : (
              <div className="table-responsive">
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Thumbnail</th>
                      <th>Title</th>
                      <th>Tag</th>
                      <th>Review</th>
                      <th>Price</th>
                      <th>Lesson</th>
                      <th>Student</th>
                      <th>YouTube URL</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {videos.length === 0 && (
                      <tr><td colSpan={9} className="text-center">No videos found.</td></tr>
                    )}
                    {videos.map((video) => (
                      <tr key={video.id}>
                        <td>
                          {video.thumb && (
                            <Image src={video.thumb} alt="thumb" width={60} height={40} style={{ objectFit: 'cover', borderRadius: 4 }} />
                          )}
                        </td>
                        {editId === video.id ? (
                          <>
                            <td><input type="text" name="title" value={editForm.title} onChange={handleEditChange} className="form-control" /></td>
                            <td><input type="text" name="tag" value={editForm.tag} onChange={handleEditChange} className="form-control" /></td>
                            <td><input type="text" name="review" value={editForm.review} onChange={handleEditChange} className="form-control" /></td>
                            <td><input type="text" name="price" value={editForm.price} onChange={handleEditChange} className="form-control" /></td>
                            <td><input type="text" name="lesson" value={editForm.lesson} onChange={handleEditChange} className="form-control" /></td>
                            <td><input type="text" name="student" value={editForm.student} onChange={handleEditChange} className="form-control" /></td>
                            <td>
                              <input
                                type="url"
                                name="youtubeUrl"
                                value={editForm.youtubeUrl || ""}
                                onChange={handleEditChange}
                                className="form-control"
                                placeholder="YouTube URL"
                              />
                            </td>
                            <td>
                              <input type="file" accept="image/*" onChange={handleEditFileChange} className="form-control mb-2" />
                              <button className="btn btn-success btn-sm me-2" onClick={handleEditSubmit}>Save</button>
                              <button className="btn btn-secondary btn-sm" onClick={cancelEdit}>Cancel</button>
                            </td>
                          </>
                        ) : (
                          <>
                            <td>{video.title}</td>
                            <td>{video.tag}</td>
                            <td>{video.review}</td>
                            <td>{video.price}</td>
                            <td>{video.lesson}</td>
                            <td>{video.student}</td>
                            <td>
                              {video.youtubeUrl ? (
                                <a href={video.youtubeUrl} target="_blank" rel="noopener noreferrer">View</a>
                              ) : "-"}
                            </td>
                            <td>
                              <button
                                className="btn"
                                style={{
                                  background: 'linear-gradient(90deg,#5624d0 60%,#f7b32b 100%)',
                                  color: '#fff',
                                  fontWeight: 700,
                                  border: 'none',
                                  borderRadius: 8,
                                  padding: '6px 18px',
                                  marginRight: 8,
                                  boxShadow: '0 2px 8px #5624d044',
                                  transition: 'transform 0.15s',
                                  letterSpacing: 1,
                                }}
                                onClick={() => startEdit(video)}
                                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                              >
                                Edit
                              </button>
                              <button
                                className="btn"
                                style={{
                                  background: 'linear-gradient(90deg,#b71c1c 60%,#f7b32b 100%)',
                                  color: '#fff',
                                  fontWeight: 700,
                                  border: 'none',
                                  borderRadius: 8,
                                  padding: '6px 18px',
                                  boxShadow: '0 2px 8px #b71c1c44',
                                  transition: 'transform 0.15s',
                                  letterSpacing: 1,
                                }}
                                onClick={() => handleDelete(video.id)}
                                onMouseOver={e => (e.currentTarget.style.transform = 'scale(1.07)')}
                                onMouseOut={e => (e.currentTarget.style.transform = 'scale(1)')}
                              >
                                Delete
                              </button>
                            </td>
                          </>
                        )}
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
};

export default function Page() {
  return (
    <AuthGuard>
      <AddLatestVideo />
    </AuthGuard>
  );
}