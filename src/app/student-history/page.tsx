import StudentHistory from "@/dashboard/student-dashboard/student-history";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Student History Dr.Bhanu Prakash Online Educational Platform",
};
const index = () => {
   return (
      <Wrapper>
         <StudentHistory />
      </Wrapper>
   )
}

export default index