import InstructorSetting from "@/dashboard/instructor-dashboard/instructor-setting";
import Wrapper from "@/layouts/Wrapper";
import AuthGuard from "@/components/common/AuthGuard";

export const metadata = {
   title: "Instructor Setting Dr.Bhanu Prakash Online Educational Platform",
};

export default function Page() {
   return (
      <AuthGuard>
         <Wrapper>
            <InstructorSetting />
         </Wrapper>
      </AuthGuard>
   );
}