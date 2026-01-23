"use client";
import { useMemo } from "react";
import { useSession } from "next-auth/react";
import DashboardBannerTwo from "@/dashboard/dashboard-common/DashboardBannerTwo";
import DashboardSidebarTwo from "@/dashboard/dashboard-common/DashboardSidebarTwo";
import Image from "next/image";
import bg_img from "@/assets/img/bg/dashboard_bg.jpg";
import { FaCrown } from "@/lib/fontAwesomeIconsComplete";
import { useSubscriptionPlans } from "@/hooks/useSubscriptionPlans";

const FALLBACK_FEATURES = [
  "Access to all video lectures",
  "Download PDF materials",
  "MCQ practice with explanations",
  "Case study materials",
  "Priority support",
];

const formatPlanLabel = (slug?: string | null) => {
  if (!slug) {
    return "Subscription";
  }

  return slug
    .split(/[-_]/)
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
};

const StudentSubscriptionDashboard = () => {
  const { data: session } = useSession();
  const user = session?.user as any;
  const { plans, loading: plansLoading } = useSubscriptionPlans();

  const activePlan = useMemo(() => {
    if (!user?.subscriptionPlan) {
      return undefined;
    }
    return plans.find((plan) => plan.slug === user.subscriptionPlan);
  }, [plans, user?.subscriptionPlan]);

  const planTitle = activePlan?.title || formatPlanLabel(user?.subscriptionPlan);
  const planDurationLabel = activePlan?.durationLabel || "Ongoing Subscription";
  const planFeatures = activePlan?.features?.length ? activePlan.features : FALLBACK_FEATURES;

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
                  <h4 className="title">Active Subscriptions</h4>
                </div>

                {user?.hasActiveSubscription ? (
                  <div className="card" style={{ borderRadius: 12, border: '2px solid #e3e6ed' }}>
                    <div className="card-body p-4">
                      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24 }}>
                        <div style={{
                          width: 60,
                          height: 60,
                          borderRadius: 12,
                          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          marginRight: 16
                        }}>
                          <FaCrown aria-hidden style={{ fontSize: 24, color: '#fff' }} />
                        </div>
                        <div>
                          <h5 style={{ marginBottom: 4, fontWeight: 700 }}>
                            {planTitle}
                          </h5>
                          <p className="text-muted mb-0">
                            Status: <span style={{ color: '#5dba47', fontWeight: 600 }}>Active</span>
                          </p>
                        </div>
                      </div>

                      <div style={{ borderTop: '1px solid #e3e6ed', paddingTop: 20 }}>
                        <div className="row">
                          <div className="col-md-6 mb-3">
                            <p className="text-muted mb-1" style={{ fontSize: 13 }}>Plan Type</p>
                            <p style={{ fontWeight: 600 }}>{planDurationLabel}</p>
                          </div>
                          <div className="col-md-6 mb-3">
                            <p className="text-muted mb-1" style={{ fontSize: 13 }}>Renewal Date</p>
                            <p style={{ fontWeight: 600 }}>
                              {user?.subscriptionEnd ? new Date(user.subscriptionEnd).toLocaleDateString() : 'N/A'}
                            </p>
                          </div>
                        </div>

                        <div style={{ 
                          background: '#f7f8fa', 
                          padding: 16, 
                          borderRadius: 8,
                          marginTop: 16
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
                            <h6 style={{ fontSize: 14, fontWeight: 700, marginBottom: 0 }}>Your Benefits:</h6>
                            {plansLoading && (
                              <span className="text-muted" style={{ fontSize: 12 }}>Refreshing plan details...</span>
                            )}
                          </div>
                          <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
                            {planFeatures.map((feature) => (
                              <li key={feature} style={{ marginBottom: 8 }}>✅ {feature}</li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div style={{
                    textAlign: 'center',
                    padding: 60,
                    background: '#f7f8fa',
                    borderRadius: 12
                  }}>
                    <div style={{ fontSize: 64, marginBottom: 16 }}>📋</div>
                    <h5 style={{ marginBottom: 12 }}>No Active Subscription</h5>
                    <p className="text-muted mb-4">Subscribe to access all premium content and materials</p>
                    <a href="/student-dashboard" className="btn" style={{
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      color: '#fff',
                      padding: '12px 32px',
                      borderRadius: 8,
                      border: 'none',
                      fontWeight: 600
                    }}>
                      View Plans
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

export default StudentSubscriptionDashboard;
