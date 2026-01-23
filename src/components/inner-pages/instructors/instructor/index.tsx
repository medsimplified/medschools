import HeaderSeven from "@/layouts/headers/HeaderSeven"
import FooterTwo from "@/layouts/footers/FooterTwo"
import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne"
import InstructorArea from "./InstructorArea"

const Instructors = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <BreadcrumbOne title="All Instructors" sub_title="Instructors" />
            <InstructorArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default Instructors
