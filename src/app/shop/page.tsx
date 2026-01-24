import Shop from "@/components/inner-shop/product";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Shop | Explore Medical Courses - MedSchools",
};
const index = () => {
   return (
      <Wrapper>
         <Shop />
      </Wrapper>
   )
}

export default index