import Wishlist from "@/components/inner-shop/wishlist";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Wishlist | Manage Your Medical Courses - MedSchools",
};
const index = () => {
   return (
      <Wrapper>
         <Wishlist />
      </Wrapper>
   )
}

export default index