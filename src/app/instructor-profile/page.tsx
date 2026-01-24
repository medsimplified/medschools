import InstructorProfile from "@/dashboard/instructor-dashboard/profile";
import Wrapper from "@/layouts/Wrapper";
import AuthGuard from "@/components/common/AuthGuard";

export const metadata = {
  title: "Instructor Profile | Manage Your Medical Profile - MedSchools",
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