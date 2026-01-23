import InstructorReview from "@/dashboard/instructor-dashboard/instructor-review";
import Wrapper from "@/layouts/Wrapper";
import AuthGuard from "@/components/common/AuthGuard";

export const metadata = {
   title: "Instructor Review Dr.Bhanu Prakash Online Educational Platform",
};

export default function Page() {
   return (
      <AuthGuard>
         <Wrapper>
            <InstructorReview />
         </Wrapper>
      </AuthGuard>
   );
}