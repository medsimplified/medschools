import ProductDetails from "@/components/inner-shop/product-details";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Shop Details | Explore Medical Courses - MedSchools",
};
const index = () => {
   return (
      <Wrapper>
         <ProductDetails />
      </Wrapper>
   )
}

export default index