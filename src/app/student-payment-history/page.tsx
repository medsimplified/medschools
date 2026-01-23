"use client";
import { useEffect, useState } from "react";
import DashboardBannerTwo from "@/dashboard/dashboard-common/DashboardBannerTwo";
import DashboardSidebarTwo from "@/dashboard/dashboard-common/DashboardSidebarTwo";
import AuthGuard from "@/components/common/AuthGuard";

const PaymentHistory = () => {
  const [payments, setPayments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [subscription, setSubscription] = useState<any>(null);

  useEffect(() => {
    fetchPaymentHistory();
  }, []);

  const fetchPaymentHistory = async () => {
    try {
      const res = await fetch("/api/student/payment-history");
      const data = await res.json();
      setPayments(data.payments || []);
      setSubscription(data.subscription);
    } catch (err) {
      console.error("Failed to fetch payment history", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatAmount = (amount: number) => {
    return `$${(amount / 100).toFixed(2)}`;
  };

  return (
    <AuthGuard>
      <section className="dashboard__area section-pb-120">
        <div className="dashboard__bg"></div>
        <div className="container">
          <DashboardBannerTwo />
          <div className="dashboard__inner-wrap">
            <div className="row">
              <DashboardSidebarTwo />
              
              <div className="col-lg-9">
                <div className="dashboard__content-title" style={{ marginBottom: 24 }}>
                  <h4 className="title" style={{ fontWeight: 900, fontSize: 28, color: '#222', letterSpacing: 1 }}>
                    Payment History
                  </h4>
                </div>

                {/* Current Subscription Status */}
                {subscription && (
                  <div style={{
                    background: subscription.hasActiveSubscription 
                      ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                      : '#f3f4f6',
                    borderRadius: 18,
                    padding: 32,
                    marginBottom: 32,
                    color: subscription.hasActiveSubscription ? '#fff' : '#222',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.1)'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <h5 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8, color: subscription.hasActiveSubscription ? '#fff' : '#222' }}>
                          Current Subscription
                        </h5>
                        <p style={{ fontSize: 16, marginBottom: 4, opacity: 0.9 }}>
                          Plan: <strong>{subscription.subscriptionPlan || 'None'}</strong>
                        </p>
                        <p style={{ fontSize: 14, opacity: 0.8, marginBottom: 0 }}>
                          {subscription.hasActiveSubscription 
                            ? `Active until ${formatDate(subscription.subscriptionEnd)}`
                            : 'No active subscription'
                          }
                        </p>
                      </div>
                      <div style={{
                        background: subscription.hasActiveSubscription ? 'rgba(255,255,255,0.2)' : '#e5e7eb',
                        borderRadius: 12,
                        padding: '12px 24px',
                        fontWeight: 700,
                        fontSize: 14,
                        color: subscription.hasActiveSubscription ? '#fff' : '#222'
                      }}>
                        {subscription.hasActiveSubscription ? '✓ ACTIVE' : 'INACTIVE'}
                      </div>
                    </div>
                  </div>
                )}

                {/* Payment History Table */}
                <div style={{
                  background: '#fff',
                  borderRadius: 18,
                  boxShadow: '0 4px 24px #e3e6ed44',
                  overflow: 'hidden',
                  border: '1.5px solid #e3e6ed'
                }}>
                  <div style={{ padding: '20px 24px', borderBottom: '1.5px solid #e3e6ed' }}>
                    <h5 style={{ fontSize: 18, fontWeight: 700, margin: 0, color: '#222' }}>
                      Transaction History
                    </h5>
                  </div>

                  {loading ? (
                    <div style={{ padding: 60, textAlign: 'center', color: '#888' }}>
                      Loading payment history...
                    </div>
                  ) : payments.length === 0 ? (
                    <div style={{ padding: 60, textAlign: 'center' }}>
                      <div style={{ fontSize: 48, marginBottom: 16 }}>💳</div>
                      <p style={{ fontSize: 18, color: '#888', fontWeight: 600, marginBottom: 16 }}>
                        No payment history yet
                      </p>
                      <a 
                        href="/pricing" 
                        style={{
                          display: 'inline-block',
                          background: 'linear-gradient(90deg,#5624d0 60%,#f7b32b 100%)',
                          color: '#fff',
                          padding: '12px 28px',
                          borderRadius: 10,
                          fontWeight: 700,
                          textDecoration: 'none',
                          fontSize: 15
                        }}
                      >
                        Subscribe Now
                      </a>
                    </div>
                  ) : (
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                      <thead style={{ background: 'linear-gradient(90deg,#f7b32b 0%,#5624d0 100%)' }}>
                        <tr>
                          <th style={{ padding: '16px 20px', textAlign: 'left', color: '#000', fontWeight: 800, fontSize: 15, border: 'none' }}>
                            Date
                          </th>
                          <th style={{ padding: '16px 20px', textAlign: 'left', color: '#000', fontWeight: 800, fontSize: 15, border: 'none' }}>
                            Description
                          </th>
                          <th style={{ padding: '16px 20px', textAlign: 'left', color: '#000', fontWeight: 800, fontSize: 15, border: 'none' }}>
                            Amount
                          </th>
                          <th style={{ padding: '16px 20px', textAlign: 'left', color: '#000', fontWeight: 800, fontSize: 15, border: 'none' }}>
                            Status
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {payments.map((payment, idx) => (
                          <tr 
                            key={payment.id}
                            style={{ 
                              background: idx % 2 === 0 ? '#f7f8fa' : '#fff',
                              borderBottom: '1px solid #e3e6ed'
                            }}
                          >
                            <td style={{ padding: '14px 20px', fontSize: 14, color: '#666', border: 'none' }}>
                              {formatDate(payment.createdAt)}
                            </td>
                            <td style={{ padding: '14px 20px', fontSize: 15, fontWeight: 600, color: '#222', border: 'none' }}>
                              Subscription Payment
                            </td>
                            <td style={{ padding: '14px 20px', fontSize: 16, fontWeight: 700, color: '#5624d0', border: 'none' }}>
                              {formatAmount(payment.amount)}
                            </td>
                            <td style={{ padding: '14px 20px', border: 'none' }}>
                              <span style={{
                                background: payment.status === 'COMPLETED' ? '#d1fae5' : '#fee2e2',
                                color: payment.status === 'COMPLETED' ? '#065f46' : '#991b1b',
                                padding: '4px 12px',
                                borderRadius: 6,
                                fontSize: 13,
                                fontWeight: 700,
                                textTransform: 'uppercase'
                              }}>
                                {payment.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </AuthGuard>
  );
};

export default PaymentHistory;
