// filepath: src/app/not-found.tsx
import NotFound from "@/components/inner-pages/error";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Page Not Found | MedSchool Simplified",
  description: "The page you are looking for could not be found. Return to MedSchool Simplified to continue your medical education journey.",
  robots: "noindex, nofollow",
};

export default function NotFoundPage() {
  return (
    <Wrapper>
      <NotFound />
    </Wrapper>
  );
}
