
import InstructorWishlist from "@/dashboard/instructor-dashboard/instructor-wishlist";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Instructor Wishlist | Manage Your Wishlist - MedSchools",
};

export default function Page() {
   return (
      <Wrapper>
         <InstructorWishlist />
      </Wrapper>
   );
}