import StudentReview from "@/dashboard/student-dashboard/student-review";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Student Review | Provide Feedback on Medical Courses - MedSchools",
};
const index = () => {
   return (
      <Wrapper>
         <StudentReview />
      </Wrapper>
   )
}

export default index