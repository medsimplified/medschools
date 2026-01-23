"use client";
import DashboardBannerTwo from "@/dashboard/dashboard-common/DashboardBannerTwo";
import DashboardSidebarTwo from "@/dashboard/dashboard-common/DashboardSidebarTwo";
import PricingPlans from "./student-dashboard/PricingPlans";
import Image from "next/image";
import bg_img from "@/assets/img/bg/dashboard_bg.jpg";

const StudentPricingDashboard = () => {
  return (
    <section className="dashboard__area section-pb-120">
      <div className="dashboard__bg">
        <Image src={bg_img} alt="" />
      </div>
      <div className="container">
        <DashboardBannerTwo />
        <div className="dashboard__inner-wrap">
          <div className="row">
            <DashboardSidebarTwo />
            <div className="col-lg-9">
              <div className="dashboard__content-wrap">
                <div className="dashboard__content-title">
                  <h4 className="title">Choose Your Plan</h4>
                </div>
                <PricingPlans />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentPricingDashboard;
