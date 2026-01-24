import Blog from "@/components/blogs/blog";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
   title: "Medical Education Blog | Tips, Resources & Exam Prep - MedSchools",
};
const index = () => {
   return (
      <Wrapper>
         <Blog />
      </Wrapper>
   )
}

export default index