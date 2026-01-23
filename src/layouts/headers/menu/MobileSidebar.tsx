import Image from "next/image"
import Link from "next/link"
import MobileMenu from "./MobileMenu"
import { FaSearch, FaFacebookF, FaTwitter, FaInstagram, FaLinkedinIn, FaYoutube, FaTimes } from "@/lib/fontAwesomeIconsComplete"

// Use the original logo file
import logo from "@/assets/img/logo/MSS Logo-V1-02.png"

const MobileSidebar = ({ isActive, setIsActive }: any) => {

   return (
      <div className={isActive ? "mobile-menu-visible" : ""}>
         <div className="tgmobile__menu">
            <nav className="tgmobile__menu-box">
               <div onClick={() => setIsActive(false)} className="close-btn"><FaTimes /></div>
               <div className="nav-logo">
                  <Link href="/"><Image src={logo} alt="Logo" /></Link>
               </div>
               <div className="tgmobile__search">
                  <form action="#">
                     <input type="text" placeholder="Search here..." />
                     <button><FaSearch /></button>
                  </form>
               </div>
               <div className="tgmobile__menu-outer">
                  <MobileMenu />
               </div>
               <div className="social-links">
                  <ul className="list-wrap">
                     <li><Link href="#"><FaFacebookF /></Link></li>
                     <li><Link href="#"><FaTwitter /></Link></li>
                     <li><Link href="#"><FaInstagram /></Link></li>
                     <li><Link href="#"><FaLinkedinIn /></Link></li>
                     <li><Link href="#"><FaYoutube /></Link></li>
                  </ul>
               </div>
            </nav>
         </div>
         <div className="tgmobile__menu-backdrop"></div>
      </div>
   )
}

export default MobileSidebar
