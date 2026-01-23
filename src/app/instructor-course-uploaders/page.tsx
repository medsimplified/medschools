"use client";
import { useEffect, useState } from "react";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
import Image from "next/image";
// import bg_img from "@/assets/img/bg/dashboard_bg.jpg";
import AuthGuard from "@/components/common/AuthGuard";

const InstructorCourseUploaders = () => {
  const [uploaders, setUploaders] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  useEffect(() => {
    const fetchUploaders = async () => {
      try {
        const res = await fetch("/api/course-uploaders");
        const data = await res.json();
        setUploaders(data);
      } catch (err) {
        console.error("Failed to fetch course uploaders", err);
      }
    };
    fetchUploaders();
  }, []);

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
            <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #e3e6ed44', padding: 0, overflow: 'hidden', border: '1.5px solid #e3e6ed' }}>
              <table className="table" style={{ margin: 0, borderRadius: 18, overflow: 'hidden' }}>
                <thead style={{ background: 'linear-gradient(90deg,#f7b32b 0%,#5624d0 100%)' }}>
                  <tr>
                    <th style={{ color: '#000', fontWeight: 800, fontSize: 17, border: 'none', letterSpacing: 1, padding: '16px 0' }}>Name</th>
                    <th style={{ color: '#000', fontWeight: 800, fontSize: 17, border: 'none', letterSpacing: 1, padding: '16px 0' }}>Email</th>
                    <th style={{ color: '#000', fontWeight: 800, fontSize: 17, border: 'none', letterSpacing: 1, padding: '16px 0' }}>Phone</th>
                    <th style={{ color: '#000', fontWeight: 800, fontSize: 17, border: 'none', letterSpacing: 1, padding: '16px 0' }}>University</th>
                    <th style={{ color: '#000', fontWeight: 800, fontSize: 17, border: 'none', letterSpacing: 1, padding: '16px 0' }}>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {paginated.map((user: any, idx: number) => (
                    <tr key={user.id} style={{ background: idx % 2 === 0 ? '#f7f8fa' : '#fff', transition: 'background 0.2s' }}>
                      <td style={{ fontWeight: 700, color: '#222', fontSize: 16, padding: '14px 0', border: 'none' }}>{user.fname} {user.lname}</td>
                      <td style={{ fontWeight: 500, color: '#5624d0', fontSize: 16, padding: '14px 0', border: 'none' }}>{user.email}</td>
                      <td style={{ fontWeight: 500, color: '#222', fontSize: 16, padding: '14px 0', border: 'none' }}>{user.phone || "-"}</td>
                      <td style={{ fontWeight: 500, color: '#222', fontSize: 16, padding: '14px 0', border: 'none' }}>{user.university || "-"}</td>
                      <td style={{ fontWeight: 600, color: '#f7b32b', fontSize: 14, padding: '14px 0', border: 'none', textTransform: 'capitalize' }}>{user.role?.replace('_', ' ')}</td>
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
