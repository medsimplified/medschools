"use client";
import { useEffect, useState } from "react";
import { Button, Form } from "react-bootstrap";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
import Image from "next/image";
// import bg_img from "@/assets/img/bg/dashboard_bg.jpg";

interface Banner {
  id?: number;                 // Prisma: Int
  heading: string;
  subheading: string;
  buttonText: string;
  buttonLink?: string | null;  // optional
  youtubeUrl: string;
  // createdAt / updatedAt are server-managed
}

const emptyBanner: Banner = {
  heading: "",
  subheading: "",
  buttonText: "",
  buttonLink: "",
  youtubeUrl: "",
};

const BannerVideos = () => {
  const [banners, setBanners] = useState<Banner[]>([ { ...emptyBanner } ]);
  const [allBanners, setAllBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(false);
  const [editBanner, setEditBanner] = useState<Banner | null>(null);

  // ------- API helpers -------
  const fetchBanners = async () => {
    setLoading(true);
    const res = await fetch("/api/banner-videos");
    const data = await res.json();
    // Expecting an array of { id, heading, subheading, buttonText, buttonLink, youtubeUrl }
    setAllBanners(Array.isArray(data) ? data : []);
    setLoading(false);
  };

  useEffect(() => {
    fetchBanners();
  }, []);

  // ------- Utils -------
  const isValidUrl = (val: string) => {
    if (!val) return true; // allow empty for optional buttonLink
    try {
      // Accept relative links like "/signup" as well as absolute URLs
      if (val.startsWith("/")) return true;
      new URL(val);
      return true;
    } catch {
      return false;
    }
  };

  const isValidYouTube = (val: string) => {
    if (!val) return false;
    try {
      const u = new URL(val);
      // Accept youtube.com or youtu.be
      return /(^|\.)youtube\.com$/.test(u.hostname) || /(^|\.)youtu\.be$/.test(u.hostname);
    } catch {
      return false;
    }
  };

  // ------- Create (supports multiple rows like your current UI) -------
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Basic client validation
    for (const b of banners) {
      if (!b.heading.trim()) return alert("Heading is required.");
      if (!b.subheading.trim()) return alert("Subheading is required.");
      if (!b.buttonText.trim()) return alert("Button Text is required.");
      if (!isValidUrl(b.buttonLink || "")) return alert("Button Link must be a valid URL or a relative path starting with '/'.");
      if (!isValidYouTube(b.youtubeUrl)) return alert("YouTube URL must be a valid YouTube link.");
    }

    // POST only the model fields
    const b = banners[0]; // or the banner you want to send

    const payload = {
      heading: b.heading.trim(),
      subheading: b.subheading.trim(),
      buttonText: b.buttonText.trim(),
      buttonLink: b.buttonLink?.trim() || null,
      youtubeUrl: b.youtubeUrl.trim(),
    };

    await fetch("/api/banner-videos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    // reset form
    setBanners([{ ...emptyBanner }]);
    fetchBanners();
  };

  // ------- Edit -------
  async function handleEditSubmit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    if (!editBanner?.id) return;

    if (!editBanner.heading.trim()) return alert("Heading is required.");
    if (!editBanner.subheading.trim()) return alert("Subheading is required.");
    if (!editBanner.buttonText.trim()) return alert("Button Text is required.");
    if (!isValidUrl(editBanner.buttonLink || "")) return alert("Button Link must be a valid URL or a relative path starting with '/'.");
    if (!isValidYouTube(editBanner.youtubeUrl)) return alert("YouTube URL must be a valid YouTube link.");

    const payload = {
      heading: editBanner.heading.trim(),
      subheading: editBanner.subheading.trim(),
      buttonText: editBanner.buttonText.trim(),
      buttonLink: editBanner.buttonLink?.trim() || null,
      youtubeUrl: editBanner.youtubeUrl.trim(),
    };

    await fetch(`/api/banner-videos/${editBanner.id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setEditBanner(null);
    fetchBanners();
  }

  function cancelEdit(e: React.MouseEvent<HTMLButtonElement>) {
    e.preventDefault();
    setEditBanner(null);
  }

  // ------- Render -------
  return (
    <section className="dashboard__area section-pb-120">
      {/* Banner image at the top, styled like DashboardBanner */}
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
            marginTop: "80px",
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
            <h4 className="title">Banners</h4>

            {/* CREATE FORM */}
            <Form className="p-4 bg-white shadow-sm border rounded" onSubmit={handleSubmit}>
              {banners.map((b, i) => (
                <div key={i} className="mb-5 border p-3 rounded">
                  <Form.Label className="fw-semibold">Banner #{i + 1}</Form.Label>

                  <Form.Control
                    className="mb-2"
                    placeholder="Heading"
                    value={b.heading}
                    onChange={(e) => {
                      const nd = [...banners];
                      nd[i].heading = e.target.value;
                      setBanners(nd);
                    }}
                  />

                  <Form.Control
                    className="mb-2"
                    placeholder="Subheading"
                    value={b.subheading}
                    onChange={(e) => {
                      const nd = [...banners];
                      nd[i].subheading = e.target.value;
                      setBanners(nd);
                    }}
                  />

                  <div className="row g-2 mb-2">
                    <div className="col-md-6">
                      <Form.Label>Button Text</Form.Label>
                      <Form.Control
                        value={b.buttonText}
                        onChange={(e) => {
                          const nd = [...banners];
                          nd[i].buttonText = e.target.value;
                          setBanners(nd);
                        }}
                        placeholder="Get Started"
                      />
                    </div>
                    <div className="col-md-6">
                      <Form.Label>Button Link (optional)</Form.Label>
                      <Form.Control
                        value={b.buttonLink || ""}
                        onChange={(e) => {
                          const nd = [...banners];
                          nd[i].buttonLink = e.target.value;
                          setBanners(nd);
                        }}
                        placeholder="/signup or https://example.com"
                      />
                    </div>
                  </div>

                  <Form.Group className="mb-2">
                    <Form.Label>YouTube URL</Form.Label>
                    <Form.Control
                      value={b.youtubeUrl}
                      onChange={(e) => {
                        const nd = [...banners];
                        nd[i].youtubeUrl = e.target.value;
                        setBanners(nd);
                      }}
                      placeholder="https://youtube.com/watch?v=..."
                    />
                    <Form.Text muted>
                      Must be a valid YouTube URL (youtube.com or youtu.be).
                    </Form.Text>
                  </Form.Group>

                  <div className="d-flex justify-content-end">
                    <Button
                      size="sm"
                      variant="outline-danger"
                      className="rounded-3 px-2 py-1"
                      style={{ fontSize: "0.92rem", fontWeight: 500, boxShadow: "none" }}
                      onClick={() => {
                        const nd = [...banners];
                        nd.splice(i, 1);
                        setBanners(nd.length ? nd : [{ ...emptyBanner }]);
                      }}
                    >
                      ✕ Remove
                    </Button>
                  </div>
                </div>
              ))}

              <div className="d-flex justify-content-between">
                <Button
                  size="sm"
                  variant="outline-dark"
                  className="rounded-3 px-2 py-1"
                  style={{ fontSize: "0.92rem", fontWeight: 500, boxShadow: "none" }}
                  onClick={() => setBanners((prev) => ([ ...prev, { ...emptyBanner } ]))}
                >
                  ＋ Add Banner
                </Button>

                <Button
                  type="submit"
                  variant="primary"
                  size="sm"
                  className="rounded-3 px-3 py-1"
                  style={{ fontSize: "1rem", fontWeight: 500, boxShadow: "none", letterSpacing: "0.5px" }}
                >
                  Save Banners
                </Button>
              </div>
            </Form>

            <hr className="my-5" />
            <h4 className="title mb-3">All Banners</h4>

            {loading ? (
              <div>Loading...</div>
            ) : (
              <div>
                {allBanners.length === 0 && (
                  <div className="text-center text-muted mb-4">No banners found.</div>
                )}
                <table className="table table-bordered table-striped">
                  <thead>
                    <tr>
                      <th>Heading</th>
                      <th>YouTube</th>
                      <th>Button</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {allBanners.map((b) => {
                      async function handleDelete(id: number) {
                        if (!window.confirm("Delete this banner?")) return;
                        await fetch(`/api/banner-videos/${id}`, { method: "DELETE" });
                        fetchBanners();
                      }

                      function startEdit(b: Banner) {
                        setEditBanner({ ...b });
                      }

                      return (
                        <tr key={b.id}>
                          <td style={{ fontWeight: 600 }}>{b.heading}</td>
                          <td>
                            {b.youtubeUrl ? (
                              <a href={b.youtubeUrl} target="_blank" rel="noreferrer">Open</a>
                            ) : (
                              <em className="text-muted">—</em>
                            )}
                          </td>
                          <td>
                            {b.buttonText}
                            {b.buttonLink ? (
                              <>
                                {" "}
                                <a href={b.buttonLink} target="_blank" rel="noreferrer">(link)</a>
                              </>
                            ) : null}
                          </td>
                          <td>
                            <button className="btn btn-sm btn-warning" onClick={() => startEdit(b)}>Edit</button>
                            <button className="btn btn-sm btn-danger ms-2" onClick={() => handleDelete(b.id!)}>Delete</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>

                {/* EDIT MODAL */}
                {editBanner && (
                  <div className="modal show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.2)" }}>
                    <div className="modal-dialog modal-xl">
                      <div className="modal-content">
                        <div className="modal-header">
                          <h5 className="modal-title">Edit Banner: {editBanner.heading}</h5>
                          <button type="button" className="btn-close" onClick={cancelEdit}></button>
                        </div>
                        <div className="modal-body">
                          <Form>
                            <Form.Control
                              className="mb-2"
                              placeholder="Heading"
                              value={editBanner.heading}
                              onChange={(e) => setEditBanner({ ...editBanner, heading: e.target.value })}
                            />
                            <Form.Control
                              className="mb-2"
                              placeholder="Subheading"
                              value={editBanner.subheading}
                              onChange={(e) => setEditBanner({ ...editBanner, subheading: e.target.value })}
                            />

                            <div className="row g-2 mb-2">
                              <div className="col-md-6">
                                <Form.Label>Button Text</Form.Label>
                                <Form.Control
                                  value={editBanner.buttonText}
                                  onChange={(e) => setEditBanner({ ...editBanner, buttonText: e.target.value })}
                                />
                              </div>
                              <div className="col-md-6">
                                <Form.Label>Button Link (optional)</Form.Label>
                                <Form.Control
                                  value={editBanner.buttonLink || ""}
                                  onChange={(e) => setEditBanner({ ...editBanner, buttonLink: e.target.value })}
                                />
                              </div>
                            </div>

                            <Form.Group className="mb-2">
                              <Form.Label>YouTube URL</Form.Label>
                              <Form.Control
                                value={editBanner.youtubeUrl}
                                onChange={(e) => setEditBanner({ ...editBanner, youtubeUrl: e.target.value })}
                              />
                              <Form.Text muted>
                                Must be a valid YouTube URL (youtube.com or youtu.be).
                              </Form.Text>
                            </Form.Group>
                          </Form>
                        </div>
                        <div className="modal-footer">
                          <button className="btn btn-secondary" onClick={cancelEdit}>Cancel</button>
                          <button className="btn btn-primary" onClick={handleEditSubmit}>Save Changes</button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default BannerVideos;
