"use client"

import Image from "next/image"
import BtnArrow from "@/svg/BtnArrow"
import Link from "next/link"
import VideoPopup from "@/modals/VideoPopup"
import { useState } from "react"
import SvgAnimation from "@/hooks/SvgAnimation"
import { FaAngleRight, FaBook, FaVideo, FaMedal, FaPlus } from "@/lib/fontAwesomeIconsComplete"

import drbhanuprakash from "@/assets/img/instructor/2.png"

const About = () => {
  const [isVideoOpen, setIsVideoOpen] = useState(false)
  const svgIconRef = SvgAnimation("/assets/img/others/inner_about_shape.svg")

  return (
    <>
      {/* ================= ABOUT SECTION ================= */}
      <section className="about-area-three section-py-120">
        <div className="container">
          <div className="row align-items-center justify-content-center">
            
            {/* Image */}
            <div className="col-lg-6 col-md-9">
              <div className="about__images-three tg-svg" ref={svgIconRef}>
                <Image src={drbhanuprakash} alt="Dr Bhanu Prakash" />
                <span className="svg-icon" id="about-svg"></span>
              </div>
            </div>

            {/* Content */}
            <div className="col-lg-6">
              <div className="about__content-three">
                <div className="section__title mb-10">
                  <span className="sub-title" style={{ color: "#168e6a" }}>
                    Get More About Us
                  </span>
                  <h2 className="title">Who We Are</h2>
                </div>

                <p className="desc">
                  We are MedSchool Simplified, an online platform built to transform
                  the way MBBS students and allied health professionals approach
                  medical education. Our mission is to bring together a vast array
                  of subjects, chapters, and topics in a logical sequence, creating
                  a synchronous learning experience for everyone—from first-year
                  students to seasoned practitioners.
                </p>

                <ul className="about__info-list list-wrap">
                  <li className="about__info-list-item">
                    <FaAngleRight />
                    <p className="content">Expert Medical Instructors</p>
                  </li>
                  <li className="about__info-list-item">
                    <FaAngleRight />
                    <p className="content">Access Your Class Anywhere</p>
                  </li>
                  <li className="about__info-list-item">
                    <FaAngleRight />
                    <p className="content">Comprehensive Learning Resources</p>
                  </li>
                </ul>

                <div className="tg-button-wrap">
                  <Link href="/contact" className="btn arrow-btn">
                    Get Started <BtnArrow />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ================= FEATURES SECTION ================= */}
      <section className="features__area-two section-py-120">
        <div className="container">

          {/* Title */}
          <div className="row justify-content-center">
            <div className="col-lg-12">
              <div className="section__title text-center mb-60">
                <h2 className="title">
                  Achieve Your Goal With MedSchool Simplified
                </h2>

                <p className="features-description">
                At MedSchool Simplified, we pride ourselves on offering a structured, high-quality learning environment designed for aspiring medical professionals. From foundational concepts to specialized training, our platform integrates diverse resources—such as detailed lecture notes, interactive MCQs, and real-world case studies—into a unified system. This holistic approach ensures that every student, whether preparing for board exams or broadening their clinical expertise, finds precisely what they need to excel.


                </p>

                <p className="features-description">
                 We understand the rigorous demands placed on MBBS students and allied health professionals, especially when preparing for critical exams like FMGE, NEET PG, and USMLE. Our resources are meticulously aligned with these examinations to help you master your subjects methodically. Through synchronized course structures and practical study tools, MedSchool Simplified empowers you to track progress, stay motivated, and achieve the milestones that lead you toward your dream medical career.


                </p>
              </div>
            </div>
          </div>

          {/* Feature Cards */}
          <div className="row g-4 features__item-wrap">
            <div className="col-lg-4 col-md-6">
              <div className="features__item-two">
                <div className="features__icon-two">
                  <FaBook />
                </div>
                <div className="features__content-two">
                  <h4 className="title">Expert Tutors</h4>
                  <p>
                  Our tutors are highly qualified and deeply committed to simplifying complex medical concepts. They bring a wealth of academic and clinical experience to each lecture, ensuring that intricate theories become relatable and understandable. By combining expert knowledge with relatable teaching methods, they help demystify topics ranging from basic sciences to advanced surgical procedures, all while nurturing critical thinking skills vital for any healthcare professional.


                  </p>
                </div>
                <div className="features__item-shape">
                  <FaPlus />
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="features__item-two">
                <div className="features__icon-two">
                  <FaVideo />
                </div>
                <div className="features__content-two">
                  <h4 className="title">Effective Courses
</h4>
                  <p>
                    Every course on our platform is built on a clear, step-by-step framework that guides you through subjects sequentially. This thoughtful organization helps you connect theoretical knowledge with clinical practice, reinforcing retention and understanding. Whether you need to revisit foundational content or delve deeper into advanced topics, our structured curriculum—complete with subject-wise chapters and targeted modules—offers a solid, cohesive path to mastery.


                  </p>
                </div>
                <div className="features__item-shape">
                  <FaPlus />
                </div>
              </div>
            </div>

            <div className="col-lg-4 col-md-6">
              <div className="features__item-two">
                <div className="features__icon-two">
                  <FaMedal />
                </div>
                <div className="features__content-two">
                  <h4 className="title">Premium Features
</h4>
                  <p>
                    To further enrich your learning experience, MedSchool Simplified provides premium features such as in-depth lecture notes, advanced case discussions, and specialized MCQs tailored to major medical exams. By upgrading to our premium offerings, you gain exclusive access to refined learning tools that sharpen clinical reasoning, deepen conceptual clarity, and keep you well-prepared for both theoretical and practical challenges in your medical journey.


                  </p>
                </div>
                <div className="features__item-shape">
                  <FaPlus />
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Video Popup */}
      <VideoPopup
        isVideoOpen={isVideoOpen}
        setIsVideoOpen={setIsVideoOpen}
        videoId="Ml4XCF-JS0k"
      />
    </>
  )
}

export default About
