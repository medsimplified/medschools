"use client"
import UseSticky from "@/hooks/UseSticky";
import { useState, useEffect } from "react";
import { FaArrowUp } from "@/lib/fontAwesomeIconsComplete";

const ScrollToTop = () => {
   const { sticky }: { sticky: boolean } = UseSticky();

   const [showScroll, setShowScroll] = useState(false);

   const checkScrollTop = () => {
      if (!showScroll && window.pageYOffset > 400) {
         setShowScroll(true);
      } else if (showScroll && window.pageYOffset <= 400) {
         setShowScroll(false);
      }
   };

   const scrollTop = () => {
      window.scrollTo({ top: 0, behavior: "smooth" });
   };

   useEffect(() => {
      const checkScrollTop = () => {
         if (!showScroll && window.pageYOffset > 400) {
            setShowScroll(true);
         } else if (showScroll && window.pageYOffset <= 400) {
            setShowScroll(false);
         }
      };

      window.addEventListener("scroll", checkScrollTop);
      return () => window.removeEventListener("scroll", checkScrollTop);
   }, [showScroll]);

   return (
      <>
         <button
            aria-label="Back to top"
            onClick={scrollTop}
            className={`scroll__top scroll-to-target ${sticky ? "open" : ""}`}
            data-target="html"
         >
            <FaArrowUp />
         </button>
      </>
   )
}

export default ScrollToTop;
