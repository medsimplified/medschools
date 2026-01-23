import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne"
import ProductDetailsArea from "./ProductDetailsArea"
import FooterTwo from "@/layouts/footers/FooterTwo"
import HeaderSeven from "@/layouts/headers/HeaderSeven"

const ProductDetails = () => {
  return (
    <>
      < HeaderSeven />
      <main className="main-area fix">
        <BreadcrumbOne title="Course Details" sub_title="Course Details" />
        <ProductDetailsArea />
      </main>
      <FooterTwo />
    </>
  )
}

export default ProductDetails
