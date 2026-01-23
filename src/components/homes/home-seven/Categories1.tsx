"use client";
import Link from "next/link";

interface DataType {
  id: number;
  icon: string;
  title: string;
  total: string;
}

const category_data: DataType[] = [
  { id: 1, icon: "🧠", title: "Anatomy", total: "(12)" },
  { id: 2, icon: "🧪", title: "Biochemistry", total: "(10)" },
  { id: 3, icon: "❤️", title: "Physiology", total: "(15)" },
  { id: 4, icon: "🏥", title: "Community Medicine", total: "(8)" },
  { id: 5, icon: "💊", title: "Pharmacology", total: "(11)" },
  { id: 6, icon: "🦠", title: "Pathology", total: "(14)" },
  { id: 7, icon: "🧫", title: "Microbiology", total: "(9)" },
  { id: 8, icon: "⚖️", title: "Forensic Medicine", total: "(6)" },
  { id: 9, icon: "🩺", title: "Clinical Postings", total: "(10)" },
  { id: 10, icon: "💉", title: "OPD", total: "(7)" },
  { id: 11, icon: "👂", title: "ENT", total: "(5)" },
  { id: 12, icon: "👁️", title: "Ophthalmology", total: "(7)" },
  { id: 13, icon: "🧘", title: "Psychiatry", total: "(4)" },
  { id: 14, icon: "🧴", title: "Dermatology", total: "(3)" },
  { id: 15, icon: "👶", title: "Pediatrics", total: "(9)" },
  { id: 16, icon: "💤", title: "Anesthesiology", total: "(5)" },
  { id: 17, icon: "🦴", title: "Orthopaedics", total: "(6)" },
  { id: 18, icon: "🤰", title: "Obstetrics & Gynaecology", total: "(13)" },
];

const Categories1 = () => {
  return (
    <section className="categories-area section-py-120">
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-xl-6 col-lg-8">
            <div className="section__title text-center mb-40">
              <span className="sub-title">Explore Categories</span>
              <h2 className="title">Medical Subjects We Cover</h2>
              <p className="desc">Select from a wide range of medical fields to enhance your knowledge.</p>
            </div>
          </div>
        </div>

        <div className="row">
          {category_data.map((item) => (
            <div key={item.id} className="col-lg-3 col-md-4 col-sm-6 mb-4">
              <div
                className="categories__item text-center p-4 border rounded shadow-sm h-100 d-flex flex-column justify-content-center align-items-center category-card"
              >
                <Link href="/courses" className="text-decoration-none text-dark w-100 h-100 d-flex flex-column justify-content-center align-items-center">
                  <div
                    className="icon mb-3 d-flex justify-content-center align-items-center"
                    style={{
                      width: "90px",
                      height: "90px",
                      borderRadius: "50%",
                      background: "#f3f4f6",
                      fontSize: "40px",
                      transition: "all 0.3s ease",
                    }}
                  >
                    {item.icon}
                  </div>
                  <span className="name d-block fw-bold mb-1" style={{ fontSize: "16px" }}>
                    {item.title}
                  </span>
                  <span className="courses text-muted" style={{ fontSize: "14px" }}>
                    {item.total}
                  </span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Custom Styles for Hover */}
      <style jsx>{`
        .category-card {
          transition: all 0.3s ease;
        }
        .category-card:hover {
          transform: translateY(-10px);
          box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
          border-color: #168e6a; /* Optional border color on hover */
        }
        .category-card:hover .icon {
          background: #168e6a;
          color: white;
        }
      `}</style>
    </section>
  );
};

export default Categories1;
