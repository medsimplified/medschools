"use client";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import Image from "next/image";
import bg_img from "@/assets/img/bg/dashboard_bg.jpg"
import React from "react";
import FooterTwo from "@/layouts/footers/FooterTwo";
interface Banner {
  id: number
  heading: string
  subheading: string
  buttonText: string
  buttonLink?: string
  youtubeUrl: string
}

export default function BannerVideos() {
  const [banners, setBanners] = useState<Banner[]>([])
  const [editing, setEditing] = useState<Banner | null>(null)
  const [form, setForm] = useState<Omit<Banner, "id">>({ heading: "", subheading: "", buttonText: "", buttonLink: "", youtubeUrl: "" })

  useEffect(() => {
    fetch('/api/banner-videos') // <-- FIXED
      .then(res => res.json())
      .then(setBanners)
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editing) {
      const res = await fetch('/api/banner-videos', { // <-- FIXED
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, id: editing.id })
      })
      const updated = await res.json()
      setBanners(banners.map(b => b.id === updated.id ? updated : b))
      setEditing(null)
    } else {
      const res = await fetch('/api/banner-videos', { // <-- FIXED
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const created = await res.json()
      setBanners([...banners, created])
    }
    setForm({ heading: "", subheading: "", buttonText: "", buttonLink: "", youtubeUrl: "" })
  }

  const handleEdit = (b: Banner) => {
    setEditing(b)
    setForm({ heading: b.heading, subheading: b.subheading, buttonText: b.buttonText, buttonLink: b.buttonLink || "", youtubeUrl: b.youtubeUrl })
  }

  const handleDelete = async (id: number) => {
    await fetch('/api/banner-videos', { // <-- FIXED
      method: 'DELETE',
      body: JSON.stringify({ id }),
      headers: { 'Content-Type': 'application/json' }
    })
    setBanners(banners.filter(b => b.id !== id))
    if (editing && editing.id === id) setEditing(null)
  }

  return (
    <>
      <section className="dashboard-area section-py-80" style={{ background: "#f7f8fa" }}>
        <div className="container">
          <div className="row">
            {/* Sidebar */}
            <div className="col-lg-3">
              <DashboardSidebar />
              <div className="dashboard__sidebar-img mt-4 text-center">
                <Image src={bg_img} alt="Sidebar" style={{ maxWidth: "100%", height: "auto", borderRadius: 12, boxShadow: "0 2px 16px rgba(0,0,0,0.07)" }} />
              </div>
            </div>
            {/* Main Content */}
            <div className="col-lg-9">
              <div className="dashboard-content" style={{ background: "#fff", borderRadius: 16, boxShadow: "0 2px 24px rgba(0,0,0,0.07)", padding: "32px 24px" }}>
                <div className="dashboard__content-title mb-4 pb-2 border-bottom">
                  <h4 className="title mb-0" style={{ fontWeight: 700 }}>Banner Videos (Slider)</h4>
                  <p className="text-muted mt-2 mb-0" style={{ fontSize: 15 }}>Manage homepage banner slides with heading, subheading, button, and YouTube video.</p>
                </div>
                <div className="dashboard__form-wrap mb-4">
                  <form className="dashboard__form row g-3" onSubmit={handleSubmit}>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Main Heading</label>
                      <input className="form-control" placeholder="Main Heading" value={form.heading} onChange={e => setForm(f => ({ ...f, heading: e.target.value }))} required />
                    </div>
                    <div className="col-md-6">
                      <label className="form-label fw-semibold">Subheading</label>
                      <input className="form-control" placeholder="Subheading" value={form.subheading} onChange={e => setForm(f => ({ ...f, subheading: e.target.value }))} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Button Text</label>
                      <input className="form-control" placeholder="Button Text" value={form.buttonText} onChange={e => setForm(f => ({ ...f, buttonText: e.target.value }))} required />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">Button Link</label>
                      <input className="form-control" placeholder="Button Link" value={form.buttonLink} onChange={e => setForm(f => ({ ...f, buttonLink: e.target.value }))} />
                    </div>
                    <div className="col-md-4">
                      <label className="form-label fw-semibold">YouTube URL</label>
                      <input className="form-control" placeholder="YouTube URL" value={form.youtubeUrl} onChange={e => setForm(f => ({ ...f, youtubeUrl: e.target.value }))} required />
                    </div>
                    <div className="col-12">
                      <button type="submit" className="btn btn-primary">{editing ? "Update" : "Add"} Banner</button>
                      {editing && <button type="button" className="btn btn-secondary ms-2" onClick={() => { setEditing(null); setForm({ heading: "", subheading: "", buttonText: "", buttonLink: "", youtubeUrl: "" }) }}>Cancel</button>}
                    </div>
                  </form>
                </div>
                <div className="dashboard__table-wrap">
                  <div className="table-responsive">
                    <table className="table table-bordered align-middle mb-0">
                      <thead className="table-light">
                        <tr>
                          <th>Heading</th>
                          <th>Subheading</th>
                          <th>Button</th>
                          <th>YouTube URL</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {banners.map(b => (
                          <tr key={b.id}>
                            <td>{b.heading}</td>
                            <td>{b.subheading}</td>
                            <td>
                              {b.buttonLink ? (
                                <a href={b.buttonLink} target="_blank" rel="noopener noreferrer">{b.buttonText}</a>
                              ) : (
                                b.buttonText
                              )}
                            </td>
                            <td>
                              <a href={b.youtubeUrl} target="_blank" rel="noopener noreferrer">{b.youtubeUrl}</a>
                            </td>
                            <td>
                              <button className="btn btn-sm btn-warning me-2" onClick={() => handleEdit(b)}>Edit</button>
                              <button className="btn btn-sm btn-danger" onClick={() => handleDelete(b.id)}>Delete</button>
                            </td>
                          </tr>
                        ))}
                        {banners.length === 0 && (
                          <tr>
                            <td colSpan={5} className="text-center">No banners found.</td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            {/* End Main Content */}
          </div>
        </div>
      </section>
      <FooterTwo />
    </>
  )
}
