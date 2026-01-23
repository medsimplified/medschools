"use client";

import Link from "next/link";

const Cta = () => {
  return (
    <section
      className="cta__area-three"
      style={{
        width: "100%",
        padding: "80px 5px 40px 5px",
        display: "flex",
        justifyContent: "center",
      }}
    >
      <div
        className="cta__bg-three"
        style={{
          backgroundImage: `url(/assets/img/others/cta.png)`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          minHeight: "420px",
          width: "calc(100% - 10px)",
          borderRadius: "20px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          textAlign: "center",
          padding: "100px 20px",
          position: "relative",
          boxShadow: "0 6px 20px rgba(0,0,0,0.15)",
        }}
      >
        <div
          className="cta__content-three"
          style={{
            zIndex: 2,
            maxWidth: "100%",
            width: "100%",
            display: "flex",
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "24px",
          }}
        >
          <h2
            className="title"
            style={{
              color: "#5dba47",
              fontSize: "2rem",
              margin: 0,
              fontWeight: 500,
              lineHeight: "1.2",
              textShadow: "0 2px 12px rgba(13,68,122,0.18)",
              background: "rgba(13,68,122,0.7)",
              borderRadius: "12px",
              padding: "12px 18px",
              maxWidth: "90vw",
              boxSizing: "border-box",
              textAlign: "left",
              position: "relative",
              zIndex: 2,
            }}
          >
            Finding Your Right Courses
          </h2>

          <Link
            href="/courses"
            className="hero-cta"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "12px",
              background: "#5dba47",
              color: "#fff",
              borderRadius: "10px",
              padding: "7px 14px",
              fontWeight: 600,
              fontSize: "20px",
              textDecoration: "none",
              transition: "all 0.3s ease",
              width: "fit-content",
              boxShadow: "0 4px 15px rgba(93, 186, 71, 0.3)",
              border: "none",
              position: "relative",
              overflow: "hidden",
              flexShrink: 0,
              marginLeft: "auto",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#4a9c38";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(-2px)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 8px 25px rgba(93, 186, 71, 0.4)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLAnchorElement).style.background = "#5dba47";
              (e.currentTarget as HTMLAnchorElement).style.transform = "translateY(0)";
              (e.currentTarget as HTMLAnchorElement).style.boxShadow =
                "0 4px 15px rgba(93, 186, 71, 0.3)";
            }}
          >
            <span
              className="btn-shine"
              style={{
                position: "absolute",
                top: "0",
                left: "-100%",
                width: "100%",
                height: "100%",
                background:
                  "linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)",
                transition: "left 0.5s ease",
                zIndex: 1,
              }}
            />
            <span
              className="btn-text"
              style={{
                position: "relative",
                zIndex: 2,
              }}
            >
              Get Started
            </span>
            <span
              className="btn-arrow"
              style={{
                position: "relative",
                zIndex: 2,
                fontSize: "14px",
                transition: "transform 0.3s ease",
                background: "rgba(255,255,255,0.2)",
                width: "24px",
                height: "24px",
                borderRadius: "50%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              &rarr;
            </span>
          </Link>
        </div>
      </div>

      {/* Single styled-jsx block (no nesting) */}
      <style jsx>{`
        .hero-cta:hover .btn-shine {
          left: 100%;
        }

        .hero-cta:hover .btn-arrow {
          transform: translateX(3px);
          background: rgba(255, 255, 255, 0.3);
        }

        @media (min-width: 901px) {
          .cta__content-three {
            flex-direction: row !important;
            align-items: center !important;
            justify-content: flex-start !important;
            gap: 24px !important;
          }
          .hero-cta {
            margin-left: 32px !important;
          }
        }

        @media (max-width: 900px) {
          .cta__content-three {
            flex-direction: column !important;
            align-items: center !important;
            justify-content: center !important;
            gap: 18px !important;
          }
          .title {
            text-align: center !important;
            margin: 0 auto !important;
            background: rgba(13, 68, 122, 0.85) !important;
            position: static !important;
            z-index: 2 !important;
            width: 100% !important;
            max-width: 100vw !important;
            padding: 20px 8px !important;
          }
          .hero-cta {
            margin-left: 0 !important;
            margin-right: 0 !important;
          }
        }

        @media (max-width: 600px) {
          .cta__bg-three {
            min-height: 260px;
            padding: 40px 8px;
          }
          .cta__content-three {
            gap: 18px;
          }
          .title {
            font-size: 1.1rem !important;
            padding: 10px 4px !important;
            background: rgba(13, 68, 122, 0.95) !important;
            max-width: 100vw !important;
            text-align: center !important;
            margin: 0 auto !important;
            position: static !important;
            z-index: 2 !important;
            width: 100% !important;
            margin-top: 60px !important; /* move text down */
          }
          .hero-cta {
            font-size: 1rem;
            padding: 10px 18px;
            margin: 32px auto 0 auto !important; /* move button further down */
            display: block;
          }
        }
      `}</style>
    </section>
  );
};

export default Cta;
