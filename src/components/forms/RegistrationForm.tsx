"use client";

import { useState, useEffect } from "react";
import { toast } from "react-toastify";

export interface FormData {
  role: 'student' | 'instructor' | 'course_uploader';
  fullName: string;
  email: string;
  countryCode: string;
  phone: string;
  country: string;
  state: string;
  university?: string;
  expertise?: string;
  organization?: string;
  password: string;
  confirmPassword: string;
}

interface RegistrationFormProps {
  onOtpSent: (data: FormData) => void;
}

export default function RegistrationForm({ onOtpSent }: RegistrationFormProps) {
  const [formData, setFormData] = useState<FormData>({
    role: 'student',
    fullName: "",
    email: "",
    countryCode: "",
    phone: "",
    country: "",
    state: "",
    university: "",
    expertise: "",
    organization: "",
    password: "",
    confirmPassword: "",
  });



  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation
    if (formData.password !== formData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    if (formData.password.length < 6) {
      toast.error("Password must be at least 6 characters long!");
      return;
    }

    // Country code validation
    if (!/^\+\d{1,4}$/.test(formData.countryCode)) {
      toast.error("Please enter a valid country code (e.g., +91)");
      return;
    }

    // Phone validation (only digits, 6-14 characters)
    if (!/^\d{6,14}$/.test(formData.phone)) {
      toast.error("Please enter a valid phone number (6-14 digits)");
      return;
    }

        // Organization validation for course uploaders
        if (formData.role === "course_uploader" && !(formData.organization?.trim())) {
      toast.error("Organization is required for course uploaders!");
      return;
    }

    onOtpSent(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="account__form">
          <div className="form-grp">
            <label htmlFor="role">Role *</label>
            <select
              id="role"
              name="role"
              value={formData.role}
              onChange={handleChange}
              style={{
                width: '100%',
                padding: '14px 20px',
                fontSize: '16px',
                color: 'var(--tg-heading-color)',
                border: '1px solid #E1E1E1',
                background: 'var(--tg-common-color-white)',
                borderRadius: '5px',
                lineHeight: '1',
                transition: 'all 0.3s ease-out 0s',
                cursor: 'pointer'
              }}
            >
              <option value="student">Student</option>
              <option value="instructor">Instructor</option>
              <option value="course_uploader">Course Uploader</option>
            </select>
          </div>

          <div className="form-grp">
            <label htmlFor="fullName">Full Name *</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              placeholder="Enter your full name"
              value={formData.fullName}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grp">
            <label htmlFor="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Enter your email"
              value={formData.email}
              onChange={handleChange}
              required
            />
          </div>

          <div className="row">
            <div className="col-md-4">
              <div className="form-grp">
                <label htmlFor="countryCode">Country Code *</label>
                <input
                  type="text"
                  id="countryCode"
                  name="countryCode"
                  placeholder="+91"
                  value={formData.countryCode}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
            <div className="col-md-8">
              <div className="form-grp">
                <label htmlFor="phone">Mobile Number *</label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  placeholder="1234567890"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>
          </div>

          <div className="form-grp">
            <label htmlFor="country">Country *</label>
            <input
              type="text"
              id="country"
              name="country"
              placeholder="Enter your country"
              value={formData.country}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grp">
            <label htmlFor="state">State *</label>
            <input
              type="text"
              id="state"
              name="state"
              placeholder="Enter your state"
              value={formData.state}
              onChange={handleChange}
              required
            />
          </div>

          {/* University for student and instructor */}
          {(formData.role === 'student' || formData.role === 'instructor') && (
            <div className="form-grp">
              <label htmlFor="university">University{formData.role === 'student' ? ' *' : ''}</label>
              <input
                type="text"
                id="university"
                name="university"
                placeholder="Enter your university name"
                value={formData.university}
                onChange={handleChange}
                required={formData.role === 'student'}
              />
            </div>
          )}

          {/* Expertise for instructor only */}
          {formData.role === 'instructor' && (
            <div className="form-grp">
              <label htmlFor="expertise">Area of Expertise *</label>
              <input
                type="text"
                id="expertise"
                name="expertise"
                placeholder="e.g. Mathematics, Physics, etc."
                value={formData.expertise}
                onChange={handleChange}
                required
              />
            </div>
          )}

          {/* Organization for course uploader only */}
          {formData.role === 'course_uploader' && (
            <div className="form-grp">
              <label htmlFor="organization">Organization/Company *</label>
              <input
                type="text"
                id="organization"
                name="organization"
                placeholder="Enter your organization or company name"
                value={formData.organization}
                onChange={handleChange}
                required
              />
            </div>
          )}

          <div className="form-grp">
            <label htmlFor="password">Password *</label>
            <input
              type="password"
              id="password"
              name="password"
              placeholder="Enter password (min 6 characters)"
              value={formData.password}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-grp">
            <label htmlFor="confirmPassword">Confirm Password *</label>
            <input
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              placeholder="Confirm your password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
          </div>

      <button type="submit" className="btn btn-two arrow-btn">
        Sign Up
      </button>
    </form>
  );
}

