"use client";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { toast } from "react-toastify";


interface LatestVideo {
  id: string;
  title: string;
  tag: string;
  review: string;
  price: number;
  lesson: string;
  student: number;
  thumb: string;
}

const ManageLatestVideos = () => {
  const [videos, setVideos] = useState<LatestVideo[]>([]);

  const fetchVideos = async () => {
    const res = await fetch("/api/latest-videos");
    const data = await res.json();
    setVideos(data);
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  const handleDelete = async (id: string) => {
    const res = await fetch(`/api/latest-videos/${id}`, {
      method: "DELETE",
    });
    const data = await res.json();

    if (res.ok) {
      toast.success("Video deleted!");
      fetchVideos(); // refresh list
    } else {
      toast.error(data.error || "Failed to delete");
    }
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">Manage Latest Videos</h2>
      <div className="row">
        {videos.map((video) => (
          <div key={video.id} className="col-md-4 mb-4">
            <div className="card">
              <Image src={video.thumb} alt={video.title} width={400} height={200} />
              <div className="card-body">
                <h5>{video.title}</h5>
                <p><strong>Tag:</strong> {video.tag}</p>
                <div className="d-flex justify-content-between">
                  <Link href={`/instructor-dashboard/edit-video/${video.id}`} className="btn btn-sm btn-primary">Edit</Link>
                  <button className="btn btn-sm btn-danger" onClick={() => handleDelete(video.id)}>Delete</button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ManageLatestVideos;
