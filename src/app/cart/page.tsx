import Cart from "@/components/inner-shop/cart";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Shopping Cart | Review Your Medical Courses - MedSchools",
};
const page = () => {
   return (
      <Wrapper>
         <Cart />
      </Wrapper>
   )
}

export default page