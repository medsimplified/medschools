import StudentProfile from "@/dashboard/student-dashboard/student-profile";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Student Profile Dr.Bhanu Prakash Online Educational Platform",
};
const index = () => {
   return (
      <Wrapper>
         <StudentProfile />
      </Wrapper>
   )
}

export default index