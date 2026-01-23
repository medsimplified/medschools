import HeaderOne from "@/layouts/headers/HeaderOne";
import PricingArea from "@/components/inner-pages/pricing/PricingArea";
import FooterTwo from "@/layouts/footers/FooterTwo";
import HeaderSeven from "@/layouts/headers/HeaderSeven";

export const metadata = {
  title: "Pricing Plans - Med School Simplified",
};

const PricingPage = () => {
  return (
    <>
      <HeaderSeven />
      <main className="main-area fix">
        <PricingArea />
      </main>
      {/* <FooterTwo /> */}
    </>
  );
};

export default PricingPage;
