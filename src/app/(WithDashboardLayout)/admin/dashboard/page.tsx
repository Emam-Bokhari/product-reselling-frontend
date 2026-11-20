export const dynamic = "force-dynamic";

import AdminOverview from "@/components/modules/Dashboard/AdminOverview";
import SalesAnalytics from "@/components/modules/Dashboard/Analytics/SalesAnalytics";
import {
  getMonthlySales,
  getTotalProductsAdded,
  getTotalPurchases,
  getTotalSales,
} from "@/services/Analytics";
import { getCurrentUser } from "@/services/Auth";
import { getAllBlogs } from "@/services/Blog";
import { getAllContacts } from "@/services/Contact";
import { getAllNewsLetters } from "@/services/NewsLetter";
import { getAllUsers, getMe } from "@/services/User";

export default async function AdminDashboardPage() {
  const [
    usersRes,
    blogsRes,
    contactsRes,
    newslettersRes,
    productsRes,
    purchasesRes,
    salesRes,
    monthlySalesRes,
    meRes,
    jwtUserRes,
  ] = await Promise.allSettled([
    getAllUsers().catch(() => ({ data: { result: [] } })),
    getAllBlogs().catch(() => ({ data: [] })),
    getAllContacts().catch(() => ({ data: [] })),
    getAllNewsLetters().catch(() => ({ data: [] })),
    getTotalProductsAdded().catch(() => ({ data: 0 })),
    getTotalPurchases().catch(() => ({ data: 0 })),
    getTotalSales().catch(() => ({ data: 0 })),
    getMonthlySales().catch(() => ({ data: [] })),
    getMe().catch(() => null),
    getCurrentUser().catch(() => null),
  ]);

  // Extract Users safely
  const rawUsers =
    usersRes.status === "fulfilled"
      ? usersRes.value?.data?.result ??
        (Array.isArray(usersRes.value?.data) ? usersRes.value.data : [])
      : [];
  const users = Array.isArray(rawUsers) ? rawUsers : [];

  // Extract Blogs safely
  const rawBlogs =
    blogsRes.status === "fulfilled"
      ? Array.isArray(blogsRes.value?.data)
        ? blogsRes.value.data
        : (blogsRes.value?.data?.result ?? [])
      : [];
  const blogs = Array.isArray(rawBlogs) ? rawBlogs : [];

  // Extract Contacts safely
  const rawContacts =
    contactsRes.status === "fulfilled"
      ? Array.isArray(contactsRes.value?.data)
        ? contactsRes.value.data
        : (contactsRes.value?.data?.result ?? [])
      : [];
  const contacts = Array.isArray(rawContacts) ? rawContacts : [];

  // Extract Newsletters safely
  const rawNewsletters =
    newslettersRes.status === "fulfilled"
      ? Array.isArray(newslettersRes.value?.data)
        ? newslettersRes.value.data
        : (newslettersRes.value?.data?.result ?? [])
      : [];
  const newsletters = Array.isArray(rawNewsletters) ? rawNewsletters : [];

  // Totals (prioritizing backend meta.total if paginated)
  type PaginatedRes = {
    data?: { meta?: { total?: number } };
    meta?: { total?: number };
  };
  const totalUsers =
    usersRes.status === "fulfilled"
      ? ((usersRes.value as PaginatedRes)?.data?.meta?.total ??
        (usersRes.value as PaginatedRes)?.meta?.total ??
        users.length)
      : 0;
  const totalBlogs =
    blogsRes.status === "fulfilled"
      ? ((blogsRes.value as PaginatedRes)?.data?.meta?.total ??
        (blogsRes.value as PaginatedRes)?.meta?.total ??
        blogs.length)
      : 0;
  const totalContacts =
    contactsRes.status === "fulfilled"
      ? ((contactsRes.value as PaginatedRes)?.data?.meta?.total ??
        (contactsRes.value as PaginatedRes)?.meta?.total ??
        contacts.length)
      : 0;
  const totalNewsletters =
    newslettersRes.status === "fulfilled"
      ? ((newslettersRes.value as PaginatedRes)?.data?.meta?.total ??
        (newslettersRes.value as PaginatedRes)?.meta?.total ??
        newsletters.length)
      : 0;

  // Metrics
  const totalProductsAdded =
    productsRes.status === "fulfilled" ? productsRes.value?.data ?? 0 : 0;
  const totalPurchases =
    purchasesRes.status === "fulfilled" ? purchasesRes.value?.data ?? 0 : 0;
  const totalSales =
    salesRes.status === "fulfilled" ? salesRes.value?.data ?? 0 : 0;
  const analyticsData =
    monthlySalesRes.status === "fulfilled"
      ? monthlySalesRes.value?.data ?? []
      : [];

  // Authenticated user
  const meData = meRes.status === "fulfilled" ? meRes.value?.data : null;
  const jwtUser = jwtUserRes.status === "fulfilled" ? jwtUserRes.value : null;
  const user = meData || jwtUser;

  return (
    <div className="space-y-8 pb-10">
      {/* 1. Admin KPI & Hero Control Center */}
      <AdminOverview
        user={user}
        totalUsers={totalUsers}
        totalBlogs={totalBlogs}
        totalContacts={totalContacts}
        totalNewsletters={totalNewsletters}
        totalProductsAdded={totalProductsAdded}
        totalSales={totalSales}
        totalPurchases={totalPurchases}
        recentUsers={users}
        recentContacts={contacts}
        recentBlogs={blogs}
      />

      {/* 2. Platform Sales & Trends Analytics */}
      <SalesAnalytics data={analyticsData} />
    </div>
  );
}
