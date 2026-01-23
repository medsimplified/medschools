"use client";

import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import FooterTwo from "@/layouts/footers/FooterTwo";
import HeaderSeven from "@/layouts/headers/HeaderSeven";
import dynamic from "next/dynamic";

const CartArea = dynamic(() => import("./CartArea"), { ssr: false });

const Cart = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <BreadcrumbOne title="Cart" sub_title="Cart" />
            <CartArea />
         </main>
         <FooterTwo />
      </>
   );
};

export default Cart;
