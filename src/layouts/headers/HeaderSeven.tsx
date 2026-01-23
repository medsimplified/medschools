"use client";
import Image from "next/image";
import Link from "next/link";
import NavMenuOne from "./menu/NavMenu";
import InjectableSvg from "@/hooks/InjectableSvg";
import UseSticky from "@/hooks/UseSticky";
import { useState, useEffect } from "react";
import MobileSidebar from "./menu/MobileSidebar";
import { useRouter } from "next/navigation";
import { FaBars } from "@/lib/fontAwesomeIconsComplete";

import logo from "@/assets/img/logo/MSS Logo-V1-02.png";

const HeaderSeven = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const { sticky } = UseSticky();
  const [isActive, setIsActive] = useState<boolean>(false);
  const router = useRouter();
  const [courses, setCourses] = useState<{ id: string; title: string }[]>([]);

  useEffect(() => {
    // Fetch all courses for search (adjust API endpoint as needed)
    fetch("/api/courses")
      .then((res) => res.json())
      .then((data) => setCourses(data || []))
      .catch(() => setCourses([]));
  }, []);

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && searchTerm.trim()) {
      const term = searchTerm.trim().toLowerCase();
      const found = courses.find((c) => c.title.toLowerCase().includes(term));
      if (found) {
        // Encode title for URL, replace spaces with hyphens
        const urlTitle = encodeURIComponent(found.title.replace(/\s+/g, "-"));
        router.push(`/course-details/${urlTitle}`);
      } else {
        alert("Course not found.");
      }
    }
  };

  return (
    <>
      <header>
        <div id="header-fixed-height"></div>
        <div
          id="sticky-header"
          className={`tg-header__area tg-header__style-seven ${sticky ? "sticky-menu" : ""}`}
          style={{
            backgroundColor: "#ffffff !important",
            boxShadow: sticky ? "0 2px 12px rgba(0,0,0,0.08)" : undefined,
            transition: "background 0.2s, box-shadow 0.2s",
            position: sticky ? "fixed" : undefined,
            top: sticky ? 0 : undefined,
            left: sticky ? 0 : undefined,
            width: sticky ? "100%" : undefined,
            zIndex: sticky ? 999 : undefined,
          }}
        >
          <div className="container custom-container">
            <div className="row">
              <div className="col-12">
                <div className="tgmenu__wrap" style={{ padding: "0" }}>
                  <nav className="tgmenu__nav">
                    <div className="logo">
                      <Link href="/">
                        <Image
                          src={logo}
                          alt="Logo"
                          width={120}
                          height={60}
                          style={{ display: "block" }}
                          priority
                        />
                      </Link>
                    </div>
                    <div className="tgmenu__navbar-wrap tgmenu__main-menu d-none d-xl-flex">
                      <div style={{ color: "#000000", fontWeight: "600" }}>
                        <NavMenuOne />
                      </div>
                    </div>
                    <div className="tgmenu__action tgmenu__action-seven">
                      <ul className="list-wrap">
                        <li className="header-search">
                          <input
                            type="text"
                            placeholder="Search..."
                            value={searchTerm}
                            onChange={handleSearch}
                            onKeyDown={handleSearchKeyDown}
                            style={{
                              padding: "6px 12px",
                              border: "1px solid #d1d5db",
                              borderRadius: "20px",
                              marginRight: "10px",
                              color: "#374151",
                            }}
                          />
                        </li>
                        <li>
                          <Link href="/login" className="btn header-cta">
                            <span className="btn-text">Register Now</span>
                            <span className="btn-arrow">→</span>
                          </Link>
                        </li>
                      </ul>
                    </div>
                    <div className="mobile-login-btn">
                      <Link href="/login">
                        <InjectableSvg
                          src="/assets/img/icons/user.svg"
                          alt=""
                          className="injectable"
                        />
                      </Link>
                    </div>
                    <div
                      onClick={() => setIsActive(true)}
                      className="mobile-nav-toggler"
                    >
                      <FaBars />
                    </div>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>
      <MobileSidebar isActive={isActive} setIsActive={setIsActive} />

      <style jsx global>{`
        .tg-header__area .tgmenu__navbar-wrap ul li a,
        .header .tgmenu__navbar-wrap ul li a,
        .site-header .tgmenu__navbar-wrap ul li a,
        .tgmenu__navbar-wrap .navbar-nav .nav-link,
        .tgmenu__main-menu a {
          color: #000000 !important;
          font-weight: 600 !important;
        }

        .tgmenu__navbar-wrap ul li a:hover,
        .tgmenu__navbar-wrap .navbar-nav .nav-link:hover,
        .tgmenu__main-menu a:hover {
          color: #0d447a !important;
        }

        .header-cta {
          display: inline-flex;
          align-items: center;
          gap: 12px;
          background: #5dba47 !important;
          color: #fff !important;
          border-radius: 10px;
          padding: 7px 14px !important;
          font-weight: 600;
          font-size: 16px;
          text-decoration: none;
          box-shadow: 0 8px 24px rgba(93, 186, 71, 0.4);
          border: none;
          position: relative;
          overflow: hidden;
        }

        .header-cta .btn-text {
          position: relative;
          z-index: 2;
          color: #fff !important;
        }

        .header-cta .btn-arrow {
          position: relative;
          z-index: 2;
          font-size: 14px;
          background: rgba(248, 248, 248, 0.2) !important;
          width: 28px;
          height: 28px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff !important;
          font-weight: 600;
          box-shadow: 0 2px 8px rgba(0,0,0,0.15);
        }

      `}</style>
    </>
  );
};

export default HeaderSeven;