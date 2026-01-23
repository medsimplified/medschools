"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-toastify";

export default function OtpModalWrapper({
  email,
  onVerifySuccess,
  onClose,
}: {
  email: string;
  onVerifySuccess: () => void;
  onClose?: () => void;
}) {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const verifyOtp = async () => {
    if (!otp) return toast.error("Enter the OTP");

    setLoading(true);
    try {
      const res = await fetch("/api/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });

      if (res.ok) {
        const data = await res.json();
        toast.success("OTP verified!");
        // Redirect based on role
        if (data.role === 'course_uploader') {
          router.replace("/instructor-uploader-dashboard");
        } else if (data.role === 'instructor') {
          router.replace("/instructor-login");
        } else {
          router.replace("/student-dashboard");
        }
        if (onVerifySuccess) onVerifySuccess();
      } else {
        const data = await res.json();
        toast.error(data.error || "Invalid OTP");
      }
    } catch (err) {
      toast.error("Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style jsx>{`
        .otp-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: rgba(0, 0, 0, 0.6);
          z-index: 9999;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 20px;
          animation: fadeIn 0.3s ease-in-out;
        }

        .otp-modal-content {
          background: white;
          border-radius: 12px;
          padding: 40px;
          width: 100%;
          max-width: 450px;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
          position: relative;
          animation: slideUp 0.3s ease-out;
        }

        .otp-modal-close {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 28px;
          color: #999;
          cursor: pointer;
          width: 35px;
          height: 35px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: all 0.2s;
        }

        .otp-modal-close:hover {
          background-color: #f0f0f0;
          color: #333;
        }

        .otp-modal-header {
          text-align: center;
          margin-bottom: 25px;
        }

        .otp-modal-title {
          font-size: 26px;
          font-weight: 700;
          color: #2d3748;
          margin-bottom: 10px;
        }

        .otp-modal-subtitle {
          font-size: 15px;
          color: #718096;
          line-height: 1.6;
        }

        .otp-email-display {
          background: #f7fafc;
          padding: 12px 16px;
          border-radius: 8px;
          margin-bottom: 25px;
          text-align: center;
          border: 1px solid #e2e8f0;
        }

        .otp-email-label {
          font-size: 13px;
          color: #718096;
          margin-bottom: 5px;
        }

        .otp-email-value {
          font-size: 16px;
          font-weight: 600;
          color: #2d3748;
          word-break: break-word;
        }

        .otp-input-wrapper {
          margin-bottom: 25px;
        }

        .otp-input {
          width: 100%;
          padding: 14px 16px;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 18px;
          text-align: center;
          letter-spacing: 8px;
          font-weight: 600;
          transition: border-color 0.2s;
        }

        .otp-input:focus {
          outline: none;
          border-color: #3182ce;
        }

        .otp-input::placeholder {
          letter-spacing: normal;
          font-size: 14px;
          font-weight: 400;
        }

        .otp-verify-button {
          width: 100%;
          padding: 14px 20px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          border: none;
          border-radius: 8px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          box-shadow: 0 4px 15px rgba(102, 126, 234, 0.4);
        }

        .otp-verify-button:hover:not(:disabled) {
          transform: translateY(-2px);
          box-shadow: 0 6px 20px rgba(102, 126, 234, 0.6);
        }

        .otp-verify-button:disabled {
          opacity: 0.7;
          cursor: not-allowed;
        }

        @keyframes fadeIn {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes slideUp {
          from {
            transform: translateY(30px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
      `}</style>

      <div className="otp-modal-overlay" onClick={(e) => {
        if (e.target === e.currentTarget && onClose) {
          onClose();
        }
      }}>
        <div className="otp-modal-content">
          {onClose && (
            <button
              onClick={onClose}
              className="otp-modal-close"
              aria-label="Close"
              type="button"
            >
              ×
            </button>
          )}
          
          <div className="otp-modal-header">
            <h3 className="otp-modal-title">Verify Your Email</h3>
            <p className="otp-modal-subtitle">
              We&apos;ve sent a verification code to your email address
            </p>
          </div>

          <div className="otp-email-display">
            <div className="otp-email-label">Email Address</div>
            <div className="otp-email-value">{email}</div>
          </div>

          <div className="otp-input-wrapper">
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, '').slice(0, 6))}
              placeholder="Enter 6-digit OTP"
              className="otp-input"
              maxLength={6}
              autoFocus
            />
          </div>

          <button
            onClick={verifyOtp}
            className="otp-verify-button"
            disabled={loading || otp.length !== 6}
          >
            {loading ? "Verifying..." : "Verify OTP"}
          </button>
        </div>
      </div>
    </>
  );
}
