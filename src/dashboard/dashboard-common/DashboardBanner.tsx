"use client";

import BtnArrow from "@/svg/BtnArrow"
import Image from "next/image"
import Link from "next/link"
import { FaStar } from "@/lib/fontAwesomeIconsComplete"
import { useSession } from "next-auth/react"
import { useEffect, useState } from "react"

import avatar from "@/assets/img/courses/details_instructors01.jpg"
import avatar_2 from "@/assets/img/courses/details_instructors02.jpg"

const DashboardBanner = ({ style }: any) => {
   const { data: session } = useSession();
   const [userName, setUserName] = useState("");

   useEffect(() => {
      if (session?.user) {
         const user: any = session.user;
         const fname = user['fname'];
         const lname = user['lname'];
         const name = user.name || 
                      (fname && lname ? `${fname} ${lname}` : fname || user.email || "User");
         setUserName(name);
      }
   }, [session]);

   return (
      <div className="dashboard__top-wrap" style={{marginTop:"200px"}}>
         <div
            className="dashboard__top-bg"
            style={{
               backgroundImage: `url(/assets/img/bg/instructor_dashboard_bg.png)`,
               backgroundPosition: "center",
               backgroundRepeat: "no-repeat",
               backgroundSize: "cover",
               marginTop: "0px"
            }}
         ></div>
         <div className="dashboard__instructor-info">
            <div className="dashboard__instructor-info-left">
               <div className="thumb">
                  <Image 
                     src={session?.user?.image || (style ? avatar_2 : avatar)} 
                     alt={userName || "User"} 
                     width={80}
                     height={80}
                  />
               </div>
               <div className="content">
                  <h4 className="title">{userName || "Loading..."}</h4>
                  <div className="review__wrap review__wrap-two">
                     <div className="rating">
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                        <FaStar />
                     </div>
                     <span>(15 Reviews)</span>
                  </div>
               </div>
            </div>
            {/* <div className="dashboard__instructor-info-right">
               <Link href="#" className="btn btn-two arrow-btn">Create a New Course <BtnArrow /></Link>
            </div> */}
         </div>
      </div>
   )
}

export default DashboardBanner
