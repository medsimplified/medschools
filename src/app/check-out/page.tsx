import CheckOut from "@/components/inner-shop/check-out";
import Wrapper from "@/layouts/Wrapper";

export const metadata = {
  title: "CheckOut Dr.Bhanu Prakash Online Educational Platform",
};

// 🚫 Do not statically prerender this page at build time
export const dynamic = "force-dynamic";
export const revalidate = 0;

export default function CheckOutPage() {
  return (
    <Wrapper>
      <CheckOut />
    </Wrapper>
  );
}
