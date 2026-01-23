import Instructors from "@/components/inner-pages/instructors/instructor";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Instructors Dr.Bhanu Prakash Online Educational Platform",
};
const index = () => {
   return (
      <Wrapper>
         <Instructors />
      </Wrapper>
   )
}

export default index