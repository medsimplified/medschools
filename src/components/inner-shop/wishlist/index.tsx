import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne"
import HeaderSeven from "@/layouts/headers/HeaderSeven"
import WishlistArea from "./WishlistArea"
import FooterTwo from "@/layouts/footers/FooterTwo"

const Wishlist = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <BreadcrumbOne title="Wishlist" sub_title="Wishlist" />
            <WishlistArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default Wishlist
