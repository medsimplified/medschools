"use client";

import { useEffect, useState } from "react";

const CONSENT_KEY = "cookie-consent";

const bannerStyle: React.CSSProperties = {
  position: "fixed",
  bottom: "16px",
  right: "16px",
  left: "16px",
  maxWidth: "520px",
  margin: "0 auto",
  zIndex: 9999,
  background: "#0f172a",
  color: "#f8fafc",
  padding: "16px",
  borderRadius: "12px",
  boxShadow: "0 10px 30px rgba(0,0,0,0.25)",
  display: "flex",
  gap: "12px",
  alignItems: "flex-start",
  flexWrap: "wrap",
};

const buttonStyle: React.CSSProperties = {
  background: "#22c55e",
  color: "#0b1120",
  border: "none",
  borderRadius: "8px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 600,
};

const secondaryButtonStyle: React.CSSProperties = {
  background: "transparent",
  color: "#e2e8f0",
  border: "1px solid #334155",
  borderRadius: "8px",
  padding: "10px 14px",
  cursor: "pointer",
  fontWeight: 600,
};

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const stored = typeof window !== "undefined" ? localStorage.getItem(CONSENT_KEY) : null;
    if (!stored) {
      setVisible(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_KEY, "accepted");
    setVisible(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_KEY, "declined");
    setVisible(false);
  };

  if (!visible) return null;

  return (
    <div role="dialog" aria-label="Cookie consent" style={bannerStyle}>
      <div style={{ flex: 1, minWidth: "240px" }}>
        <div style={{ fontWeight: 700, marginBottom: 6 }}>Cookies & Analytics</div>
        <div style={{ lineHeight: 1.4 }}>
          We use essential cookies to run the site. Analytics is optional and only enabled if you agree.
          See our <a href="/privacy" style={{ color: "#38bdf8", textDecoration: "underline" }}>privacy policy</a>.
        </div>
      </div>
      <div style={{ display: "flex", gap: "8px" }}>
        <button type="button" style={buttonStyle} onClick={accept} aria-label="Accept cookies">
          Accept
        </button>
        <button type="button" style={secondaryButtonStyle} onClick={decline} aria-label="Decline non-essential cookies">
          Decline
        </button>
      </div>
    </div>
  );
}
