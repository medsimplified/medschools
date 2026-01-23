"use client";
import { useState } from "react";

const InstructorSettingPassword = ({ goToNextTab }: { goToNextTab?: () => void }) => {
  const [form, setForm] = useState({
    currentpassword: "",
    newpassword: "",
    repassword: "",
  });
  const [message, setMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState<boolean | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsSuccess(null);
    if (form.newpassword !== form.repassword) {
      setMessage("New passwords do not match.");
      setIsSuccess(false);
      return;
    }
    const res = await fetch("/api/admin/password", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        currentPassword: form.currentpassword,
        newPassword: form.newpassword,
      }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessage("Password updated successfully.");
      setIsSuccess(true);
      setForm({ currentpassword: "", newpassword: "", repassword: "" });
      if (goToNextTab) goToNextTab(); // Move to next tab
    } else {
      setMessage(data.error || "Failed to update password.");
      setIsSuccess(false);
    }
  };

  return (
    <div className="instructor__profile-form-wrap">
      <form onSubmit={handleSubmit} className="instructor__profile-form">
        <div className="form-grp">
          <label htmlFor="currentpassword">Current Password</label>
          <input
            id="currentpassword"
            type="password"
            placeholder="Current Password"
            value={form.currentpassword}
            onChange={handleChange}
          />
        </div>
        <div className="form-grp">
          <label htmlFor="newpassword">New Password</label>
          <input
            id="newpassword"
            type="password"
            placeholder="New Password"
            value={form.newpassword}
            onChange={handleChange}
          />
        </div>
        <div className="form-grp">
          <label htmlFor="repassword">Re-Type New Password</label>
          <input
            id="repassword"
            type="password"
            placeholder="Re-Type New Password"
            value={form.repassword}
            onChange={handleChange}
          />
        </div>
        {message && (
          <div style={{ color: isSuccess ? "green" : "red", marginBottom: 10 }}>
            {message}
          </div>
        )}
        <div className="submit-btn mt-25">
          <button type="submit" className="btn">Update Password</button>
        </div>
      </form>
    </div>
  );
};

export default InstructorSettingPassword;
