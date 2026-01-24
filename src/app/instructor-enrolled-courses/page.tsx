import InstructorEnrolledCourse from "@/dashboard/instructor-dashboard/instructor-enrolled-courses";
import Wrapper from "@/layouts/Wrapper";
import AuthGuard from "@/components/common/AuthGuard";

export const metadata = {
   title: "Instructor Enrolled Courses | Review Your Medical Courses - MedSchools",
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