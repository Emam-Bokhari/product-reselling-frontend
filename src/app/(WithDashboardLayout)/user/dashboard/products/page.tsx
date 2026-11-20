export const dynamic = "force-dynamic";

import ManageProducts from "@/components/modules/Dashboard/Products";
import { getProductsByUser } from "@/services/Product";

export default async function ProductsManagementPage() {
  const res = await getProductsByUser().catch(() => ({ data: [] }));
  const products = res?.data ?? [];

  return (
    <div className="space-y-6">
      <ManageProducts products={products} />
    </div>
  );
}
