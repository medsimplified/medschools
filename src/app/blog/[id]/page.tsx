import BlogDetails from "@/components/blogs/blog-details";
import prisma from "lib/prisma";

interface PageProps {
  params: { id: string };
}

export default async function BlogDetailPage({ params }: PageProps) {
  const blog = await prisma.blog.findUnique({ where: { id: Number(params.id) } });
  if (!blog) return <div>Not found</div>;
  // Convert date to string for type compatibility
  return <BlogDetails blog={{ ...blog, date: blog.date.toISOString() }} />;
}