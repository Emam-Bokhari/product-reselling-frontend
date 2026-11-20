export const dynamic = "force-dynamic";

import DashboardOverview from "@/components/modules/Dashboard";
import SalesAnalytics from "@/components/modules/Dashboard/Analytics/SalesAnalytics";
import RecentOrdersActivity from "@/components/modules/Dashboard/RecentActivity/RecentOrdersActivity";
import {
  getMonthlySales,
  getTotalProductsAdded,
  getTotalPurchases,
  getTotalSales,
} from "@/services/Analytics";
import { getCurrentUser } from "@/services/Auth";
import { getPurchaseHistory, getSalesHistory } from "@/services/Order";
import { getMe } from "@/services/User";

export default async function DashboardHomePage() {
  // Gracefully fetch all dashboard metrics & datasets in parallel
  const [
    productsRes,
    purchasesRes,
    salesRes,
    analyticsRes,
    userRes,
    currentUserRes,
    purchaseHistoryRes,
    salesHistoryRes,
  ] = await Promise.allSettled([
    getTotalProductsAdded().catch(() => ({ data: 0 })),
    getTotalPurchases().catch(() => ({ data: 0 })),
    getTotalSales().catch(() => ({ data: 0 })),
    getMonthlySales().catch(() => ({ data: [] })),
    getMe().catch(() => null),
    getCurrentUser().catch(() => null),
    getPurchaseHistory().catch(() => ({ data: { result: [] } })),
    getSalesHistory().catch(() => ({ data: { result: [] } })),
  ]);

  const totalProductsAdded =
    productsRes.status === "fulfilled" ? productsRes.value?.data ?? 0 : 0;
  const totalPurchases =
    purchasesRes.status === "fulfilled" ? purchasesRes.value?.data ?? 0 : 0;
  const totalSales =
    salesRes.status === "fulfilled" ? salesRes.value?.data ?? 0 : 0;
  const analyticsData =
    analyticsRes.status === "fulfilled" ? analyticsRes.value?.data ?? [] : [];

  const meData = userRes.status === "fulfilled" ? userRes.value?.data : null;
  const jwtUser = currentUserRes.status === "fulfilled" ? currentUserRes.value : null;
  const user = meData || jwtUser;

  const purchaseHistory =
    purchaseHistoryRes.status === "fulfilled"
      ? purchaseHistoryRes.value?.data?.result ??
        (Array.isArray(purchaseHistoryRes.value?.data)
          ? purchaseHistoryRes.value.data
          : [])
      : [];

  const salesHistory =
    salesHistoryRes.status === "fulfilled"
      ? salesHistoryRes.value?.data?.result ??
        (Array.isArray(salesHistoryRes.value?.data)
          ? salesHistoryRes.value.data
          : [])
      : [];

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Hero Welcome & KPI Metric Cards */}
      <DashboardOverview
        totalProductsAdded={totalProductsAdded}
        totalPurchases={totalPurchases}
        totalSales={totalSales}
        user={user}
      />

      {/* 2. Interactive Charts & Performance Section */}
      <SalesAnalytics data={analyticsData} />

      {/* 3. Recent Transactions & Marketplace Hub */}
      <RecentOrdersActivity
        purchaseHistory={purchaseHistory}
        salesHistory={salesHistory}
      />
    </div>
  );
}
