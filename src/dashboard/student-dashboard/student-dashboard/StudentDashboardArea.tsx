"use client";
import { useSession } from "next-auth/react";
import DashboardSidebarTwo from "@/dashboard/dashboard-common/DashboardSidebarTwo"
import PricingPlans from "./PricingPlans"
import UnlockedContent from "./UnlockedContent"
import Image from "next/image"
import bg_img from "@/assets/img/bg/dashboard_bg.jpg"

const StudentDashboardArea = () => {
   const { data: session } = useSession();
   const user = session?.user as any;
   const hasActiveSubscription = user?.hasActiveSubscription;

   return (
      <section className="dashboard__area section-pb-120" style={{ paddingTop: "180px", paddingBottom: "48px" }}>
         <div style={{ 
            marginTop: "40px", 
            marginLeft: "20px", 
            marginRight: "20px",
            borderRadius: "10px",
            overflow: "hidden",
            marginBottom: "60px",
            position: "relative"
         }}>
            <Image src={bg_img} alt="" style={{ borderRadius: "10px", width: "100%", height: "auto" }}/>
         </div>
         <div className="container">
            <div className="dashboard__inner-wrap">
               <div className="row">
                  <DashboardSidebarTwo />
                  <div className="col-lg-9">
                     <div className="dashboard__count-wrap" style={{ marginTop: "24px" }}>
                        <div className="dashboard__content-title" style={{ marginBottom: "24px" }}>
                           <h4 className="title">Dashboard</h4>
                        </div>
                        <div className="row">
                           <div className="col-lg-4 col-md-4 col-sm-6">
                              <div className="dashboard__counter-item">
                                 <div className="icon">
                                    <i className="skillgro-book"></i>
                                 </div>
                                 <div className="content">
                                    <span className="count">{hasActiveSubscription ? '150+' : '0'}</span>
                                    <p>Learning Materials</p>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-4 col-sm-6">
                              <div className="dashboard__counter-item">
                                 <div className="icon">
                                    <i className="skillgro-video-tutorial"></i>
                                 </div>
                                 <div className="content">
                                    <span className="count">{hasActiveSubscription ? '200+' : '0'}</span>
                                    <p>Video Lectures</p>
                                 </div>
                              </div>
                           </div>
                           <div className="col-lg-4 col-md-4 col-sm-6">
                              <div className="dashboard__counter-item">
                                 <div className="icon">
                                    <i className="skillgro-tutorial"></i>
                                 </div>
                                 <div className="content">
                                    <span className="count">{hasActiveSubscription ? '500+' : '0'}</span>
                                    <p>MCQ Questions</p>
                                 </div>
                              </div>
                           </div>
                        </div>
                     </div>

                     {/* Show pricing if no active subscription, otherwise show unlocked content */}
                     {!hasActiveSubscription ? (
                        <div className="dashboard__content-wrap">
                           <div className="dashboard__content-title">
                              <h4 className="title">Choose Your Plan</h4>
                           </div>
                           <PricingPlans />
                        </div>
                     ) : (
                        <UnlockedContent />
                     )}
                  </div>
               </div>
            </div>
         </div>
      </section>
   )
}

export default StudentDashboardArea
