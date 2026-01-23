import HeaderSeven from "@/layouts/headers/HeaderSeven";
import FooterTwo from "@/layouts/footers/FooterTwo";
import BreadcrumbOne from "@/components/common/breadcrumb/BreadcrumbOne";
import BlogDetailsArea from "./BlogDetailsArea";

type Blog = {

  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  image: string;
};

interface BlogDetailsProps {
  blog: Blog;
}

const BlogDetails = ({ blog }: BlogDetailsProps) => {
  return (
    <>
      <HeaderSeven />
      <main className="main-area fix">
        {/* <BreadcrumbOne title="Blog Details" sub_title="Blogs" sub_title_2="How To Become Ridiculously Self-Aware In 20 Minutes" style={true} /> */}
        <BlogDetailsArea blog={blog} />
      </main>
      <FooterTwo />
    </>
  );
};

export default BlogDetails;