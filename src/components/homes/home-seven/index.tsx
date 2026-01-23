"use client";

import dynamic from "next/dynamic";
import Courses from "./Courses";
import Cta from "./Cta";
import Choose from "./Choose";
import Categories from "./Categories";
import Testimonial from "./Testimonial";
import Newsletter from "./Newsletter";
import FooterTwo from "@/layouts/footers/FooterTwo";
import HeaderSeven from "@/layouts/headers/HeaderSeven";
import Categories1 from "./Categories1";
import Counter from "./FactArea";

const Banner = dynamic(() => import("./Banner"), { ssr: false });

const HomeSeven = () => {
  return (
    <>
      <HeaderSeven />
      <main className="main-area fix">
        <Banner />
        <Courses />
        <Cta />
        <Choose />
        <Categories />
        <Counter />
        <Categories1 />
        <Testimonial />
        <Newsletter />
      </main>
    </>
  );
};

export default HomeSeven;
