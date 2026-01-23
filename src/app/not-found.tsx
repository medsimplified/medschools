// filepath: src/app/not-found.tsx
import NotFound from "@/components/inner-pages/error";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "Dr.Bhanu Prakash Online Educational Platform",
};

export default function NotFoundPage() {
  return (
    <Wrapper>
      <NotFound />
    </Wrapper>
  );
}
