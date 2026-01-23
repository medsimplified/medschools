import type { CSSProperties } from 'react';

const rootStyle: CSSProperties = {
  position: 'fixed',
  inset: 0,
  zIndex: 9999,
  minHeight: '100vh',
  width: '100vw',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: '#fff',
  transition: 'background 0.6s cubic-bezier(.4,2,.3,1)'
};

const contentStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '1.5rem',
  animation: 'fadeIn 0.8s cubic-bezier(.4,2,.3,1) both'
};

const spinnerStyle: CSSProperties = {
  width: '70px',
  height: '70px',
  border: '7px solid #eaeaea',
  borderTop: '7px solid #5dba47',
  borderRight: '7px solid #0d447a',
  borderBottom: '7px solid #5dba47',
  borderRadius: '50%',
  animation: 'spin 1.1s linear infinite, float 2.2s ease-in-out infinite alternate',
  margin: 0,
  boxShadow: '0 4px 24px rgba(13,68,122,0.08)',
  background: 'transparent'
};

const titleStyle: CSSProperties = {
  fontSize: '2.4rem',
  fontWeight: 700,
  color: '#0d447a',
  letterSpacing: '1px',
  textAlign: 'center',
  margin: 0,
  textShadow: '0 2px 18px #eaeaea, 0 0px 2px #5dba47',
  animation: 'glowText 2.2s ease-in-out infinite alternate',
  transition: 'color 0.6s cubic-bezier(.4,2,.3,1)'
};

const accentStyle: CSSProperties = {
  color: '#5dba47',
  background: 'rgba(93,186,71,0.18)',
  borderRadius: '12px',
  padding: '0 10px',
  marginLeft: '4px',
  boxShadow: '0 0 12px #5dba47',
  fontWeight: 700,
  display: 'inline-block',
  animation: 'accentPulse 1.8s infinite alternate'
};

export default function Preloader() {
  return (
    <div className="preloader-root" style={rootStyle}>
      <div className="preloader-content" style={contentStyle}>
        <div className="preloader-spinner" style={spinnerStyle} />
        <h1 className="preloader-title" style={titleStyle}>
          MedSchool <span className="preloader-accent" style={accentStyle}>Simplified</span>
        </h1>
      </div>
      <style jsx>{`
        @keyframes fadeIn {
          0% { opacity: 0; transform: scale(0.95) translateY(20px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        @keyframes float {
          0% { transform: translateY(0); }
          100% { transform: translateY(-16px); }
        }
        @keyframes glowText {
          0% { text-shadow: 0 2px 18px #eaeaea, 0 0px 2px #5dba47; }
          100% { text-shadow: 0 4px 32px #5dba47, 0 0px 8px #eaeaea; }
        }
        @keyframes accentPulse {
          0% { background: rgba(93,186,71,0.18); }
          100% { background: rgba(93,186,71,0.32); }
        }
        @media (max-width: 600px) {
          .preloader-title { font-size: 1.3rem !important; }
          .preloader-spinner { width: 38px !important; height: 38px !important; border-width: 5px !important; }
        }
      `}</style>
    </div>
  );
}
