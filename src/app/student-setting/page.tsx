import StudentSetting from "@/dashboard/student-dashboard/student-setting";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Student Setting | Manage Your Medical Courses - MedSchools",
};
const index = () => {
   return (
      <Wrapper>
         <StudentSetting />
      </Wrapper>
   )
}

export default index