"use client";
import { useSession } from "next-auth/react";
import DashboardBannerTwo from "@/dashboard/dashboard-common/DashboardBannerTwo";
import DashboardSidebarTwo from "@/dashboard/dashboard-common/DashboardSidebarTwo";
import UnlockedContent from "./student-dashboard/UnlockedContent";
import Image from "next/image";
import bg_img from "@/assets/img/bg/dashboard_bg.jpg";

const StudentMaterialsDashboard = () => {
  const { data: session } = useSession();
  const user = session?.user as any;
  const hasActiveSubscription = user?.hasActiveSubscription;

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
                <div className="dashboard__content-title mb-4">
                  <h4 className="title">Learning Materials</h4>
                </div>

                {hasActiveSubscription ? (
                  <UnlockedContent />
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: 60,
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: 12,
                    color: '#fff'
                  }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>🔒</div>
                    <h5 style={{ marginBottom: 12, color: '#fff' }}>Materials Locked</h5>
                    <p style={{ marginBottom: 24, opacity: 0.9 }}>
                      Subscribe to access all PDF materials, MCQs, and case studies
                    </p>
                    <a href="/student-dashboard" style={{
                      background: '#fff',
                      color: '#667eea',
                      padding: '12px 32px',
                      borderRadius: 8,
                      border: 'none',
                      fontWeight: 600,
                      textDecoration: 'none',
                      display: 'inline-block'
                    }}>
                      View Pricing Plans
                    </a>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default StudentMaterialsDashboard;
