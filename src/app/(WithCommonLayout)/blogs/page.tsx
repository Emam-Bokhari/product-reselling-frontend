export const dynamic = "force-dynamic";

import AllBlogs from "@/components/modules/Blog";
import { getAllBlogs } from "@/services/Blog";
import { TBlog } from "@/types";
import { Fragment } from "react";

export default async function BlogsPage() {
  let blogs: TBlog[] = [];

  try {
    const res = await getAllBlogs();
    blogs = res?.data || [];
  } catch (error) {
    console.error("Failed to load blogs on blogs page:", error);
  }

  return (
    <Fragment>
      <AllBlogs blogs={blogs} />
    </Fragment>
  );
}
