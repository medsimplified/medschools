"use client";

import Link from "next/link";
import React from "react";
import { usePathname } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

// ============================================================================
// TYPES
// ============================================================================

interface SidebarItem {
  id: number;
  link: string;
  icon: string;
  title: string;
}

interface SidebarGroup {
  id: number;
  title: string;
  class_name?: string;
  sidebar_details: SidebarItem[];
}

// ============================================================================
// FULL SIDEBAR (ADMIN / INSTRUCTOR)
// ============================================================================

const FULL_SIDEBAR: SidebarGroup[] = [
  {
    id: 1,
    title: "Welcome, admin",
    sidebar_details: [
      { id: 1, link: "/instructor-dashboard", icon: "skillgro-dashboard", title: "Dashboard" },
      { id: 6, link: "/instructor-banner-videos", icon: "skillgro-video-tutorial", title: "Add Banner Videos (homepage)" },
      { id: 7, link: "/instructor-upload-course", icon: "skillgro-closed-book", title: "Upload Main Course (in courses page)" },
      { id: 5, link: "/instructor-course-pages", icon: "skillgro-diploma", title: "Add New Curriculum (curriculum will be attached to courses in course page)" },
      { id: 9, link: "/manage-homepage-courses", icon: "skillgro-mortarboard", title: "Homepage Courses (Homepage Explore medical Subjects)" },
      { id: 10, link: "/instructor-testimonials", icon: "skillgro-review", title: "Testimonials" },
      { id: 12, link: "/instructor-pricing-plans", icon: "skillgro-dollar-currency-symbol", title: "Subscription Pricing" },
      { id: 11, link: "/instructor-course-uploaders", icon: "skillgro-instructor", title: "Course Uploaders" },
      { id: 4, link: "/instructor-student", icon: "skillgro-users", title: "Students" },
      { id: 8, link: "/instructor-blogs", icon: "skillgro-writing", title: "Blogs" },
      { id: 2, link: "/instructor-profile", icon: "skillgro-avatar", title: "My Profile" },
    ],
  },
  {
    id: 2,
    title: "User",
    class_name: "mt-30",
    sidebar_details: [
      { id: 1, link: "/instructor-setting", icon: "skillgro-gear", title: "Settings" },
      { id: 2, link: "/instructor-payment-settings", icon: "skillgro-dollar-currency-symbol", title: "Payment Settings" },
      { id: 3, link: "/logout", icon: "skillgro-logout", title: "Logout" },
    ],
  },
];

// ============================================================================
// UPLOADER-ONLY SIDEBAR
// ============================================================================

const UPLOADER_SIDEBAR: SidebarItem[] = [
  { id: 1, link: "/instructor-upload-course", icon: "skillgro-closed-book", title: "Upload Main Course" },
  { id: 2, link: "/instructor-course-pages", icon: "skillgro-diploma", title: "Add New Course" },
  { id: 3, link: "/instructor-setting", icon: "skillgro-gear", title: "Settings" },
  { id: 4, link: "/logout", icon: "skillgro-logout", title: "Logout" },
];

// ============================================================================
// COMPONENT
// ============================================================================

const DashboardSidebar = () => {
  const pathname = usePathname();
  const { data: session } = useSession();

  const role = session?.user?.role;

  // Only show restricted sidebar for course uploaders
  if (role === "course_uploader") {
    return (
      <div className="col-lg-3">
        <div className="dashboard__sidebar-wrap">
          <div className="dashboard__sidebar-title mb-20 mt-30">
            <h6 className="title">User</h6>
          </div>
          <nav className="dashboard__sidebar-menu">
            <ul className="list-wrap">
              {UPLOADER_SIDEBAR.map((item) => (
                <li
                  key={item.id}
                  className={pathname === item.link ? "active" : ""}
                >
                  {item.link === "/logout" ? (
                    <a
                      href="#"
                      onClick={(e) => {
                        e.preventDefault();
                        signOut({ callbackUrl: "/login" });
                      }}
                    >
                      <i className={item.icon}></i>
                      {item.title}
                    </a>
                  ) : (
                    <Link href={item.link}>
                      <i className={item.icon}></i>
                      {item.title}
                    </Link>
                  )}
                </li>
              ))}
            </ul>
          </nav>
        </div>
      </div>
    );
  }

  // ========================================================================
  // FULL SIDEBAR (ADMIN / INSTRUCTOR)
  // ========================================================================
  return (
    <div className="col-lg-3">
      <div className="dashboard__sidebar-wrap">
        {FULL_SIDEBAR.map((group) => (
          <React.Fragment key={group.id}>
            <div className={`dashboard__sidebar-title mb-20 ${group.class_name || ""}`}>
              <h6 className="title">{group.title}</h6>
            </div>

            <nav className="dashboard__sidebar-menu">
              <ul className="list-wrap">
                {group.sidebar_details.map((item) => (
                  <li
                    key={item.id}
                    className={pathname === item.link ? "active" : ""}
                  >
                    {item.link === "/logout" ? (
                      <a
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          signOut({ callbackUrl: "/login" });
                        }}
                      >
                        <i className={item.icon}></i>
                        {item.title}
                      </a>
                    ) : (
                      <Link href={item.link}>
                        <i className={item.icon}></i>
                        {item.title}
                      </Link>
                    )}
                  </li>
                ))}
              </ul>
            </nav>
          </React.Fragment>
        ))}
      </div>
    </div>
  );
};

export default DashboardSidebar;
