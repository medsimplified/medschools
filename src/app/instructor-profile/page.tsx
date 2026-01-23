import InstructorProfile from "@/dashboard/instructor-dashboard/profile";
import Wrapper from "@/layouts/Wrapper";
import AuthGuard from "@/components/common/AuthGuard";

export const metadata = {
  title: "Instructor Profile Dr.Bhanu Prakash Online Educational Platform",
};

export default function Page() {
  return (
    <AuthGuard>
      <Wrapper>
        <InstructorProfile />
      </Wrapper>
    </AuthGuard>
  );
}