import StudentWishlist from "@/dashboard/student-dashboard/student-wishlist";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Student Wishlist Dr.Bhanu Prakash Online Educational Platform",
};
const index = () => {
   return (
      <Wrapper>
         <StudentWishlist />
      </Wrapper>
   )
}

export default index