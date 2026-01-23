import Image from "next/image";
import Link from "next/link";
import BlogAuthor from "./BlogAuthor";
import BlogPostComment from "./BlogPostComment";
import BlogForm from "@/forms/BlogForm";
import BlogSidebar from "../blog-common/BlogSidebar";
import { FaFacebookF, FaLinkedinIn, FaPinterestP, FaTwitter, FaCalendarAlt, FaUser } from "@/lib/fontAwesomeIconsComplete";

type Blog = {
  id: number;
  title: string;
  content: string;
  author: string;
  date: string;
  tags: string[];
  image: string;
};

const BlogDetailsArea = ({ blog }: { blog: Blog }) => {
  if (!blog) {
    return <div>Blog not found.</div>;
  }
  return (
    <section className="blog-details-area section-py-120">
      <div className="container">
        <div className="row">
          <div className="col-xl-9 col-lg-8">
            <div className="blog__details-wrapper">
              <div className="blog__details-thumb">
                {blog.image && (
                  <Image src={blog.image} alt={blog.title} width={800} height={400} style={{ width: "100%", height: "auto" }} />
                )}
              </div>
              <div className="blog__details-content">
                <div className="blog__post-meta">
                  <ul className="list-wrap">
                    <li>
                      <FaCalendarAlt />{" "}
                      {blog.date ? new Date(blog.date).toLocaleDateString() : ""}
                    </li>
                    <li>
                      <FaUser /> by {blog.author}
                    </li>
                  </ul>
                </div>
                <h3 className="title">{blog.title}</h3>
                <div dangerouslySetInnerHTML={{ __html: blog.content }} />
                <div className="blog__details-bottom">
                  <div className="row align-items-center">
                    <div className="col-xl-6 col-md-7">
                      <div className="tg-post-tag">
                        <h5 className="tag-title">Tags :</h5>
                        <ul className="list-wrap p-0 mb-0">
                          {blog.tags.map((tag, idx) => (
                            <li key={idx}><Link href="#">{tag}</Link></li>
                          ))}
                        </ul>
                      </div>
                    </div>
                    <div className="col-xl-6 col-md-5">
                      <div className="tg-post-social justify-content-start justify-content-md-end">
                        <h5 className="social-title">Share :</h5>
                        <ul className="list-wrap p-0 mb-0">
                          <li><Link href="#"><FaFacebookF aria-hidden /></Link></li>
                          <li><Link href="#"><FaTwitter aria-hidden /></Link></li>
                          <li><Link href="#"><FaLinkedinIn aria-hidden /></Link></li>
                          <li><Link href="#"><FaPinterestP aria-hidden /></Link></li>
                        </ul>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <BlogAuthor author={blog.author} image={blog.image} />
            {/* <div className="blog-post-comment">
              <BlogPostComment />
              <BlogForm />
            </div> */}
          </div>
          <BlogSidebar />
        </div>
      </div>
    </section>
  );
};

export default BlogDetailsArea;
