"use client";
import { useState, useEffect } from "react";
import { Form, Button, Modal, Card } from "react-bootstrap";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
import Image from "next/image";
// import bg_img from "@/assets/img/bg/dashboard_bg.jpg";

interface CourseType {
  id?: string;
  title: string;
  thumb: string;
}

const ManageHomepageCourses = () => {
  const [courses, setCourses] = useState<CourseType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<CourseType | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<CourseType>({
    title: "",
    thumb: "",
  });

  useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      const response = await fetch('/api/homepage-courses');
      if (response.ok) {
        const data = await response.json();
        setCourses(data);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
    }
  };

  const handleImageUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      setUploading(true);
      const response = await fetch('/api/upload-file', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const result = await response.json();
        return result.url;
      }
      throw new Error('Upload failed');
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Failed to upload image');
      return null;
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert('Please enter a title');
      return;
    }
    if (!imageFile && !formData.thumb) {
      alert('Please select an image');
      return;
    }

    setLoading(true);

    try {
      let thumbnailUrl = formData.thumb;
      
      // Upload image if a new file was selected
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (uploadedUrl) {
          thumbnailUrl = uploadedUrl;
        } else {
          setLoading(false);
          return;
        }
      }

      const courseData = {
        title: formData.title,
        thumb: thumbnailUrl,
      };

      const url = editingCourse 
        ? `/api/homepage-courses/${editingCourse.id}` 
        : '/api/homepage-courses';
      
      const method = editingCourse ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(courseData),
      });

      if (response.ok) {
        fetchCourses();
        setShowModal(false);
        setEditingCourse(null);
        setImageFile(null);
        setFormData({
          title: "",
          thumb: "",
        });
      }
    } catch (error) {
      console.error('Error saving course:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (course: CourseType) => {
    setEditingCourse(course);
    setFormData(course);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this course?')) return;

    try {
      const response = await fetch(`/api/homepage-courses/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchCourses();
      }
    } catch (error) {
      console.error('Error deleting course:', error);
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="title">Manage Homepage Courses</h4>
              <Button 
                variant="primary" 
                onClick={() => {
                  setEditingCourse(null);
                  setFormData({
                    title: "",
                    thumb: "",
                  });
                  setImageFile(null);
                  setShowModal(true);
                }}
              >
                Add New Course
              </Button>
            </div>

            <div className="row">
              {courses.map((course) => (
                <div key={course.id} className="col-md-6 col-lg-4 mb-4">
                  <Card>
                    {course.thumb && (
                      <Card.Img 
                        variant="top" 
                        src={course.thumb} 
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>{course.title}</Card.Title>
                      <div className="d-flex gap-2 mt-3">
                        <Button 
                          size="sm" 
                          variant="outline-primary"
                          onClick={() => handleEdit(course)}
                        >
                          Edit
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline-danger"
                          onClick={() => handleDelete(course.id!)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>

            {courses.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No courses found. Add your first course!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingCourse ? 'Edit Course' : 'Add New Course'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Course Title *</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Introduction to Anatomy"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Course Image *</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) setImageFile(file);
                }}
                required={!formData.thumb}
              />
              {formData.thumb && (
                <div className="mt-2">
                  <small className="text-muted">Current image:</small><br/>
                  <Image 
                    src={formData.thumb} 
                    alt="Current thumbnail" 
                    width={150}
                    height={100}
                    style={{ objectFit: 'cover', borderRadius: '8px' }} 
                  />
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button 
            variant="primary" 
            onClick={handleSubmit}
            disabled={loading || uploading}
          >
            {loading ? 'Saving...' : uploading ? 'Uploading...' : 'Save Course'}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default ManageHomepageCourses;
