import Banner from "../home-seven/Banner"
import CourseArea from "./CourseArea"
import Newsletter from "./Newsletter"
import Instructor from "./Instructor"
import Counter from "./Counter"
import FaqArea from "./FaqArea"
import Features from "./Features"
import InstructorTwo from "./InstructorTwo"
import Blog from "./Blog"
import FooterTwo from "@/layouts/footers/FooterTwo"
import HeaderSeven from "@/layouts/headers/HeaderSeven"
import Categories from "./Categories"
import Courses from "../home-seven/Courses"
import Cta from "../home-seven/Cta"
import Choose from "../home-seven/Choose"
import Categories1 from "../home-seven/Categories1"
import Testimonial from "../home-seven/Testimonial"
// import Faq from "../home-six/Faq"
const HomeOne = () => {
   return (
      <>
         {/* <HeaderSeven />
         <main className="main-area fix">
            <Banner />
            <Categories />
            <BrandOne />
            <About />
            <CourseArea />
            <Newsletter />
            <Instructor />
            <Counter />
            <FaqArea />
            <Features />
            <InstructorTwo />
            <Blog />
         </main>
         <FooterTwo /> */}
                  <main className="main-area fix">
                     <Banner />
                     {/* <Features /> */}
                     <Courses />
                     <Cta />
                     <Choose />
                     <Categories />
                     <Features/>
                     <Counter/>
                     {/* <Categories1/> */}
                     {/* <Instructor /> */}
                     <Testimonial />
                     {/* <BrandTwo /> */}
                     {/* <Blog /> */}
                     <Newsletter />
                  </main>
      </>
   )
}

export default HomeOne
