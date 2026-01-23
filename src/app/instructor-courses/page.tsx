import InstructorCourses from "@/dashboard/instructor-dashboard/instructor-courses";
import Wrapper from "@/layouts/Wrapper";
import AuthGuard from "@/components/common/AuthGuard";

export const metadata = {
   title: "Instructor Courses Dr.Bhanu Prakash Online Educational Platform",
};

export default function Page() {
   return (
      <AuthGuard>
         <Wrapper>
            <InstructorCourses />
         </Wrapper>
      </AuthGuard>
   );
}