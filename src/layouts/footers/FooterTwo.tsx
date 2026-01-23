"use client"
import Image from "next/image"
import Link from "next/link"
import Social from "@/components/common/Social"

const FooterTwo = ({ style }: any) => {
   return (
      <footer
         className={`footer__area ${style ? "footer__area-five" : "footer__area-three"}`}
         style={{
            background: "#0d447a",
            position: "relative",
            paddingTop: "48px",
            paddingBottom: "32px",
         }}
      >
         <div className="footer__top footer__top-two">
            <div className="container">
               <div className="row footer-row">
                  <div className="col-xl-2 col-lg-3 col-md-6 footer-col footer-logo-col">
                     <div className="footer__widget">
                        <div className="logo mb-35" style={{ textAlign: "left" }}>
                           <Link href="/">
                              <Image
                                 src="/assets/img/logo/mssfooter.png"
                                 alt="Logo"
                                 width={80}
                                 height={67}
                                 style={{ height: "100px", width: "auto" }}
                              />
                           </Link>
                        </div>
                        <div className="footer__desc" style={{ color: "rgba(255,255,255,0.85)", fontSize: "1rem", marginTop: "12px", textAlign: "left" }}>
                           MedSchool Simplified - Empowering Medical Education from Hyderabad, India.
                        </div>
                     </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 footer-col footer-links-col">
                     <div className="footer__widget">
                        <h4 className="footer__widget-title">
                           Useful Links
                        </h4>
                        <div className="footer__link">
                           <ul className="list-wrap">
                              <li><Link href="" className="footer-link">Terms and Conditions</Link></li>
                              <li><Link href="" className="footer-link">Privacy Policy</Link></li>
                              <li><Link href="" className="footer-link">Disclaimer</Link></li>
                           </ul>
                        </div>
                     </div>
                  </div>
                  <div className="col-xl-3 col-lg-3 col-md-6 col-sm-6 footer-col footer-company-col">
                     <div className="footer__widget">
                        <h4 className="footer__widget-title">
                           Our Company
                        </h4>
                        <div className="footer__link">
                           <ul className="list-wrap" style={{ paddingLeft: 0 }}>
                              <li style={{ width: "100%" }}>
                                 <Link href="/contact" className="footer-link" style={{ display: "block", width: "100%" }}>Contact Us</Link>
                              </li>
                              <li style={{ width: "100%" }}>
                                 <Link href="" className="footer-link" style={{ display: "block", width: "100%" }}>Blog</Link>
                              </li>
                              <li style={{ width: "100%" }}>
                                 <Link href="" className="footer-link" style={{ display: "block", width: "100%" }}>Instructor</Link>
                              </li>
                           </ul>
                        </div>
                     </div>
                  </div>
                  <div className="col-xl-4 col-lg-3 col-md-6 footer-col footer-newsletter-col">
                     <div className="footer__widget">
                        <h4 className="footer__widget-title" style={{ color: "#fff", fontFamily: "'Impact', Arial Black, sans-serif" }}>
                           Newsletter SignUp!
                        </h4>
                        <div className="footer__newsletter">
                           <p style={{ color: "rgba(255,255,255,0.9)" }}>Get the latest news delivered to your inbox</p>
                           <form onSubmit={(e) => e.preventDefault()} className="footer__newsletter-form">
                              <div style={{ display: "flex", gap: "10px", alignItems: "stretch" }}>
                                 <input 
                                    type="email" 
                                    placeholder="Type your E-mail"
                                    required
                                    style={{
                                       backgroundColor: "rgba(255,255,255,0.15)",
                                       backdropFilter: "blur(10px)",
                                       border: "1px solid rgba(255,255,255,0.2)",
                                       color: "#fff",
                                       borderRadius: "25px",
                                       padding: "12px 20px",
                                       flex: "1",
                                       outline: "none",
                                       textAlign: "left"
                                    }}
                                 />
                                 <button 
                                    type="submit"
                                    style={{
                                       background: "#5dba47",
                                       border: "2px solid #5dba47",
                                       borderRadius: "10px",
                                       color: "#fff",
                                       padding: "12px 24px",
                                       fontWeight: "600",
                                       fontSize: "1rem",
                                       transition: "all 0.3s ease",
                                       cursor: "pointer",
                                       whiteSpace: "nowrap",
                                       textAlign: "left"
                                    }}
                                    onMouseEnter={(e) => {
                                       e.currentTarget.style.background = "rgba(13,68,122,0.8)";
                                       e.currentTarget.style.transform = "translateY(-2px)";
                                       e.currentTarget.style.borderColor = "#fff";
                                    }}
                                    onMouseLeave={(e) => {
                                       e.currentTarget.style.background = "#0d447a";
                                       e.currentTarget.style.transform = "translateY(0)";
                                       e.currentTarget.style.borderColor = "rgba(255,255,255,0.2)";
                                    }}
                                 >
                                    Subscribe
                                 </button>
                              </div>
                           </form>
                           <div className="footer__social-wrap">
                              <h6 className="title" style={{ color: "#fff" }}>Follow Us:</h6>
                           </div>
                           <ul className="list-wrap footer__social footer__social-two">
                              <Social />
                           </ul>
                        </div>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <div className="footer__bottom-two">
            <div className="container">
               <div className="row align-items-center">
                  <div className="col-md-12">
                     <div className="copy-right-text text-center">
                        <p style={{ color: "rgba(255,255,255,0.9)", margin: 0 }}>© 2025 FOTINO. All rights reserved.</p>
                     </div>
                  </div>
               </div>
            </div>
         </div>
         <style jsx>{`
            .footer-row {
               display: flex;
               flex-wrap: wrap;
               align-items: stretch;
               justify-content: space-between;
               gap: 0;
            }
            .footer-col {
               display: flex;
               flex-direction: column;
               justify-content: flex-start;
               align-items: flex-start;
               min-width: 220px;
               margin-bottom: 32px;
               height: 100%;
            }
            .footer-logo-col {
               align-items: flex-start;
               justify-content: flex-start;
               min-width: 180px;
               max-width: 220px;
            }
            .footer-links-col, .footer-company-col {
               align-items: flex-start;
               justify-content: flex-start;
               min-width: 180px;
               max-width: 260px;
            }
            .footer-newsletter-col {
               align-items: flex-start;
               justify-content: flex-start;
               min-width: 220px;
               max-width: 340px;
            }
            .footer__widget-title {
               color: #fff !important;
               font-family: 'Poppins', 'Impact', Arial Black, sans-serif !important;
               font-size: 1.25rem !important;
               font-weight: 700 !important;
               margin-bottom: 18px !important;
               letter-spacing: 1px;
               text-align: left;
            }
            .footer-link {
               color: rgba(255,255,255,0.85) !important;
               font-size: 1rem;
               font-weight: 500;
               transition: color 0.3s;
               text-align: left;
               display: inline-block;
            }
            .footer-link:hover {
               color: #5dba47 !important;
            }
            .footer__newsletter-form input {
               background-color: rgba(255,255,255,0.15);
               border: 1px solid rgba(255,255,255,0.2);
               color: #fff;
               border-radius: 25px;
               padding: 12px 20px;
               outline: none;
               font-size: 1rem;
               text-align: left;
            }
            .footer__newsletter-form input::placeholder {
               color: rgba(255,255,255,0.7) !important;
            }
            .footer__newsletter-form input:focus {
               border-color: #5dba47 !important;
               background: rgba(255,255,255,0.22) !important;
               box-shadow: 0 0 0 2px #5dba4740 !important;
            }
            .footer__newsletter-form button {
               background: #5dba47;
               border: 2px solid #5dba47;
               border-radius: 25px;
               color: #fff;
               padding: 12px 24px;
               font-weight: 600;
               font-size: 1rem;
               transition: all 0.3s ease;
               cursor: pointer;
               white-space: nowrap;
               text-align: left;
            }
            .footer__newsletter-form button:hover {
               background: #0d447a;
               border-color: #fff;
               color: #fff;
            }
            .footer__social-wrap .title {
               color: #fff;
               font-size: 1rem;
               font-weight: 600;
               margin-bottom: 8px;
               text-align: left;
            }
            .footer__social {
               display: flex;
               gap: 18px;
               margin-top: 8px;
               justify-content: flex-start;
            }
            .footer__social li a {
               color: #fff !important;
               font-size: 1.3rem;
               transition: color 0.2s;
            }
            .footer__social li a:hover {
               color: #5dba47 !important;
            }
            .copy-right-text {
               padding: 12px 0 0 0;
            }
            @media (max-width: 1200px) {
               .footer-col {
                  min-width: 180px;
               }
            }
            @media (max-width: 768px) {
               .footer-row {
                  flex-direction: column;
                  align-items: stretch;
               }
               .footer-col {
                  min-width: 100%;
                  margin-bottom: 18px;
                  align-items: flex-start;
               }
               .footer__newsletter-form > div {
                  flex-direction: column !important;
                  gap: 15px !important;
               }
               .footer__newsletter-form input,
               .footer__newsletter-form button {
                  width: 100% !important;
               }
               .copy-right-text {
                  text-align: center;
                  padding: 8px 0 0 0;
               }
            }
         `}</style>
      </footer>
   )
}

export default FooterTwo
