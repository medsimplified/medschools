import StudentProfile from "@/dashboard/student-dashboard/student-profile";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Student Profile | Manage Your Medical Courses - MedSchools",
};
const index = () => {
   return (
      <Wrapper>
         <StudentProfile />
      </Wrapper>
   )
}

export default index