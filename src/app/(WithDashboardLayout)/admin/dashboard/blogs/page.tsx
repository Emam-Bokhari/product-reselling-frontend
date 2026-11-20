export const dynamic = "force-dynamic";

import ManageBlogs from "@/components/modules/Dashboard/Blogs";
import { getAllBlogs } from "@/services/Blog";

export default async function BlogsManagementPage() {
  const response = await getAllBlogs().catch(() => ({ data: [] }));
  const blogs = response?.data ?? [];

  return (
    <div className="space-y-6">
      <ManageBlogs blogs={blogs} />
    </div>
  );
}
