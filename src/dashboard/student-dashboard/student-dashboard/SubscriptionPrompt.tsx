"use client";
import { useRouter } from "next/navigation";

const SubscriptionPrompt = () => {
  const router = useRouter();

  const handleClick = () => {
    console.log('Button clicked!');
    router.push("/student-dashboard/pricing");
  };

  return (
    <div className="dashboard__content-wrap">
      <div style={{
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        borderRadius: 18,
        padding: 60,
        textAlign: 'center',
        color: '#fff',
        minHeight: 400,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        zIndex: 1
      }}>
        <div style={{ fontSize: 80, marginBottom: 24 }}>🔒</div>
        <h3 style={{ fontSize: 32, fontWeight: 800, marginBottom: 16 }}>
          Your subscription is not active
        </h3>
        <p style={{ fontSize: 18, opacity: 0.9, maxWidth: 600, margin: '0 auto 32px' }}>
          Please complete payment to access premium content.
        </p>
        <button
          type="button"
          onClick={handleClick}
          className="btn"
          style={{
            background: '#fff',
            color: '#667eea',
            border: 'none',
            padding: '16px 48px',
            borderRadius: 12,
            fontSize: 18,
            fontWeight: 700,
            cursor: 'pointer',
            transition: 'all 0.3s ease',
            boxShadow: '0 8px 16px rgba(0,0,0,0.2)',
            position: 'relative',
            zIndex: 2
          }}
        >
          View Pricing Plans
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPrompt;
