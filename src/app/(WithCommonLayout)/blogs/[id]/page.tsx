import { Fragment } from "react";
import { TBlog } from "@/types";
import { getBlogById, getAllBlogs } from "@/services/Blog";
import BlogDetails from "@/components/modules/Blog/BlogDetails";
import { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  try {
    const blogRes = await getBlogById(id).catch(() => null);
    const blog: TBlog = blogRes?.data;

    if (!blog) {
      return {
        title: "Blog Details | ResellBD",
        description: "Read latest technology and resell blogs on ResellBD",
      };
    }

    return {
      title: `${blog.title} | ResellBD Blog`,
      description:
        blog.introduction?.slice(0, 160) ||
        "Read latest insights and guides on ResellBD.",
      openGraph: {
        title: blog.title,
        description: blog.introduction,
        images: blog.thumbnail ? [{ url: blog.thumbnail }] : [],
      },
    };
  } catch {
    return {
      title: "Blog Details | ResellBD",
    };
  }
}

export default async function BlogDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const [blogResponse, allBlogsResponse] = await Promise.all([
    getBlogById(id).catch(() => null),
    getAllBlogs().catch(() => null),
  ]);

  const blog: TBlog = blogResponse?.data;
  const allBlogs: TBlog[] = allBlogsResponse?.data || [];
  const relatedBlogs = allBlogs
    .filter((b) => b?._id !== id)
    .slice(0, 3);

  return (
    <Fragment>
      <BlogDetails blog={blog} relatedBlogs={relatedBlogs} />
    </Fragment>
  );
}
