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
        totalUsers={users.length}
        totalBlogs={blogs.length}
        totalContacts={contacts.length}
        totalNewsletters={newsletters.length}
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
