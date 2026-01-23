import FooterTwo from "@/layouts/footers/FooterTwo"
import HeaderSeven from "@/layouts/headers/HeaderSeven"
import CourseDetailsArea from "./CourseDetailsArea"
import BreadcrumbTwo from "@/components/common/breadcrumb/BreadcrumbTwo"
const CourseDetails = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <BreadcrumbTwo title="Resolving Conflicts Between Designers And Engineers" sub_title="Courses" />
            <CourseDetailsArea playlistId="your_playlist_id_here" />
         </main>
         <FooterTwo />
      </>
   )
}

export default CourseDetails
