import FooterTwo from '@/layouts/footers/FooterTwo'
import HeaderSeven from '@/layouts/headers/HeaderSeven'
import StudentProfileArea from './StudentProfileArea'

const StudentProfile = () => {
   return (
      <>
         {/* <HeaderSeven /> */}
         <main className="main-area fix">
            <StudentProfileArea />
         </main>
         <FooterTwo/>
      </>
   )
}

export default StudentProfile
