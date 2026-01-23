"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { toast } from "react-toastify";

interface VideoForm {
  title: string;
  tag: string;
  review: string;
  price: string;
  lesson: string;
  student: string;
  thumb: string;
  videoUrl?: string;
  thumbnailUrl?: string;
  description?: string;
}

const EditVideo = () => {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [form, setForm] = useState<VideoForm>({
    title: "",
    tag: "",
    review: "",
    price: "",
    lesson: "",
    student: "",
    thumb: "",
    videoUrl: "",
    thumbnailUrl: "",
    description: "",
  });

  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;

    const fetchData = async () => {
      try {
        const res = await fetch(`/api/latest-videos/${id}`);
        if (!res.ok) {
          throw new Error('Failed to fetch video');
        }
        const data = await res.json();
        setForm(data);
      } catch (error) {
        console.error("Error fetching video:", error);
        toast.error("Failed to load video data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const res = await fetch(`/api/latest-videos/${id}/update`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (res.ok) {
        toast.success("Video updated successfully!");
        router.push("/instructor-updates/manage-latest-videos");
      } else {
        const errorData = await res.json();
        toast.error(errorData.error || "Failed to update video");
      }
    } catch (error) {
      console.error("Error updating video:", error);
      toast.error("Failed to update video");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container my-5">
        <div className="text-center">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2>Edit Video</h2>
      <form onSubmit={handleSubmit}>
        <div className="row">
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="title">Title</label>
              <input
                id="title"
                name="title"
                type="text"
                className="form-control"
                value={form.title}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="col-md-6">
            <div className="form-group mb-3">
              <label htmlFor="tag">Tag</label>
              <input
                id="tag"
                name="tag"
                type="text"
                className="form-control"
                value={form.tag}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label htmlFor="price">Price</label>
              <input
                id="price"
                name="price"
                type="number"
                className="form-control"
                value={form.price}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label htmlFor="lesson">Lessons</label>
              <input
                id="lesson"
                name="lesson"
                type="number"
                className="form-control"
                value={form.lesson}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="col-md-4">
            <div className="form-group mb-3">
              <label htmlFor="student">Students</label>
              <input
                id="student"
                name="student"
                type="number"
                className="form-control"
                value={form.student}
                onChange={handleChange}
              />
            </div>
          </div>
        </div>

        <div className="form-group mb-3">
          <label htmlFor="description">Description</label>
          <textarea
            id="description"
            name="description"
            className="form-control"
            rows={3}
            value={form.description || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="videoUrl">Video URL</label>
          <input
            id="videoUrl"
            name="videoUrl"
            type="url"
            className="form-control"
            value={form.videoUrl || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="thumbnailUrl">Thumbnail URL</label>
          <input
            id="thumbnailUrl"
            name="thumbnailUrl"
            type="url"
            className="form-control"
            value={form.thumbnailUrl || ""}
            onChange={handleChange}
          />
        </div>

        <div className="form-group mb-3">
          <label htmlFor="review">Review</label>
          <textarea
            id="review"
            name="review"
            className="form-control"
            rows={2}
            value={form.review}
            onChange={handleChange}
          />
        </div>

        <button 
          type="submit" 
          className="btn btn-success me-2"
          disabled={loading}
        >
          {loading ? "Updating..." : "Update Video"}
        </button>
        
        <button 
          type="button" 
          className="btn btn-secondary"
          onClick={() => router.back()}
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default EditVideo;
