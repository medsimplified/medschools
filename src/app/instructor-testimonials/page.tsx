"use client";
import { useState, useEffect } from "react";
import Image from "next/image";
import { Button, Form, Modal, Card } from "react-bootstrap";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
import { FaStar } from "@/lib/fontAwesomeIconsComplete";


interface TestimonialType {
  id?: string;
  studentName: string;
  text: string;
  rating: number;
  image: string;
  youtubeUrl?: string;
}

const InstructorTestimonials = () => {
  const [testimonials, setTestimonials] = useState<TestimonialType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingTestimonial, setEditingTestimonial] = useState<TestimonialType | null>(null);
  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [formData, setFormData] = useState<TestimonialType>({
    studentName: "",
    text: "",
    rating: 5,
    image: "",
    youtubeUrl: "",
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
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
    if (!formData.studentName.trim() || !formData.text.trim()) {
      alert('Please enter student name and testimonial text');
      return;
    }
    if (!imageFile && !formData.image) {
      alert('Please select an image');
      return;
    }

    setLoading(true);

    try {
      let imageUrl = formData.image;

      // Upload image if a new file was selected
      if (imageFile) {
        const uploadedUrl = await handleImageUpload(imageFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else {
          setLoading(false);
          return;
        }
      }

      const testimonialData = {
        studentName: formData.studentName,
        text: formData.text,
        rating: formData.rating,
        image: imageUrl,
        youtubeUrl: formData.youtubeUrl,
      };

      const url = editingTestimonial
        ? `/api/testimonials/${editingTestimonial.id}`
        : '/api/testimonials';

      const method = editingTestimonial ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testimonialData),
      });

      if (response.ok) {
        fetchTestimonials();
        setShowModal(false);
        setEditingTestimonial(null);
        setImageFile(null);
        setFormData({
          studentName: "",
          text: "",
          rating: 5,
          image: "",
          youtubeUrl: "",
        });
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (testimonial: TestimonialType) => {
    setEditingTestimonial(testimonial);
    setFormData(testimonial);
    setImageFile(null);
    setShowModal(true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this testimonial?')) return;

    try {
      const response = await fetch(`/api/testimonials/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error deleting testimonial:', error);
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
      <div className="container">
        <div className="dashboard__inner-wrap row">
          <DashboardSidebar />
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="title">Manage Testimonials</h4>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingTestimonial(null);
                  setFormData({
                    studentName: "",
                    text: "",
                    rating: 5,
                    image: "",
                    youtubeUrl: "",
                  });
                  setImageFile(null);
                  setShowModal(true);
                }}
              >
                Add New Testimonial
              </Button>
            </div>

            {/* Always show the form at the top */}
            <div className="mb-4">
              <Card>
                <Card.Body>
                  <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3">
                      <Form.Label>Student Name *</Form.Label>
                      <Form.Control
                        type="text"
                        value={formData.studentName}
                        onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                        placeholder="Student Name"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Testimonial *</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={formData.text}
                        onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                        placeholder="Testimonial text"
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Rating *</Form.Label>
                      <Form.Control
                        type="number"
                        min={1}
                        max={5}
                        value={formData.rating}
                        onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                        required
                      />
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>Student Image *</Form.Label>
                      <Form.Control
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = (e.target as HTMLInputElement).files?.[0];
                          if (file) setImageFile(file);
                        }}
                        required={!formData.image}
                      />
                      {formData.image && (
                        <div className="mt-2">
                          <small className="text-muted">Current image:</small><br />
                          <Image
                            src={formData.image}
                            alt="Current"
                            width={100}
                            height={80}
                            style={{ objectFit: 'cover', borderRadius: '8px' }}
                          />
                        </div>
                      )}
                    </Form.Group>
                    <Form.Group className="mb-3">
                      <Form.Label>YouTube Link (optional)</Form.Label>
                      <Form.Control
                        type="url"
                        value={formData.youtubeUrl || ""}
                        onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                        placeholder="https://youtube.com/..."
                      />
                    </Form.Group>
                    <Button
                      variant="primary"
                      type="submit"
                      disabled={loading || uploading}
                    >
                      {loading ? 'Saving...' : uploading ? 'Uploading...' : (editingTestimonial ? 'Update Testimonial' : 'Add Testimonial')}
                    </Button>
                  </Form>
                </Card.Body>
              </Card>
            </div>

            <div className="row">
              {testimonials.map((t) => (
                <div key={t.id} className="col-md-6 col-lg-4 mb-4">
                  <Card>
                    {t.image && (
                      <Card.Img
                        variant="top"
                        src={t.image}
                        style={{ height: '200px', objectFit: 'cover' }}
                      />
                    )}
                    <Card.Body>
                      <Card.Title>
                        {t.studentName}
                        <span className="ms-2 text-warning">
                          {t.rating}/5 <FaStar aria-hidden />
                        </span>
                      </Card.Title>
                      <Card.Text>{t.text}</Card.Text>
                      {t.youtubeUrl && (
                        <a
                          href={t.youtubeUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="btn btn-sm btn-danger mb-2"
                        >
                          Watch Video
                        </a>
                      )}
                      <div className="d-flex gap-2 mt-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleEdit(t)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(t.id!)}
                        >
                          Delete
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </div>
              ))}
            </div>

            {testimonials.length === 0 && (
              <div className="text-center py-5">
                <p className="text-muted">No testimonials found. Add your first testimonial!</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingTestimonial ? 'Edit Testimonial' : 'Add New Testimonial'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3">
              <Form.Label>Student Name *</Form.Label>
              <Form.Control
                type="text"
                value={formData.studentName}
                onChange={(e) => setFormData({ ...formData, studentName: e.target.value })}
                placeholder="Student Name"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Testimonial *</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.text}
                onChange={(e) => setFormData({ ...formData, text: e.target.value })}
                placeholder="Testimonial text"
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Rating *</Form.Label>
              <Form.Control
                type="number"
                min={1}
                max={5}
                value={formData.rating}
                onChange={(e) => setFormData({ ...formData, rating: Number(e.target.value) })}
                required
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Student Image *</Form.Label>
              <Form.Control
                type="file"
                accept="image/*"
                onChange={(e) => {
                  const file = (e.target as HTMLInputElement).files?.[0];
                  if (file) setImageFile(file);
                }}
                required={!formData.image}
              />
              {formData.image && (
                <div className="mt-2">
                  <small className="text-muted">Current image:</small><br />
                  <Image
                    src={formData.image}
                    alt="Current"
                    width={100}
                    height={80}
                    style={{ objectFit: 'cover', borderRadius: '8px' }}
                  />
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>YouTube Link (optional)</Form.Label>
              <Form.Control
                type="url"
                value={formData.youtubeUrl || ""}
                onChange={(e) => setFormData({ ...formData, youtubeUrl: e.target.value })}
                placeholder="https://youtube.com/..."
              />
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
            {loading ? 'Saving...' : uploading ? 'Uploading...' : 'Save Testimonial'}
          </Button>
        </Modal.Footer>
      </Modal>
    </section>
  );
};

export default InstructorTestimonials;
