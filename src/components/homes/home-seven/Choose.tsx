"use client"
import { FaAngleRight } from "@/lib/fontAwesomeIconsComplete"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import VideoPopup from "@/modals/VideoPopup"
import BtnArrow from "@/svg/BtnArrow"
import { FaPlay } from "@/lib/fontAwesomeIconsComplete"

import choose_img1 from "@/assets/img/others/h7_choose_img01.jpg"
import choose_img2 from "@/assets/img/others/h7_choose_img02.jpg"
import choose_img3 from "@/assets/img/others/h7_choose_img03.jpg"
import choose_img4 from "@/assets/img/others/h7_choose_shape01.svg"
import choose_img5 from "@/assets/img/others/h7_choose_shape02.svg"
import choose_img6 from "@/assets/img/others/h7_choose_shape03.svg"

const Choose = () => {

   const [isVideoOpen, setIsVideoOpen] = useState(false);

   return (
      <>
         <section 
            className="choose__area-four tg-motion-effects section-py-140 mt-5"
            style={{
               background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 50%, #f1f3f4 100%)",
               position: "relative",
               borderRadius: "10px",
               margin: "0 20px",
               padding: "60px 0",
               overflow: "hidden",
               boxShadow: `
                  0 25px 50px rgba(0,0,0,0.08),
                  inset 0 1px 0 rgba(255,255,255,0.6)
               `,
               border: "1px solid rgba(255,255,255,0.2)",
               backdropFilter: "blur(10px)",
            }}
         >
            {/* Single clean background layer */}
            <div
               style={{
                  position: "absolute",
                  inset: "0",
                  background: "linear-gradient(135deg, rgba(93,186,71,0.03) 0%, rgba(13,68,122,0.02) 100%)",
                  borderRadius: "25px",
                  zIndex: 1,
               }}
            />

            <div className="container" style={{ position: "relative", zIndex: 3 }}>
               <div className="row align-items-center justify-content-center">
                  <div className="col-lg-6 col-md-10">
                     <div 
                        className="choose__img-four"
                        style={{
                           transform: "translateZ(30px)",
                           animation: "chooseImageFloat 6s ease-in-out infinite",
                        }}
                     >
                        <div className="left__side">
                           <Image src={choose_img1} alt="img" data-aos="fade-down" data-aos-delay="200" />
                           <Image src={choose_img2} alt="img" data-aos="fade-up" data-aos-delay="200" />
                        </div>
                        <div className="right__side" data-aos="fade-left" data-aos-delay="400">
                           <Image src={choose_img3} alt="img" />
                           <a 
                              onClick={() => setIsVideoOpen(true)} 
                              style={{ 
                                 cursor: "pointer",
                                 background: "linear-gradient(135deg, #5dba47 0%, #4a9c38 100%)",
                                 color: "#fff",
                                 borderRadius: "50%",
                                 width: "70px",
                                 height: "70px",
                                 display: "flex",
                                 alignItems: "center",
                                 justifyContent: "center",
                                 boxShadow: "0 8px 25px rgba(93,186,71,0.3)",
                                 transition: "all 0.3s ease",
                              }} 
                              className="popup-video"
                              onMouseEnter={(e) => {
                                 (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1.1)";
                                 (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 12px 35px rgba(93,186,71,0.4)";
                              }}
                              onMouseLeave={(e) => {
                                 (e.currentTarget as HTMLAnchorElement).style.transform = "scale(1)";
                                 (e.currentTarget as HTMLAnchorElement).style.boxShadow = "0 8px 25px rgba(93,186,71,0.3)";
                              }}
                           >
                              <FaPlay aria-hidden />
                           </a>
                        </div>
                        <Image src={choose_img4} alt="shape" className="shape shape-one tg-motion-effects4" />
                        <Image src={choose_img5} alt="shape" className="shape shape-two alltuchtopdown" />
                        <Image src={choose_img6} alt="shape" className="shape shape-three tg-motion-effects7" />
                     </div>
                  </div>
                  <div className="col-lg-6">
                     <div 
                        className="choose__content-four"
                        style={{
                           transform: "translateZ(20px)",
                           animation: "chooseContentFloat 8s ease-in-out infinite",
                        }}
                     >
                        <div className="section__title mb-20">
                           <span 
                              className="sub-title" 
                              style={{
                                 background: "linear-gradient(135deg, #5dba47 0%, #4a9c38 100%)",
                                 color: "#fff",
                                 fontWeight: 600,
                                 fontSize: "0.9rem",
                                 letterSpacing: "0.5px",
                                 padding: "8px 16px",
                                 borderRadius: "20px",
                                 display: "inline-block",
                                 boxShadow: "0 4px 15px rgba(93,186,71,0.3)",
                                 border: "1px solid rgba(255,255,255,0.2)",
                              }}
                           >
                              Who we are
                           </span>
                           <h2 
                              className="title bold"
                              style={{
                                 color: "#0d447a",
                                 fontWeight: 800,
                                 fontSize: "2.5rem",
                                 lineHeight: "1.2",
                                 marginBottom: "1rem",
                                 marginTop: "1rem",
                                 textShadow: "0 4px 20px rgba(13,68,122,0.1)",
                                 filter: "drop-shadow(0 0 15px rgba(13,68,122,0.1))",
                              }}
                           >
                              Why Choose us
                           </h2>
                        </div>
                        <p style={{ 
                           color: "#666", 
                           lineHeight: "1.6", 
                           fontSize: "1rem",
                           textShadow: "0 1px 5px rgba(0,0,0,0.05)",
                        }}>
                           Welcome to Med School Simplified! Our channel is dedicated to providing top-notch medical education tailored specifically for MBBS students, USMLE aspirants, and those preparing for FMGE and NEET PG exams. We aim to make complex medical concepts easy to grasp through clear and concise videos, detailed lectures, and practical insights. Whether you&apos;re starting your medical journey or gearing up for crucial exams, our content is designed to help you excel. Join us and simplify your path to medical success!
                        </p>
                        <ul className="about__info-list list-wrap" style={{ marginBottom: "2rem" }}>
                           <li className="about__info-list-item" style={{ marginBottom: "1rem" }}>
                              <FaAngleRight 
                                 style={{ color: "#5dba47 !important", fontSize: "1.2rem", marginRight: "0.5rem" }}
                              />
                              <p className="content" style={{ color: "#0d447a", fontWeight: 600 }}>All subjects Video lectures</p>
                           </li>
                           <li className="about__info-list-item" style={{ marginBottom: "1rem" }}>
                              <FaAngleRight 
                                 style={{ color: "#5dba47 !important", fontSize: "1.2rem", marginRight: "0.5rem" }}
                              />
                              <p className="content" style={{ color: "#0d447a", fontWeight: 600 }}>In-depth Explanation of Concepts</p>
                           </li>
                           <li className="about__info-list-item" style={{ marginBottom: "1rem" }}>
                              <FaAngleRight 
                                 style={{ color: "#5dba47 !important", fontSize: "1.2rem", marginRight: "0.5rem" }}
                              />
                              <p className="content" style={{ color: "#0d447a", fontWeight: 600 }}>Lectures notes / MCQs and Cases with Premium features</p>
                           </li>
                        </ul>
                        <Link 
                           href="/login" 
                           className="btn-brand arrow-btn btn-four"
                           style={{
                              background: "linear-gradient(135deg, rgb(93, 186, 71) 0%, rgb(74, 156, 56) 100%)",
                              color: "#fff",
                              borderRadius: "12px",
                              padding: "14px 28px",
                              fontWeight: 600,
                              fontSize: "1rem",
                              border: "none",
                              boxShadow: "0 8px 25px rgba(93,186,71,0.3), inset 0 1px 0 rgba(255,255,255,0.2)",
                              transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                              display: "inline-flex",
                              alignItems: "center",
                              gap: "12px",
                              position: "relative",
                              overflow: "hidden",
                              textDecoration: "none",
                           }}
                           onMouseEnter={(e) => {
                              const target = e.currentTarget as HTMLAnchorElement;
                              target.style.background = "linear-gradient(135deg, #5dba47 0%, #4a9c38 100%)";
                              target.style.boxShadow = "0 15px 40px rgba(93,186,71,0.4), inset 0 1px 0 rgba(255,255,255,0.3)";
                           }}
                           onMouseLeave={(e) => {
                              const target = e.currentTarget as HTMLAnchorElement;
                              target.style.background = "linear-gradient(135deg, #0d447a 0%, #094a8f 100%)";
                              target.style.boxShadow = "0 8px 25px rgba(93,186,71,0.3), inset 0 1px 0 rgba(255,255,255,0.2)";
                           }}
                        >
                           <span className="btn-text">Get Started</span>
                           <span className="btn-arrow">&#8594;</span>
                        </Link>
                     </div>
                  </div>
               </div>
            </div>

            {/* Simplified Animation Styles */}
            <style jsx>{`
               @keyframes chooseImageFloat {
                  0%, 100% { transform: translateZ(30px) translateY(0px); }
                  50% { transform: translateZ(35px) translateY(-8px); }
               }

               @keyframes chooseContentFloat {
                  0%, 100% { transform: translateZ(20px) translateY(0px); }
                  33% { transform: translateZ(25px) translateY(-5px); }
                  66% { transform: translateZ(15px) translateY(3px); }
               }
            `}</style>
         </section>
         <VideoPopup
            isVideoOpen={isVideoOpen}
            setIsVideoOpen={setIsVideoOpen}
            videoId={"Ml4XCF-JS0k"}
         />
      </>
   )
}

export default Choose
