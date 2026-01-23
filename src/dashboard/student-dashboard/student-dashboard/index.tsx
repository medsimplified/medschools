import FooterTwo from '@/layouts/footers/FooterTwo'
import HeaderSeven from '@/layouts/headers/HeaderSeven'
import StudentDashboardArea from './StudentDashboardArea'

const StudentDashboard = () => {
   return (
      <>
         {/* <HeaderSeven /> */}
         <main className="main-area fix">
            <StudentDashboardArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default StudentDashboard
