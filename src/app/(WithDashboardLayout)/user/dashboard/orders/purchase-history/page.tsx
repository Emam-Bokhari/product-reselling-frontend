export const dynamic = "force-dynamic";

import PurchaseHistory from "@/components/modules/Dashboard/Orders/PurchaseHistory";
import { getPurchaseHistory } from "@/services/Order";

export default async function PurchaseHistoryPage() {
  const res = await getPurchaseHistory().catch(() => null);
  const purchaseHistory =
    res?.data?.result ?? (Array.isArray(res?.data) ? res.data : []);
  return (
    <div className="space-y-6">
      <PurchaseHistory purchaseHistory={purchaseHistory} />
    </div>
  );
}
