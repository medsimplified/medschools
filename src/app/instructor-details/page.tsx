import InstructorsDetails from "@/components/inner-pages/instructors/instructor-details";
import Wrapper from "@/layouts/Wrapper";
import AuthGuard from "@/components/common/AuthGuard";

export const metadata = {
   title: "Instructors Details | Explore Our Medical Experts - MedSchools",
};

export default function Page() {
   return (
      <AuthGuard>
         <Wrapper>
            <InstructorsDetails />
         </Wrapper>
      </AuthGuard>
   );
}