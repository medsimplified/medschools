import HeaderSeven from "@/layouts/headers/HeaderSeven"
import FooterTwo from "@/layouts/footers/FooterTwo"
import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne"
import BlogArea from "./BlogArea"

const Blog = () => {
   return (
      <>
         <HeaderSeven />
         <main className="main-area fix">
            <BreadcrumbOne title="Latest Blogs" sub_title="Blogs" />
            <BlogArea style_1={false} />
         </main>
         {/* <FooterTwo /> */}
      </>
   )
}

export default Blog

