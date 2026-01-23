import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne"
import FooterTwo from "@/layouts/footers/FooterTwo"
import HeaderSeven from "@/layouts/headers/HeaderSeven"
import ProductArea from "./ProductArea"

const Product = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <BreadcrumbOne title="Shop Page" sub_title="Shop Page" />
            <ProductArea />
         </main>
         <FooterTwo />
      </>
   )
}

export default Product
