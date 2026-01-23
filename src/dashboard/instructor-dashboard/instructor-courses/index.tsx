import FooterTwo from '@/layouts/footers/FooterTwo'
import HeaderSeven from '@/layouts/headers/HeaderSeven'
import InstructorEnrolledCourseArea from '../instructor-enrolled-courses/InstructorEnrolledCourseArea'

const InstructorCourses = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <InstructorEnrolledCourseArea style={true} />
         </main>
         <FooterTwo />
      </>
   )
}

export default InstructorCourses
