"use client";
import { useEffect, useState } from "react";
import DashboardSidebar from "@/dashboard/dashboard-common/DashboardSidebar";
import AuthGuard from "@/components/common/AuthGuard";

const PaymentSettings = () => {
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });
  
  const [config, setConfig] = useState({
    razorpayKeyId: "",
    razorpayKeySecret: "",
    razorpayWebhookSecret: "",
  });

  // Fetch existing configuration
  useEffect(() => {
    const fetchConfig = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/razorpay-config");
        const data = await res.json();
        if (data) {
          setConfig({
            razorpayKeyId: data.razorpayKeyId || "",
            razorpayKeySecret: data.razorpayKeySecret || "",
            razorpayWebhookSecret: data.razorpayWebhookSecret || "",
          });
        }
      } catch (err) {
        console.error("Failed to fetch Razorpay config", err);
      } finally {
        setLoading(false);
      }
    };
    fetchConfig();
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMessage({ type: "", text: "" });

    try {
      const res = await fetch("/api/admin/razorpay-config", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(config),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage({ type: "success", text: "Razorpay configuration saved successfully!" });
      } else {
        setMessage({ type: "error", text: data.error || "Failed to save configuration" });
      }
    } catch (err) {
      setMessage({ type: "error", text: "An error occurred while saving" });
    } finally {
      setSaving(false);
    }
  };

  return (
    <section className="dashboard__area section-pb-120" style={{ background: 'linear-gradient(120deg,#f7f8fa 0%,#e3e6ed 100%)', minHeight: '100vh' }}>
      <div
        className="dashboard__top-wrap mt-120"
        style={{
          width: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          marginBottom: "48px",
          marginTop: "48px",
        }}
      >
        <div
          className="dashboard__top-bg"
          style={{
            backgroundImage: `url(/assets/img/bg/instructor_dashboard_bg.png)`,
            backgroundPosition: "center top",
            backgroundRepeat: "no-repeat",
            backgroundSize: "cover",
            width: "100%",
            maxWidth: "1400px",
            height: "260px",
            borderRadius: "18px",
            boxShadow: "0 4px 24px rgba(13,68,122,0.08)",
            marginTop: "60px",
          }}
        ></div>
      </div>
      
      <div className="container">
        <div className="dashboard__inner-wrap row">
          <DashboardSidebar />
          
          <div className="col-lg-9">
            <div className="dashboard__content-wrap">
              <div className="dashboard__content-title" style={{ marginBottom: 24 }}>
                <h4 className="title" style={{ fontWeight: 900, fontSize: 28, color: '#222', letterSpacing: 1 }}>
                  Payment Gateway Settings
                </h4>
                <p style={{ color: '#666', marginTop: 8 }}>Configure your Razorpay payment gateway to accept payments from students</p>
              </div>

              {loading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>Loading...</div>
              ) : (
                <form onSubmit={handleSave}>
                  <div style={{ background: '#fff', borderRadius: 18, boxShadow: '0 4px 24px #e3e6ed44', padding: 32, border: '1.5px solid #e3e6ed' }}>
                    
                    {/* Razorpay Key ID */}
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: 16, color: '#222', marginBottom: 8 }}>
                        Razorpay Key ID <span style={{ color: '#5624d0' }}>*</span>
                      </label>
                      <input
                        type="text"
                        value={config.razorpayKeyId}
                        onChange={(e) => setConfig({ ...config, razorpayKeyId: e.target.value })}
                        placeholder="rzp_test_..."
                        required
                        style={{
                          width: '100%',
                          border: '1.5px solid #d1d5db',
                          borderRadius: 12,
                          padding: '12px 18px',
                          fontSize: 16,
                          background: '#fff',
                          outline: 'none',
                        }}
                      />
                      <small style={{ color: '#888', fontSize: 14, marginTop: 4, display: 'block' }}>
                        Your Razorpay Key ID (starts with rzp_test_ or rzp_live_)
                      </small>
                    </div>

                    {/* Razorpay Key Secret */}
                    <div style={{ marginBottom: 24 }}>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: 16, color: '#222', marginBottom: 8 }}>
                        Razorpay Key Secret <span style={{ color: '#5624d0' }}>*</span>
                      </label>
                      <input
                        type="password"
                        value={config.razorpayKeySecret}
                        onChange={(e) => setConfig({ ...config, razorpayKeySecret: e.target.value })}
                        placeholder="your_secret_key"
                        required
                        style={{
                          width: '100%',
                          border: '1.5px solid #d1d5db',
                          borderRadius: 12,
                          padding: '12px 18px',
                          fontSize: 16,
                          background: '#fff',
                          outline: 'none',
                        }}
                      />
                      <small style={{ color: '#888', fontSize: 14, marginTop: 4, display: 'block' }}>
                        Your Razorpay Key Secret - stored encrypted and never shared with clients
                      </small>
                    </div>

                    {/* Razorpay Webhook Secret */}
                    <div style={{ marginBottom: 32 }}>
                      <label style={{ display: 'block', fontWeight: 700, fontSize: 16, color: '#222', marginBottom: 8 }}>
                        Razorpay Webhook Secret
                      </label>
                      <input
                        type="password"
                        value={config.razorpayWebhookSecret}
                        onChange={(e) => setConfig({ ...config, razorpayWebhookSecret: e.target.value })}
                        placeholder="whsec_..."
                        style={{
                          width: '100%',
                          border: '1.5px solid #d1d5db',
                          borderRadius: 12,
                          padding: '12px 18px',
                          fontSize: 16,
                          background: '#fff',
                          outline: 'none',
                        }}
                      />
                      <small style={{ color: '#888', fontSize: 14, marginTop: 4, display: 'block' }}>
                        Optional: Razorpay webhook secret for server-side verification (starts with whsec_)
                      </small>
                    </div>

                    <div style={{ 
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', 
                      borderRadius: 12, 
                      padding: 20, 
                      marginBottom: 24,
                      color: '#fff'
                    }}>
                      <h6 style={{ fontWeight: 700, marginBottom: 12, color: '#fff' }}>📌 How to get your Razorpay API keys:</h6>
                      <ol style={{ marginLeft: 20, fontSize: 14, lineHeight: 1.8 }}>
                        <li>Go to <a href="https://dashboard.razorpay.com/app/keys" target="_blank" rel="noopener noreferrer" style={{ color: '#f7b32b', textDecoration: 'underline' }}>Razorpay Dashboard → Settings → API Keys</a></li>
                        <li>Generate or copy your Key ID and Key Secret</li>
                        <li>For webhooks, open <a href="https://dashboard.razorpay.com/app/webhooks" target="_blank" rel="noopener noreferrer" style={{ color: '#f7b32b', textDecoration: 'underline' }}>Settings → Webhooks</a></li>
                        <li>Add your webhook endpoint (for example: <code style={{ background: '#ffffff22', padding: '2px 8px', borderRadius: 4 }}>https://yourdomain.com/api/razorpay/webhook</code>)</li>
                        <li>Choose events like <em>payment.captured</em>, set the secret, and copy it here</li>
                      </ol>
                    </div>
                    {message.text && (
                      <div style={{ 
                        padding: 16, 
                        borderRadius: 12, 
                        marginBottom: 24,
                        background: message.type === 'success' ? '#d4edda' : '#f8d7da',
                        color: message.type === 'success' ? '#155724' : '#721c24',
                        border: `1px solid ${message.type === 'success' ? '#c3e6cb' : '#f5c6cb'}`
                      }}>
                        {message.text}
                      </div>
                    )}

                    {/* Save Button */}
                    <button
                      type="submit"
                      disabled={saving}
                      style={{
                        background: saving ? '#ccc' : 'linear-gradient(90deg,#5624d0 60%,#f7b32b 100%)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: 12,
                        padding: '14px 32px',
                        fontSize: 18,
                        fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer',
                        boxShadow: '0 4px 12px #5624d044',
                        letterSpacing: 1,
                        textTransform: 'uppercase',
                      }}
                    >
                      {saving ? 'Saving...' : 'Save Configuration'}
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default function Page() {
  return (
    <AuthGuard>
      <PaymentSettings />
    </AuthGuard>
  );
}
