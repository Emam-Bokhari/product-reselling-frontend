export const dynamic = "force-dynamic";

import SalesHistory from "@/components/modules/Dashboard/Orders/SalesHistory";
import { getSalesHistory } from "@/services/Order";

export default async function SalesHistoryPage() {
  const res = await getSalesHistory().catch(() => null);
  const salesHistory =
    res?.data?.result ?? (Array.isArray(res?.data) ? res.data : []);
  return (
    <div className="space-y-6">
      <SalesHistory salesHistory={salesHistory} />
    </div>
  );
}
