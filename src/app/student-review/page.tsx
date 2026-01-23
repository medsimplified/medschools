import StudentReview from "@/dashboard/student-dashboard/student-review";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Student Review Dr.Bhanu Prakash Online Educational Platform",
};
const index = () => {
   return (
      <Wrapper>
         <StudentReview />
      </Wrapper>
   )
}

export default index