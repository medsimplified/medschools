"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";
import { FaCamera } from "@/lib/fontAwesomeIconsComplete";

import thumb from "@/assets/img/courses/details_instructors01.jpg";
import thumb_2 from "@/assets/img/courses/details_instructors02.jpg";

const InstructorSettingProfile = ({ style, goToNextTab }: any) => {
  const [profile, setProfile] = useState({
    firstName: "",
    lastName: "",
    userName: "",
    phoneNumber: "",
    skill: "",
    displayName: "",
    bio: "",
  });

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => data && setProfile(data));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/admin/profile", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(profile),
    });
    if (goToNextTab) goToNextTab(); // Go to Password tab after save
  };

  return (
    <>
      {style ? (
        <div
          className="instructor__cover-bg"
          style={{ backgroundImage: `url(/assets/img/bg/student_bg.jpg)` }}
        >
          <div className="instructor__cover-info">
            <div className="instructor__cover-info-left">
              <div className="thumb">
                <Image src={thumb_2} alt="img" />
              </div>
              <button title="Upload Photo">
                <FaCamera aria-hidden />
              </button>
            </div>
            {/* <div className="instructor__cover-info-right">
              <Link href="#" className="btn btn-two arrow-btn">
                Edit Cover Photo
              </Link>
            </div> */}
          </div>
        </div>
      ) : (
        // <div
        //   className="instructor__cover-bg"
        //   style={{ backgroundImage: `url(/assets/img/bg/instructor_dashboard_bg.png)` }}
        // >
        //   <div className="instructor__cover-info">
        //     <div className="instructor__cover-info-left">
        //       <div className="thumb">
        //         <Image src={thumb} alt="img" />
        //       </div>
        //       <button title="Upload Photo">
        //         <i className="fas fa-camera"></i>
        //       </button>
        //     </div>
        //     <div className="instructor__cover-info-right">
        //       <Link href="#" className="btn btn-two arrow-btn">
        //         Edit Cover Photo
        //       </Link>
        //     </div>
        //   </div>
        // </div>
        <div></div>
      )}

      <div className="instructor__profile-form-wrap">
        <form onSubmit={handleSubmit} className="instructor__profile-form">
          <div className="row">
            <div className="col-md-6">
              <div className="form-grp">
                <label htmlFor="firstname">First Name</label>
                <input
                  id="firstname"
                  type="text"
                  name="firstName"
                  value={profile.firstName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-grp">
                <label htmlFor="lastname">Last Name</label>
                <input
                  id="lastname"
                  type="text"
                  name="lastName"
                  value={profile.lastName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-grp">
                <label htmlFor="username">User Name</label>
                <input
                  id="username"
                  type="text"
                  name="userName"
                  value={profile.userName}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-grp">
                <label htmlFor="phonenumber">Phone Number</label>
                <input
                  id="phonenumber"
                  type="tel"
                  name="phoneNumber"
                  value={profile.phoneNumber}
                  onChange={handleChange}
                />
              </div>
            </div>
            <div className="col-md-6">
              <div className="form-grp">
                <label htmlFor="skill">Skill/Occupation</label>
                <input
                  id="skill"
                  type="text"
                  name="skill"
                  value={profile.skill}
                  onChange={handleChange}
                />
              </div>
            </div>
         <div className="col-md-6">
  <div className="form-grp">
    <label htmlFor="displayname">Display Name Publicly As</label>
    <input
      type="text"
      id="displayname"
      name="displayName"
      value={profile.displayName}
      onChange={handleChange}
      placeholder="Enter your display name"
      className="form-control"
    />
  </div>
</div>

          </div>
          <div className="form-grp">
            <label htmlFor="bio">Bio</label>
            <textarea
              id="bio"
              name="bio"
              value={profile.bio}
              onChange={handleChange}
            />
          </div>
          <div className="submit-btn mt-25">
            <button type="submit" className="btn">
              Update Info
            </button>
          </div>
        </form>
      </div>
    </>
  );
};

export default InstructorSettingProfile;
