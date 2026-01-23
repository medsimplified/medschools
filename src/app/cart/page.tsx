import Cart from "@/components/inner-shop/cart";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Cart Dr.Bhanu Prakash Online Educational Platform",
};
const page = () => {
   return (
      <Wrapper>
         <Cart />
      </Wrapper>
   )
}

export default page