"use client";
import { useEffect, useState } from "react";

const InstructorSettingSocialShare = () => {
  const [social, setSocial] = useState({
    facebook: "",
    twitter: "",
    linkedin: "",
    website: "",
    github: "",
  });

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data) {
          setSocial({
            facebook: data.facebook || "",
            twitter: data.twitter || "",
            linkedin: data.linkedin || "",
            website: data.website || "",
            github: data.github || "",
          });
        }
      });
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSocial({ ...social, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(social),
    });
    // Optionally show a toast
  };

  return (
    <div className="instructor__profile-form-wrap">
      <form onSubmit={handleSubmit} className="instructor__profile-form">
        <div className="form-grp">
          <label htmlFor="facebook">Facebook</label>
          <input
            id="facebook"
            type="url"
            placeholder="https://facebook.com/"
            value={social.facebook}
            onChange={handleChange}
          />
        </div>
        <div className="form-grp">
          <label htmlFor="twitter">Twitter</label>
          <input
            id="twitter"
            type="url"
            placeholder="https://twitter.com/"
            value={social.twitter}
            onChange={handleChange}
          />
        </div>
        <div className="form-grp">
          <label htmlFor="linkedin">Linkedin</label>
          <input
            id="linkedin"
            type="url"
            placeholder="https://linkedin.com/"
            value={social.linkedin}
            onChange={handleChange}
          />
        </div>
        <div className="form-grp">
          <label htmlFor="website">Website</label>
          <input
            id="website"
            type="url"
            placeholder="https://website.com/"
            value={social.website}
            onChange={handleChange}
          />
        </div>
        <div className="form-grp">
          <label htmlFor="github">Github</label>
          <input
            id="github"
            type="url"
            placeholder="https://github.com/"
            value={social.github}
            onChange={handleChange}
          />
        </div>
        <div className="submit-btn mt-25">
          <button type="submit" className="btn">
            Update Profile
          </button>
        </div>
      </form>
    </div>
  );
};

export default InstructorSettingSocialShare;
