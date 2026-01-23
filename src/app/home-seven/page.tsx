import dynamic from "next/dynamic";
import Wrapper from "@/layouts/Wrapper";

// ✅ Remove ssr: false to work with Server Components
const HomeSeven = dynamic(() => import("@/components/homes/home-seven"));

export const metadata = {
  title: "Home Seven Dr.Bhanu Prakash Online Educational Platform",
};

const Page = () => {
  return (
    <Wrapper>
      <HomeSeven />
    </Wrapper>
  );
};

export default Page;
