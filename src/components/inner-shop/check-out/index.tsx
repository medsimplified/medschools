import HeaderSeven from "@/layouts/headers/HeaderSeven"
import CheckOutArea from "./CheckOutArea"
import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne"
import FooterTwo from "@/layouts/footers/FooterTwo"

const CheckOut = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <BreadcrumbOne title="check-out" sub_title="check-out" />
            <CheckOutArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default CheckOut
