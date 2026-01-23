import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar"
import DashboardBanner from "../../dashboard-common/DashboardBanner"
import DashboardCounter from "./DashboardCounter"
import DashboardReviewTable from "./DashboardReviewTable"
import Link from "next/link"
import BtnArrow from "@/svg/BtnArrow"
import Image from "next/image"
import DashboardCourse from "@/dashboard/dashboard-common/DashboardCourse"

import bg_img from "@/assets/img/bg/dashboard_bg.jpg"

const DashboardHomeArea = () => {
   return (
      <section className="dashboard__area section-pb-120" style={{paddingTop: "20px", paddingBottom: "48px"}}>
         <div className="dashboard__bg">
            {/* <Image src={bg_img} alt=""/> */}
            </div>
         <div className="container" style={{paddingTop: "0px"}}>
            <DashboardBanner />
            <div className="dashboard__inner-wrap" style={{marginTop: "32px"}}>
               <div className="row">
                  <DashboardSidebar />
                  <div className="col-lg-9">
                     <div className="dashboard__count-wrap" style={{marginTop: "24px"}}>
                        <div className="dashboard__content-title" style={{marginBottom: "24px"}}>
                           <h4 className="title">Dashboard</h4>
                        </div>
                        <div className="row">
                           <DashboardCounter />
                        </div>
                     </div>
                     {/* <div className="dashboard__content-wrap">
                        <div className="dashboard__content-title">
                           <h4 className="title">My Courses</h4>
                        </div>
                        <div className="row">
                           <div className="col-12">
                              <div className="dashboard__review-table">
                                 <DashboardReviewTable />
                              </div>
                           </div>
                        </div>
                        <div className="load-more-btn text-center mt-20">
                           <Link href="#" className="link-btn">Browse All Course <BtnArrow /></Link>
                        </div>
                     </div> */}
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default DashboardHomeArea
