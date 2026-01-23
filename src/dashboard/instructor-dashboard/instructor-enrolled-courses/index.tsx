import FooterTwo from '@/layouts/footers/FooterTwo'
import HeaderSeven from '@/layouts/headers/HeaderSeven'
import InstructorEnrolledCourseArea from './InstructorEnrolledCourseArea'

const InstructorEnrolledCourse = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <InstructorEnrolledCourseArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default InstructorEnrolledCourse
