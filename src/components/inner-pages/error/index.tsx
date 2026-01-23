import HeaderSeven from "@/layouts/headers/HeaderSeven";
import FooterTwo from "@/layouts/footers/FooterTwo";
import ErrorArea from "./ErrorArea";

const NotFound = () => {
  return (
    <>
      <HeaderSeven />
      <main className="main-area fix">
        <ErrorArea />
      </main>
      <FooterTwo />
    </>
  );
};

export default NotFound;
