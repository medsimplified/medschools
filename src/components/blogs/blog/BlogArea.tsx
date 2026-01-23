"use client"
import Image from "next/image"
import Link from "next/link"
import { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import BlogSidebar from "../blog-common/BlogSidebar";
import { FaCalendarAlt, FaUser } from "@/lib/fontAwesomeIconsComplete";

const itemsPerPage = 12;

const BlogArea = ({ style_1 }: any) => {
   const [blogs, setBlogs] = useState<any[]>([]);
   const [itemOffset, setItemOffset] = useState(0);

   useEffect(() => {
      const fetchBlogs = async () => {
         try {
            const res = await fetch("/api/blogs");
            const data = await res.json();
            setBlogs(Array.isArray(data) ? data : []);
         } catch {
            setBlogs([]);
         }
      };
      fetchBlogs();
   }, []);

   const endOffset = itemOffset + itemsPerPage;
   const currentItems = blogs.slice(itemOffset, endOffset);
   const pageCount = Math.ceil(blogs.length / itemsPerPage);

   const handlePageClick = (event: any) => {
      const newOffset = (event.selected * itemsPerPage) % blogs.length;
      setItemOffset(newOffset);
   };

   return (
      <section className="blog-area section-py-120">
         <div className="container">
            <div className="row">
               <div className={`col-xl-9 col-lg-8 ${style_1 ? "order-0 order-lg-2" : ""}`}>
                  <div className="row gutter-20">
                     {currentItems.length === 0 && (
                        <div className="col-12 text-center py-5">
                           <p>No blogs found.</p>
                        </div>
                     )}
                     {currentItems.map((item) => (
                        <div key={item.id} className="col-xl-4 col-md-6">
                           <div className="blog__post-item shine__animate-item">
                              <div className="blog__post-thumb">
                                 <Link href={`/blog/${item.id}`} className="shine__animate-link">
                                    {item.image ? (
                                       <Image src={item.image} alt={item.title} width={400} height={250} />
                                    ) : (
                                       <div style={{width: "100%", height: 200, background: "#eee"}} />
                                    )}
                                 </Link>
                                 <span className="post-tag">{item.tags?.[0] || "Blog"}</span>
                              </div>
                              <div className="blog__post-content">
                                 <div className="blog__post-meta">
                                    <ul className="list-wrap">
                                       <li>
                                          <FaCalendarAlt />
                                          {item.date ? new Date(item.date).toLocaleDateString() : ""}
                                       </li>
                                       <li>
                                          <FaUser />
                                          by {item.author || "Admin"}
                                       </li>
                                    </ul>
                                 </div>
                                 <h4 className="title">
                                    <Link href={`/blog/${item.id}`}>{item.title}</Link>
                                 </h4>
                              </div>
                           </div>
                        </div>
                     ))}
                  </div>
                  <nav className="pagination__wrap mt-25">
                     <ReactPaginate
                        breakLabel="..."
                        onPageChange={handlePageClick}
                        pageRangeDisplayed={3}
                        pageCount={pageCount}
                        renderOnZeroPageCount={null}
                        className="list-wrap"
                     />
                  </nav>
               </div>
               <BlogSidebar style_1={style_1} />
            </div>
         </div>
      </section>
   )
}

export default BlogArea