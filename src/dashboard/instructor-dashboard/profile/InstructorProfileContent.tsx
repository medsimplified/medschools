"use client";

import { useEffect, useState } from "react";
import Image from "next/image";

const InstructorProfileContent = () => {
  const [profile, setProfile] = useState<any>(null);

  useEffect(() => {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => setProfile(data));
  }, []);

  if (!profile) {
    return (
      <div className="col-lg-9">
        <div className="dashboard__content-wrap">
          <div className="dashboard__content-title">
            <h4 className="title">My Profile</h4>
          </div>
          <div>Loading...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="col-lg-9">
      <div className="dashboard__content-wrap">
        <div className="dashboard__content-title">
          <h4 className="title">My Profile</h4>
        </div>
        <div className="row">
          <div className="col-lg-12">
            <div className="profile__content-wrap">
              <ul className="list-wrap">
                <li><span>ID</span> {profile.id}</li>
                <li><span>First Name</span> {profile.firstName}</li>
                <li><span>Last Name</span> {profile.lastName}</li>
                <li><span>Username</span> {profile.userName}</li>
                <li><span>Phone Number</span> {profile.phoneNumber || "-"}</li>
                <li><span>Skill</span> {profile.skill || "-"}</li>
                <li><span>Display Name</span> {profile.displayName || "-"}</li>
                <li><span>Bio</span> {profile.bio || "-"}</li>
                <li><span>Avatar</span> {profile.avatar 
                  ? <Image src={profile.avatar} alt="Avatar" width={50} height={50} style={{borderRadius: "50%"}} /> 
                  : "-"}</li>
                <li><span>Email</span> {profile.email}</li>
                {/* Do NOT display password for security reasons */}
                <li><span>Facebook</span> {profile.facebook || "-"}</li>
                <li><span>Twitter</span> {profile.twitter || "-"}</li>
                <li><span>LinkedIn</span> {profile.linkedin || "-"}</li>
                <li><span>Website</span> {profile.website || "-"}</li>
                <li><span>GitHub</span> {profile.github || "-"}</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InstructorProfileContent;
