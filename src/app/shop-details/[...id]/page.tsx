import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import ProductDetailsArea from "@/components/inner-shop/product-details/ProductDetailsArea";
import product_data from "@/data/inner-data/InnerCourseData";
import FooterTwo from "@/layouts/footers/FooterTwo";
import HeaderSeven from "@/layouts/headers/HeaderSeven";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Shop Details | Explore Medical Courses - MedSchools",
};

const index = async ({ params }: { params: Promise<{ id: string }> }) => {
   const { id } = await params;
   
   const products = product_data;
   const single_product = products.find((item) => Number(item.id) === Number(id));

   return (
      <Wrapper>
         <HeaderSeven />
         <main className="main-area fix">
            <BreadcrumbOne title="Course Details" sub_title="Course Details" />
            <ProductDetailsArea single_product={single_product} />
         </main>
         <FooterTwo />
      </Wrapper>
   )
}

export default index