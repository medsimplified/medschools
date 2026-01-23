import FooterTwo from '@/layouts/footers/FooterTwo'
import HeaderSeven from '@/layouts/headers/HeaderSeven'
import InstructorWishlistArea from './InstructorWishlistArea'

const InstructorWishlist = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <InstructorWishlistArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default InstructorWishlist
