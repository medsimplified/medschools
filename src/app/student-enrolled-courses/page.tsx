import StudentEnrolledCourses from "@/dashboard/student-dashboard/student-enrolled-courses";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Student Dashboard Dr.Bhanu Prakash Online Educational Platform",
};
const index = () => {
   return (
      <Wrapper>
         <StudentEnrolledCourses />
      </Wrapper>
   )
}

export default index