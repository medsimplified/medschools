import FooterTwo from '@/layouts/footers/FooterTwo'
import HeaderSeven from '@/layouts/headers/HeaderSeven'
import StudentEnrolledCoursesArea from './StudentEnrolledCoursesArea'

const StudentEnrolledCourses = () => {
   return (
      <>
         {/* <HeaderSeven /> */}
         <main className="main-area fix">
            <StudentEnrolledCoursesArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default StudentEnrolledCourses
