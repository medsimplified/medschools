"use client";
import { useCallback, useEffect, useState, type ChangeEvent, type FormEvent } from "react";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
// import bg_img from "@/assets/img/bg/dashboard_bg.jpg";
import AuthGuard from "@/components/common/AuthGuard";

const InstructorCourseUploaders = () => {
  const [uploaders, setUploaders] = useState<any[]>([]);
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [createForm, setCreateForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    organization: "",
  });
  const [createError, setCreateError] = useState<string | null>(null);
  const [createSuccess, setCreateSuccess] = useState<string | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const [editForm, setEditForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    phone: "",
    organization: "",
  });
  const [editError, setEditError] = useState<string | null>(null);
  const [editSuccess, setEditSuccess] = useState<string | null>(null);
  const [editLoading, setEditLoading] = useState(false);

  const fetchUploaders = useCallback(async () => {
    try {
      const res = await fetch("/api/course-uploaders");
      if (!res.ok) {
        throw new Error("Failed to load course uploaders");
      }
      const data = await res.json();
      setUploaders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to fetch course uploaders", err);
    }
  }, []);

  useEffect(() => {
    fetchUploaders();
  }, [fetchUploaders]);

  const resetCreateForm = () => {
    setCreateForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      organization: "",
    });
  };

  const resetEditState = () => {
    setEditingId(null);
    setEditForm({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      phone: "",
      organization: "",
    });
    setEditError(null);
    setEditSuccess(null);
    setEditLoading(false);
  };

  const handleCreateChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setCreateForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditChange = (event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEditForm((prev) => ({ ...prev, [name]: value }));
  };

  const generatePassword = () => {
    const chars = "ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnpqrstuvwxyz23456789!@#$";
    let result = "";
    for (let i = 0; i < 10; i += 1) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setCreateForm((prev) => ({ ...prev, password: result }));
  };

  const startEditing = (user: any) => {
    setEditingId(user.id);
    setEditForm({
      firstName: user.fname || "",
      lastName: user.lname || "",
      email: user.email || "",
      password: "",
      phone: user.phone || "",
      organization: user.university || "",
    });
    setEditError(null);
    setEditSuccess(null);
    setIsCreating(false);
  };

  const handleEditSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!editingId) return;

    setEditError(null);
    setEditSuccess(null);
    setEditLoading(true);

    try {
      const res = await fetch(`/api/course-uploaders/${editingId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: editForm.firstName.trim(),
          lastName: editForm.lastName.trim() || undefined,
          email: editForm.email.trim(),
          password: editForm.password ? editForm.password : undefined,
          phone: editForm.phone.trim() || undefined,
          organization: editForm.organization.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to update course uploader");
      }

      setEditSuccess("Course uploader updated successfully.");
      await fetchUploaders();
      resetEditState();
    } catch (error: any) {
      setEditError(error?.message || "Failed to update course uploader");
    } finally {
      setEditLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm("Delete this course uploader? This action cannot be undone.");
    if (!confirmed) return;

    try {
      const res = await fetch(`/api/course-uploaders/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data?.error || "Failed to delete course uploader");
      }

      await fetchUploaders();
      setSelectedIds((prev) => {
        const updated = new Set(prev);
        updated.delete(id);
        return updated;
      });
      if (editingId === id) {
        resetEditState();
      }
    } catch (error: any) {
      alert(error?.message || "Failed to delete course uploader");
    }
  };

  const handleCreateSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setCreateError(null);
    setCreateSuccess(null);

    if (!createForm.firstName.trim() || !createForm.email.trim() || !createForm.password.trim()) {
      setCreateError("First name, email, and password are required.");
      return;
    }

    setCreateLoading(true);
    try {
      const res = await fetch("/api/course-uploaders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: createForm.firstName.trim(),
          lastName: createForm.lastName.trim() || undefined,
          email: createForm.email.trim(),
          password: createForm.password,
          phone: createForm.phone.trim() || undefined,
          organization: createForm.organization.trim() || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data?.error || "Failed to create course uploader");
      }

      setCreateSuccess("Course uploader created successfully. Share the credentials with them directly.");
      resetCreateForm();
      await fetchUploaders();
      setSelectedIds(new Set());
      setIsCreating(false);
    } catch (error: any) {
      setCreateError(error?.message || "Failed to create course uploader");
    } finally {
      setCreateLoading(false);
    }
  };

  // Filtered and paginated uploaders
  const filtered = uploaders.filter((user: any) => {
    const q = search.toLowerCase();
    return (
      user.fname?.toLowerCase().includes(q) ||
      user.lname?.toLowerCase().includes(q) ||
      user.email?.toLowerCase().includes(q) ||
      user.phone?.toLowerCase().includes(q) ||
      user.university?.toLowerCase().includes(q)
    );
  });
  const totalPages = Math.ceil(filtered.length / pageSize);
  const paginated = filtered.slice((page - 1) * pageSize, page * pageSize);

  // Download as Excel
  const downloadExcel = () => {
    // Dynamically import xlsx only when needed
    import("xlsx").then(XLSX => {
      const ws = XLSX.utils.json_to_sheet(filtered);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "CourseUploaders");
      XLSX.writeFile(wb, "course_uploaders.xlsx");
    });
  };

  return (
    <section className="dashboard__area section-pb-120" style={{ background: 'linear-gradient(120deg,#f7f8fa 0%,#e3e6ed 100%)', minHeight: '100vh' }}>
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
        {/* <Image src={bg_img} alt="bg" style={{ opacity: 0.08, objectFit: 'cover' }} /> */}
        </div>
      <div className="container">
        <div className="dashboard__inner-wrap row">
          <DashboardSidebar />
          <div className="col-lg-9">
            <div className="dashboard__content-title" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 16, marginBottom: 24 }}>
              <h4 className="title" style={{ fontWeight: 900, fontSize: 28, color: '#222', letterSpacing: 1, margin: 0 }}>Course Uploaders</h4>
              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating((prev) => {
                      const next = !prev;
                      if (!prev) {
                        resetEditState();
                      }
                      return next;
                    });
                    setCreateError(null);
                    setCreateSuccess(null);
                  }}
                  style={{
                    fontWeight: 700,
                    borderRadius: 10,
                    fontSize: 16,
                    background: 'linear-gradient(90deg,#0d447a 0%,#1976d2 100%)',
                    color: '#fff',
                    border: 'none',
                    boxShadow: '0 2px 8px rgba(13,68,122,0.35)',
                    padding: '8px 22px',
                    letterSpacing: 1,
                    textTransform: 'uppercase',
                  }}
                >
                  {isCreating ? 'Close' : 'Add Course Uploader'}
                </button>
                <input
                  type="text"
                  placeholder="Search uploaders..."
                  value={search}
                  onChange={e => { setSearch(e.target.value); setPage(1); }}
                  style={{ border: '1.5px solid #d1d5db', borderRadius: 12, padding: '8px 18px', fontSize: 16, background: '#fff', boxShadow: '0 2px 8px #e3e6ed44', outline: 'none', transition: 'border 0.2s', minWidth: 220 }}
                />
                <button className="btn btn-primary" onClick={downloadExcel} type="button" style={{ fontWeight: 700, borderRadius: 10, fontSize: 16, background: 'linear-gradient(90deg,#5624d0 60%,#f7b32b 100%)', color: '#fff', border: 'none', boxShadow: '0 2px 8px #5624d044', padding: '8px 22px', letterSpacing: 1, textTransform: 'uppercase' }}>Download Excel</button>
              </div>
            </div>
            {editingId && (
              <div style={{
                background: '#fff',
                borderRadius: 18,
                boxShadow: '0 4px 24px #e3e6ed44',
                padding: '24px',
                border: '1.5px solid #e3e6ed',
                marginBottom: 24,
              }}>
                <h5 style={{ fontWeight: 800, fontSize: 20, color: '#0d447a', marginBottom: 16 }}>
                  Edit course uploader
                </h5>
                <p style={{ color: '#555', marginBottom: 18 }}>
                  Update the details below. Leave the password blank to keep it unchanged.
                </p>
                {editError && (
                  <div style={{
                    background: '#fdecea',
                    color: '#b71c1c',
                    borderRadius: 10,
                    padding: '10px 16px',
                    fontWeight: 600,
                    marginBottom: 16,
                  }}>
                    {editError}
                  </div>
                )}
                {editSuccess && (
                  <div style={{
                    background: '#e8f5e9',
                    color: '#256029',
                    borderRadius: 10,
                    padding: '10px 16px',
                    fontWeight: 600,
                    marginBottom: 16,
                  }}>
                    {editSuccess}
                  </div>
                )}
                <form onSubmit={handleEditSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div className="form-grp">
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6 }}>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={editForm.firstName}
                      onChange={handleEditChange}
                      required
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #d1d5db',
                        padding: '10px 14px',
                        width: '100%',
                      }}
                    />
                  </div>
                  <div className="form-grp">
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6 }}>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={editForm.lastName}
                      onChange={handleEditChange}
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #d1d5db',
                        padding: '10px 14px',
                        width: '100%',
                      }}
                    />
                  </div>
                  <div className="form-grp">
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6 }}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={editForm.email}
                      onChange={handleEditChange}
                      required
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #d1d5db',
                        padding: '10px 14px',
                        width: '100%',
                      }}
                    />
                  </div>
                  <div className="form-grp">
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6 }}>New Password</label>
                    <input
                      type="text"
                      name="password"
                      value={editForm.password}
                      onChange={handleEditChange}
                      placeholder="Leave blank to keep existing"
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #d1d5db',
                        padding: '10px 14px',
                        width: '100%',
                      }}
                    />
                  </div>
                  <div className="form-grp">
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6 }}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={editForm.phone}
                      onChange={handleEditChange}
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #d1d5db',
                        padding: '10px 14px',
                        width: '100%',
                      }}
                    />
                  </div>
                  <div className="form-grp">
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6 }}>Organization / Department</label>
                    <input
                      type="text"
                      name="organization"
                      value={editForm.organization}
                      onChange={handleEditChange}
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #d1d5db',
                        padding: '10px 14px',
                        width: '100%',
                      }}
                    />
                  </div>
                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={resetEditState}
                      style={{
                        background: '#f1f1f1',
                        color: '#333',
                        borderRadius: 10,
                        padding: '10px 20px',
                        fontWeight: 600,
                        border: 'none',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={editLoading}
                      style={{
                        background: editLoading ? '#9ca3af' : 'linear-gradient(90deg,#5dba47 0%,#4a9c38 100%)',
                        color: '#fff',
                        borderRadius: 10,
                        padding: '10px 24px',
                        fontWeight: 700,
                        border: 'none',
                        boxShadow: '0 3px 12px rgba(93,186,71,0.35)',
                        cursor: editLoading ? 'not-allowed' : 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      {editLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            {isCreating && (
              <div style={{
                background: '#fff',
                borderRadius: 18,
                boxShadow: '0 4px 24px #e3e6ed44',
                padding: '24px',
                border: '1.5px solid #e3e6ed',
                marginBottom: 24,
              }}>
                <h5 style={{ fontWeight: 800, fontSize: 20, color: '#0d447a', marginBottom: 16 }}>
                  Create a course uploader account
                </h5>
                <p style={{ color: '#555', marginBottom: 18 }}>
                  Fill in the details below. Share the generated credentials with the uploader so they can sign in from the dedicated portal.
                </p>
                {createError && (
                  <div style={{
                    background: '#fdecea',
                    color: '#b71c1c',
                    borderRadius: 10,
                    padding: '10px 16px',
                    fontWeight: 600,
                    marginBottom: 16,
                  }}>
                    {createError}
                  </div>
                )}
                {createSuccess && (
                  <div style={{
                    background: '#e8f5e9',
                    color: '#256029',
                    borderRadius: 10,
                    padding: '10px 16px',
                    fontWeight: 600,
                    marginBottom: 16,
                  }}>
                    {createSuccess}
                  </div>
                )}
                <form onSubmit={handleCreateSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
                  <div className="form-grp">
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6 }}>First Name *</label>
                    <input
                      type="text"
                      name="firstName"
                      value={createForm.firstName}
                      onChange={handleCreateChange}
                      placeholder="e.g. Alex"
                      required
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #d1d5db',
                        padding: '10px 14px',
                        width: '100%',
                      }}
                    />
                  </div>
                  <div className="form-grp">
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6 }}>Last Name</label>
                    <input
                      type="text"
                      name="lastName"
                      value={createForm.lastName}
                      onChange={handleCreateChange}
                      placeholder="Optional"
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #d1d5db',
                        padding: '10px 14px',
                        width: '100%',
                      }}
                    />
                  </div>
                  <div className="form-grp">
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6 }}>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={createForm.email}
                      onChange={handleCreateChange}
                      placeholder="uploader@example.com"
                      required
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #d1d5db',
                        padding: '10px 14px',
                        width: '100%',
                      }}
                    />
                  </div>
                  <div className="form-grp" style={{ position: 'relative' }}>
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6 }}>Password *</label>
                    <input
                      type="text"
                      name="password"
                      value={createForm.password}
                      onChange={handleCreateChange}
                      placeholder="Generate or enter"
                      required
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #d1d5db',
                        padding: '10px 48px 10px 14px',
                        width: '100%',
                      }}
                    />
                    <button
                      type="button"
                      onClick={generatePassword}
                      style={{
                        position: 'absolute',
                        right: 8,
                        bottom: 10,
                        padding: '6px 12px',
                        borderRadius: 8,
                        border: 'none',
                        background: '#5dba47',
                        color: '#fff',
                        fontWeight: 600,
                        boxShadow: '0 2px 8px rgba(93,186,71,0.35)',
                        cursor: 'pointer',
                      }}
                    >
                      Generate
                    </button>
                  </div>
                  <div className="form-grp">
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6 }}>Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={createForm.phone}
                      onChange={handleCreateChange}
                      placeholder="Optional"
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #d1d5db',
                        padding: '10px 14px',
                        width: '100%',
                      }}
                    />
                  </div>
                  <div className="form-grp">
                    <label style={{ fontWeight: 600, color: '#222', marginBottom: 6 }}>Organization / Department</label>
                    <input
                      type="text"
                      name="organization"
                      value={createForm.organization}
                      onChange={handleCreateChange}
                      placeholder="Optional"
                      style={{
                        borderRadius: 10,
                        border: '1.5px solid #d1d5db',
                        padding: '10px 14px',
                        width: '100%',
                      }}
                    />
                  </div>

                  <div style={{ gridColumn: '1 / -1', display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 8 }}>
                    <button
                      type="button"
                      onClick={() => {
                        resetCreateForm();
                        setCreateError(null);
                        setCreateSuccess(null);
                        setIsCreating(false);
                      }}
                      style={{
                        background: '#f1f1f1',
                        color: '#333',
                        borderRadius: 10,
                        padding: '10px 20px',
                        fontWeight: 600,
                        border: 'none',
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={createLoading}
                      style={{
                        background: createLoading ? '#9ca3af' : 'linear-gradient(90deg,#5dba47 0%,#4a9c38 100%)',
                        color: '#fff',
                        borderRadius: 10,
                        padding: '10px 24px',
                        fontWeight: 700,
                        border: 'none',
                        boxShadow: '0 3px 12px rgba(93,186,71,0.35)',
                        cursor: createLoading ? 'not-allowed' : 'pointer',
                        textTransform: 'uppercase',
                        letterSpacing: 1,
                      }}
                    >
                      {createLoading ? 'Creating...' : 'Create Uploader'}
                    </button>
                  </div>
                </form>
              </div>
            )}
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #e3e6ed44', padding: 0, overflow: 'hidden', border: '1.5px solid #e3e6ed' }}>
              <table className="table" style={{ margin: 0, borderRadius: 18, overflow: 'hidden' }}>
                <thead style={{ background: 'linear-gradient(90deg,#f7b32b 0%,#5624d0 100%)' }}>
                  <tr>
                    <th style={{ color: '#000', fontWeight: 800, fontSize: 17, border: 'none', letterSpacing: 1, padding: '16px 0', width: 45 }}>
                      <input
                        type="checkbox"
                        aria-label="Select all"
                        checked={paginated.length > 0 && paginated.every((item) => selectedIds.has(item.id))}
                        onChange={(event) => {
                          const updated = new Set(selectedIds);
                          if (event.target.checked) {
                            paginated.forEach((item: any) => updated.add(item.id));
                          } else {
                            paginated.forEach((item: any) => updated.delete(item.id));
                          }
                          setSelectedIds(updated);
                        }}
                      />
                    </th>
                    <th style={{ color: '#000', fontWeight: 800, fontSize: 17, border: 'none', letterSpacing: 1, padding: '16px 0' }}>Name</th>
                    <th style={{ color: '#000', fontWeight: 800, fontSize: 17, border: 'none', letterSpacing: 1, padding: '16px 0' }}>Email</th>
                    <th style={{ color: '#000', fontWeight: 800, fontSize: 17, border: 'none', letterSpacing: 1, padding: '16px 0' }}>Phone</th>
                    <th style={{ color: '#000', fontWeight: 800, fontSize: 17, border: 'none', letterSpacing: 1, padding: '16px 0' }}>University</th>
                    <th style={{ color: '#000', fontWeight: 800, fontSize: 17, border: 'none', letterSpacing: 1, padding: '16px 0' }}>Role</th>
                    <th style={{ color: '#000', fontWeight: 800, fontSize: 17, border: 'none', letterSpacing: 1, padding: '16px 0' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((user: any, idx: number) => (
                    <tr key={user.id} style={{ background: idx % 2 === 0 ? '#f7f8fa' : '#fff', transition: 'background 0.2s' }}>
                      <td style={{ border: 'none', padding: '14px 8px', textAlign: 'center' }}>
                        <input
                          type="checkbox"
                          aria-label={`Select ${user.email}`}
                          checked={selectedIds.has(user.id)}
                          onChange={(event) => {
                            setSelectedIds((prev) => {
                              const updated = new Set(prev);
                              if (event.target.checked) updated.add(user.id);
                              else updated.delete(user.id);
                              return updated;
                            });
                          }}
                        />
                      </td>
                      <td style={{ fontWeight: 700, color: '#222', fontSize: 16, padding: '14px 0', border: 'none' }}>{user.fname} {user.lname}</td>
                      <td style={{ fontWeight: 500, color: '#5624d0', fontSize: 16, padding: '14px 0', border: 'none' }}>{user.email}</td>
                      <td style={{ fontWeight: 500, color: '#222', fontSize: 16, padding: '14px 0', border: 'none' }}>{user.phone || "-"}</td>
                      <td style={{ fontWeight: 500, color: '#222', fontSize: 16, padding: '14px 0', border: 'none' }}>{user.university || "-"}</td>
                      <td style={{ fontWeight: 600, color: '#f7b32b', fontSize: 14, padding: '14px 0', border: 'none', textTransform: 'capitalize' }}>{user.role?.replace('_', ' ')}</td>
                      <td style={{ border: 'none', padding: '14px 0' }}>
                        <div style={{ display: 'flex', gap: 8 }}>
                          <button
                            type="button"
                            onClick={() => startEditing(user)}
                            style={{
                              borderRadius: 10,
                              border: 'none',
                              padding: '6px 16px',
                              fontWeight: 600,
                              background: '#1976d2',
                              color: '#fff',
                              boxShadow: '0 2px 8px rgba(25,118,210,0.35)',
                            }}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(user.id)}
                            style={{
                              borderRadius: 10,
                              border: 'none',
                              padding: '6px 16px',
                              fontWeight: 600,
                              background: '#d32f2f',
                              color: '#fff',
                              boxShadow: '0 2px 8px rgba(211,47,47,0.35)',
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                  {paginated.length === 0 && (
                    <tr><td colSpan={5} style={{ textAlign: 'center', padding: 32, color: '#888', fontWeight: 600, fontSize: 18 }}>No course uploaders found.</td></tr>
                  )}
                </tbody>
              </table>
            </div>
            {/* Pagination */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 10, marginTop: 18, background: 'none' }}>
              <button className="btn btn-sm" disabled={page === 1} onClick={() => setPage(p => Math.max(1, p - 1))} style={{ borderRadius: 8, background: '#f7b32b', color: '#fff', fontWeight: 700, border: 'none', padding: '6px 18px', boxShadow: '0 2px 8px #f7b32b44', opacity: page === 1 ? 0.5 : 1 }}>Prev</button>
              <span style={{ fontWeight: 700, color: '#222', fontSize: 15 }}>Page {page} of {totalPages || 1}</span>
              <button className="btn btn-sm" disabled={page === totalPages || totalPages === 0} onClick={() => setPage(p => Math.min(totalPages, p + 1))} style={{ borderRadius: 8, background: '#5624d0', color: '#fff', fontWeight: 700, border: 'none', padding: '6px 18px', boxShadow: '0 2px 8px #5624d044', opacity: page === totalPages || totalPages === 0 ? 0.5 : 1 }}>Next</button>
              <select value={pageSize} onChange={e => { setPageSize(Number(e.target.value)); setPage(1); }} style={{ marginLeft: 8, borderRadius: 8, padding: '6px 10px', fontWeight: 600, color: '#222', border: '1.5px solid #d1d5db', background: '#fff', fontSize: 15 }}>
                {[10, 20, 50, 100].map(size => <option key={size} value={size}>{size} / page</option>)}
              </select>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Page() {
  return (
    <AuthGuard>
      <InstructorCourseUploaders />
    </AuthGuard>
  );
}
