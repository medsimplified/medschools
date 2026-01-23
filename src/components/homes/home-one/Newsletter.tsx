"use client"
import Image from "next/image"

import newsletter_img1 from "@/assets/img/others/newsletter_img.png"
import newsletter_img2 from "@/assets/img/others/newsletter_shape01.png"
import newsletter_img3 from "@/assets/img/others/newsletter_shape02.png"
import newsletter_img4 from "@/assets/img/others/newsletter_shape03.png"

const Newsletter = () => {
   return (
      <section 
         className="newsletter__area"
         style={{
            background: "linear-gradient(135deg, #0d447a 0%, #5dba47 100%)",
            padding: "80px 0",
            position: "relative",
            overflow: "hidden"
         }}
      >
         <div className="container">
            <div className="row align-items-center">
               <div className="col-lg-4">
                  <div className="newsletter__img-wrap">
                     <Image src={newsletter_img1} alt="img" />
                     <Image src={newsletter_img2} alt="img" data-aos="fade-up" data-aos-delay="400" />
                     <Image src={newsletter_img3} alt="img" className="alltuchtopdown" />
                  </div>
               </div>
               <div className="col-lg-8">
                  <div className="newsletter__content">
                     <h2 
                        className="title"
                        style={{
                           color: "#fff",
                           fontFamily: "'Impact', Arial Black, sans-serif",
                           fontSize: "2.5rem",
                           lineHeight: "1.3",
                           marginBottom: "30px"
                        }}
                     >
                        Want to stay <span style={{ color: "#5dba47" }}>informed</span> about <br /> 
                        new <span style={{ color: "#5dba47" }}>courses & study?</span>
                     </h2>
                     <div className="newsletter__form">
                        <form onSubmit={(e) => e.preventDefault()}>
                           <div 
                              style={{
                                 display: "flex",
                                 gap: "15px",
                                 alignItems: "stretch",
                                 marginTop: "20px"
                              }}
                           >
                              <input 
                                 type="email" 
                                 placeholder="Type your e-mail"
                                 style={{
                                    flex: "1",
                                    padding: "15px 20px",
                                    borderRadius: "50px",
                                    border: "2px solid rgba(255,255,255,0.2)",
                                    background: "rgba(255,255,255,0.1)",
                                    backdropFilter: "blur(10px)",
                                    color: "#fff",
                                    fontSize: "16px",
                                    outline: "none"
                                 }}
                              />
                              <button 
                                 type="submit" 
                                 className="btn"
                                 style={{
                                    background: "#5dba47",
                                    color: "#fff",
                                    border: "none",
                                    borderRadius: "50px",
                                    padding: "15px 30px",
                                    fontSize: "16px",
                                    fontWeight: "600",
                                    cursor: "pointer",
                                    transition: "all 0.3s ease",
                                    whiteSpace: "nowrap"
                                 }}
                                 onMouseEnter={(e) => {
                                    e.currentTarget.style.background = "#4a9c38";
                                    e.currentTarget.style.transform = "translateY(-2px)";
                                 }}
                                 onMouseLeave={(e) => {
                                    e.currentTarget.style.background = "#5dba47";
                                    e.currentTarget.style.transform = "translateY(0)";
                                 }}
                              >
                                 Subscribe Now
                              </button>
                           </div>
                        </form>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="newsletter__shape">
            <Image src={newsletter_img4} alt="img" data-aos="fade-left" data-aos-delay="400" />
         </div>

         <style jsx>{`
            .newsletter__area input::placeholder {
               color: rgba(255,255,255,0.7) !important;
            }
            
            .newsletter__area input:focus {
               border-color: #5dba47 !important;
               background: rgba(255,255,255,0.15) !important;
            }
            
            @media (max-width: 768px) {
               .newsletter__content h2 {
                  font-size: 2rem !important;
               }
               
               .newsletter__form form > div {
                  flex-direction: column !important;
                  gap: 15px !important;
               }
               
               .newsletter__form input,
               .newsletter__form button {
                  width: 100% !important;
               }
            }
         `}</style>
      </section>
   )
}

export default Newsletter
