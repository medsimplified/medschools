import HeaderSeven from "@/layouts/headers/HeaderSeven"
import FooterTwo from "@/layouts/footers/FooterTwo"
import InstructorDetailsArea from "./InstructorDetailsArea"
import BreadcrumbTwo from "@/components/common/breadcrumb/BreadcrumbTwo"

const InstructorsDetails = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <BreadcrumbTwo title="Robert Fox" sub_title="Instructors" />
            <InstructorDetailsArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default InstructorsDetails
