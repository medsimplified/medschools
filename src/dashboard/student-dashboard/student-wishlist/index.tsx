import FooterTwo from '@/layouts/footers/FooterTwo'
import HeaderSeven from '@/layouts/headers/HeaderSeven'
import StudentWishlistArea from './StudentWishlistArea'

const StudentWishlist = () => {
   return (
      <>
         {/* <HeaderSeven /> */}
         <main className="main-area fix">
            <StudentWishlistArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default StudentWishlist
