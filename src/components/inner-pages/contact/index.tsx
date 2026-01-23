import HeaderSeven from "@/layouts/headers/HeaderSeven"
import FooterTwo from "@/layouts/footers/FooterTwo"
import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne"
import ContactArea from "./ContactArea"

const Contact = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <BreadcrumbOne title="Contact With Us" sub_title="Contact" />
            <ContactArea />
         </main>
         {/* <FooterTwo /> */}
      </>
   )
}

export default Contact

