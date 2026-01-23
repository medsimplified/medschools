"use client"
import Link from "next/link";
import React from "react";
import { usePathname } from 'next/navigation';
import { signOut } from "next-auth/react";

interface DataType {
   id: number;
   title: string;
   class_name?: string;
   sidebar_details: {
      id: number;
      link: string;
      icon: string;
      title: string;
   }[];
}[];

const sidebar_data: DataType[] = [
   {
      id: 1,
      title: "Welcome, Student",
      sidebar_details: [
         {
            id: 1,
            link: "/student-dashboard",
            icon: "skillgro-dashboard",
            title: "Dashboard",
         },
         {
            id: 2,
            link: "/student-dashboard/subscription",
            icon: "skillgro-subscription",
            title: "Active Subscriptions",
         },
         {
            id: 3,
            link: "/student-dashboard/materials",
            icon: "skillgro-book",
            title: "Materials",
         },
         {
            id: 4,
            link: "/student-profile",
            icon: "skillgro-avatar",
            title: "Profile",
         },
         {
            id: 5,
            link: "/student-setting",
            icon: "skillgro-gear",
            title: "Settings",
         },
      ],
   },
   {
      id: 2,
      title: "User",
      class_name: "mt-30",
      sidebar_details: [
         {
            id: 1,
            link: "/logout",
            icon: "skillgro-logout",
            title: "Logout",
         },
      ],
   },
];

const DashboardSidebarTwo = () => {

   const pathname = usePathname();

   return (
      <div className="col-lg-3">
         <div className="dashboard__sidebar-wrap">
            {sidebar_data.map((item) => (
               <React.Fragment key={item.id}>
                  <div className={`dashboard__sidebar-title mb-20 ${item.class_name}`}>
                     <h6 className="title">{item.title}</h6>
                  </div>
                  <nav className="dashboard__sidebar-menu">
                     <ul className="list-wrap">
                        {item.sidebar_details.map((list) => (
                           <li key={list.id} className={pathname === list.link ? 'active' : ''}>
                              {list.link === "/logout" ? (
                                 <a
                                    href="#"
                                    onClick={(e) => {
                                       e.preventDefault();
                                       signOut({ callbackUrl: "/login" });
                                    }}
                                 >
                                    <i className={list.icon}></i>
                                    {list.title}
                                 </a>
                              ) : (
                                 <Link href={list.link}>
                                    <i className={list.icon}></i>
                                    {list.title}
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
   )
}

export default DashboardSidebarTwo
