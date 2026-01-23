import FooterTwo from '@/layouts/footers/FooterTwo'
import HeaderSeven from '@/layouts/headers/HeaderSeven'
import StudentHistoryArea from './StudentHistoryArea'

const StudentHistory = () => {
   return (
      <>
         {/* <HeaderSeven /> */}
         <main className="main-area fix">
            <StudentHistoryArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default StudentHistory

