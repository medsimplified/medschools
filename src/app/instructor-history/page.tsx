import InstructorHistory from "@/dashboard/instructor-dashboard/instructor-history";
import Wrapper from "@/layouts/Wrapper";
import AuthGuard from "@/components/common/AuthGuard";

export const metadata = {
   title: "Instructor History Dr.Bhanu Prakash Online Educational Platform",
};

export default function Page() {
   return (
      <AuthGuard>
         <Wrapper>
            <InstructorHistory />
         </Wrapper>
      </AuthGuard>
   );
}