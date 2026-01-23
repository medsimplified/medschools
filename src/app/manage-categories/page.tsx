"use client";

import { useState, useEffect, FormEvent } from "react";
import { Form, Button, Table, Modal } from "react-bootstrap";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
// import Image from "next/image";
// import bg_img from "@/assets/img/bg/dashboard_bg.jpg";

interface CategoryType {
  id?: number;
  icon: string;
  title: string;
  total: string;
  order: number;
}

const ManageCategories = () => {
  const [categories, setCategories] = useState<CategoryType[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState<CategoryType | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CategoryType>({
    icon: "",
    title: "",
    total: "",
    order: 0,
  });

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      const response = await fetch("/api/categories");
      if (response.ok) {
        const data = await response.json();
        setCategories(data);
      }
    } catch (error) {
      console.error("Error fetching categories:", error);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    try {
      const url = editingCategory
        ? `/api/categories/${editingCategory.id}`
        : "/api/categories";

      const method = editingCategory ? "PUT" : "POST";

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        await fetchCategories();
        setShowModal(false);
        setEditingCategory(null);
        setFormData({ icon: "", title: "", total: "", order: 0 });
      }
    } catch (error) {
      console.error("Error saving category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (category: CategoryType) => {
    setEditingCategory(category);
    setFormData(category);
    setShowModal(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this category?")) return;

    try {
      const response = await fetch(`/api/categories/${id}`, {
        method: "DELETE",
      });

      if (response.ok) {
        fetchCategories();
      }
    } catch (error) {
      console.error("Error deleting category:", error);
    }
  };

  return (
    <section className="dashboard__area section-pb-120">
      <div className="dashboard__bg">
        {/* <Image src={bg_img} alt="bg" /> */}
      </div>
      <div className="container">
        <div className="dashboard__inner-wrap row">
          <DashboardSidebar />
          <div className="col-lg-9">
            <div className="d-flex justify-content-between align-items-center mb-4">
              <h4 className="title">Manage Categories</h4>
              <Button
                variant="primary"
                onClick={() => {
                  setEditingCategory(null);
                  setFormData({ icon: "", title: "", total: "", order: 0 });
                  setShowModal(true);
                }}
              >
                Add New Category
              </Button>
            </div>

            <div className="bg-white p-4 rounded shadow">
              <Table responsive striped hover>
                <thead>
                  <tr>
                    <th>Icon</th>
                    <th>Title</th>
                    <th>Total</th>
                    <th>Order</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((category) => (
                    <tr key={category.id}>
                      <td>
                        <span style={{ fontSize: "24px" }}>
                          {category.icon}
                        </span>
                      </td>
                      <td>{category.title}</td>
                      <td>{category.total}</td>
                      <td>{category.order}</td>
                      <td>
                        <Button
                          size="sm"
                          variant="outline-primary"
                          className="me-2"
                          onClick={() => handleEdit(category)}
                        >
                          Edit
                        </Button>
                        <Button
                          size="sm"
                          variant="outline-danger"
                          onClick={() => handleDelete(category.id!)}
                        >
                          Delete
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
            <span style={{ color: "#64748b", fontSize: "13px" }}>
              Use &quot;Add Category&quot; to create a new category.
            </span>
          </div>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Form onSubmit={handleSubmit}>
          <Modal.Header closeButton>
            <Modal.Title>
              {editingCategory ? "Edit Category" : "Add New Category"}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form.Group className="mb-3">
              <Form.Label>Icon (Emoji)</Form.Label>
              <Form.Control
                type="text"
                value={formData.icon}
                onChange={(e) =>
                  setFormData({ ...formData, icon: e.target.value })
                }
                placeholder="🧠"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Title</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) =>
                  setFormData({ ...formData, title: e.target.value })
                }
                placeholder="Anatomy"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>
                Total (e.g., &quot;(12)&quot;)
              </Form.Label>
              <Form.Control
                type="text"
                value={formData.total}
                onChange={(e) =>
                  setFormData({ ...formData, total: e.target.value })
                }
                placeholder="(12)"
                required
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label>Order</Form.Label>
              <Form.Control
                type="number"
                value={formData.order}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    order: parseInt(e.target.value || "0", 10),
                  })
                }
                placeholder="0"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button
              variant="secondary"
              type="button"
              onClick={() => setShowModal(false)}
            >
              Cancel
            </Button>
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Category"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </section>
  );
};

export default ManageCategories;
