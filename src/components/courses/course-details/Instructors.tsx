import Image from "next/image"
import Link from "next/link"
import { FaFacebookF, FaInstagram, FaStar, FaTwitter, FaWhatsapp } from "@/lib/fontAwesomeIconsComplete"

import instructor_img from "@/assets/img/courses/course_instructors.png"

const Instructors = () => {
   return (
      <div className="courses__instructors-wrap">
         <div className="courses__instructors-thumb">
            <Image src={instructor_img} alt="img" />
         </div>
         <div className="courses__instructors-content">
            <h2 className="title">Mark Jukarberg</h2>
            <span className="designation">UX Design Lead</span>
            <p className="avg-rating"><FaStar aria-hidden />(4.8 Ratings)</p>
            <p>Dorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua Quis ipsum suspendisse ultrices gravida. Risus commodo viverra maecenas accumsan.</p>
            <div className="instructor__social">
               <ul className="list-wrap justify-content-start">
                  <li><Link href="#"><FaFacebookF aria-hidden /></Link></li>
                  <li><Link href="#"><FaTwitter aria-hidden /></Link></li>
                  <li><Link href="#"><FaWhatsapp aria-hidden /></Link></li>
                  <li><Link href="#"><FaInstagram aria-hidden /></Link></li>
               </ul>
            </div>
         </div>
      </div>
   )
}

export default Instructors
