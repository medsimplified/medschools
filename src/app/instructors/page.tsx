import Instructors from "@/components/inner-pages/instructors/instructor";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Instructors | Explore Our Medical Experts - MedSchools",
};
const index = () => {
   return (
      <Wrapper>
         <Instructors />
      </Wrapper>
   )
}

export default index