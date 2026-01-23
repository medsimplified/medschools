import FooterTwo from '@/layouts/footers/FooterTwo'
import HeaderSeven from '@/layouts/headers/HeaderSeven'
import InstructorHistoryArea from './InstructorHistoryArea'

const InstructorHistory = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <InstructorHistoryArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default InstructorHistory
