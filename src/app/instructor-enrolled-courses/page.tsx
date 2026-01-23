import InstructorEnrolledCourse from "@/dashboard/instructor-dashboard/instructor-enrolled-courses";
import Wrapper from "@/layouts/Wrapper";
import AuthGuard from "@/components/common/AuthGuard";

export const metadata = {
   title: "Instructor Enrolled Course Dr.Bhanu Prakash Online Educational Platform",
};

export default function Page() {
   return (
      <AuthGuard>
         <Wrapper>
            <InstructorEnrolledCourse />
         </Wrapper>
      </AuthGuard>
   );
}