import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Users,
  BookOpen,
  Mail,
  Send,
  Wallet,
  Package,
  Calendar,
  ShieldCheck,
  ArrowRight,
  FilePlus,
  UserCheck,
} from "lucide-react";
import Link from "next/link";
import { IUser } from "@/types/user";
import { TContact } from "@/types/contact";
import { TBlog } from "@/types/blog";

interface AdminOverviewProps {
  user?: {
    name?: string;
    role?: string;
    identifier?: string;
  } | null;
  totalUsers: number;
  totalBlogs: number;
  totalContacts: number;
  totalNewsletters: number;
  totalProductsAdded: number;
  totalSales: number;
  totalPurchases?: number;
  recentUsers: IUser[];
  recentContacts: TContact[];
  recentBlogs: TBlog[];
}

export default function AdminOverview({
  user,
  totalUsers = 0,
  totalBlogs = 0,
  totalContacts = 0,
  totalNewsletters = 0,
  totalProductsAdded = 0,
  totalSales = 0,
  totalPurchases = 0,
  recentUsers = [],
  recentContacts = [],
  recentBlogs = [],
}: AdminOverviewProps) {
  const adminName = user?.name || "Administrator";
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const metrics = [
    {
      title: "Registered Users",
      value: totalUsers.toLocaleString(),
      subtitle: "Total accounts on platform",
      icon: Users,
      iconColor: "text-blue-600 dark:text-blue-400",
      iconBg: "bg-blue-50 dark:bg-blue-950/40 ring-1 ring-blue-200 dark:ring-blue-800/60",
      href: "/admin/dashboard/users",
    },
    {
      title: "Blog Articles",
      value: totalBlogs.toLocaleString(),
      subtitle: "Published community articles",
      icon: BookOpen,
      iconColor: "text-emerald-600 dark:text-emerald-400",
      iconBg: "bg-emerald-50 dark:bg-emerald-950/40 ring-1 ring-emerald-200 dark:ring-emerald-800/60",
      href: "/admin/dashboard/blogs",
    },
    {
      title: "User Inquiries",
      value: totalContacts.toLocaleString(),
      subtitle: "Messages & support requests",
      icon: Mail,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-200 dark:ring-amber-800/60",
      href: "/admin/dashboard/contacts",
    },
    {
      title: "Newsletter Subs",
      value: totalNewsletters.toLocaleString(),
      subtitle: "Subscribers to marketing list",
      icon: Send,
      iconColor: "text-purple-600 dark:text-purple-400",
      iconBg: "bg-purple-50 dark:bg-purple-950/40 ring-1 ring-purple-200 dark:ring-purple-800/60",
      href: "/admin/dashboard/newsLetters",
    },
    {
      title: "Total Revenue / Sales",
      value: `৳ ${Number(totalSales).toLocaleString()}`,
      subtitle: `${totalPurchases} purchases completed`,
      icon: Wallet,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-200 dark:ring-amber-800/60",
      href: "/user/dashboard/orders/sales-history",
    },
    {
      title: "Active Listed Products",
      value: totalProductsAdded.toLocaleString(),
      subtitle: "Live second-hand items",
      icon: Package,
      iconColor: "text-slate-700 dark:text-zinc-200",
      iconBg: "bg-slate-100 dark:bg-zinc-800 ring-1 ring-slate-200 dark:ring-zinc-700",
      href: "/products",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Admin Hero Control Banner */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        {/* Amber brand ambient glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-64 h-64 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Status badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-300 border border-white/10 backdrop-blur-md">
                <Calendar className="w-3 h-3 text-amber-400" />
                {formattedDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-amber-400">{adminName}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Monitor platform metrics, manage users and roles, publish articles, and oversee customer communications from your ReSellBD admin hub.
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-amber-500/25 transition-all duration-200 border border-amber-400/60"
            >
              <Link href="/admin/dashboard/users">
                <Users className="w-4 h-4 mr-1.5 stroke-[2.5]" />
                Manage Users
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 rounded-xl px-4 py-2.5 transition-all backdrop-blur-md"
            >
              <Link href="/admin/dashboard/blogs/add-blog">
                <FilePlus className="w-4 h-4 mr-1.5 text-amber-400" />
                Write Blog
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl px-3.5 py-2.5 transition-all"
            >
              <Link href="/admin/dashboard/contacts">
                <Mail className="w-4 h-4 mr-1.5 text-amber-400" />
                Inquiries
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 6-Card Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {metrics.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.title}
              href={item.href}
              className="block group focus:outline-hidden"
            >
              <Card className="relative overflow-hidden border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-xs hover:shadow-md hover:border-amber-300/80 dark:hover:border-amber-500/40 transition-all duration-200">
                <CardContent className="p-5 sm:p-6 flex items-start justify-between gap-4">
                  <div className="space-y-1.5">
                    <p className="text-xs font-semibold text-slate-500 dark:text-zinc-400 tracking-wider uppercase">
                      {item.title}
                    </p>
                    <div className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                      {item.value}
                    </div>
                    <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                      {item.subtitle}
                    </p>
                  </div>
                  <div
                    className={`p-3 rounded-2xl ${item.iconBg} ${item.iconColor} shrink-0 transition-transform group-hover:scale-105 duration-200`}
                  >
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>

      {/* Recent Activity Sections (Users & Inquiries) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Registered Users */}
        <Card className="border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 dark:border-zinc-800 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 rounded-xl">
                <UserCheck className="w-4 h-4" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Recent Users
              </CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50">
              <Link href="/admin/dashboard/users" className="flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-4 divide-y divide-slate-100 dark:divide-zinc-800">
            {recentUsers && recentUsers.length > 0 ? (
              recentUsers.slice(0, 5).map((u) => (
                <div key={u._id} className="py-3 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="w-9 h-9 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center font-bold text-xs text-slate-700 dark:text-zinc-300 shrink-0">
                      {(u.name || u.identifier || "U").charAt(0).toUpperCase()}
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold text-slate-900 dark:text-white truncate">
                        {u.name || "Unnamed User"}
                      </p>
                      <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                        {u.identifier}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Badge
                      variant={u.role === "admin" ? "default" : "secondary"}
                      className="text-[10px] px-2 py-0 capitalize"
                    >
                      {u.role || "user"}
                    </Badge>
                    <Badge
                      variant={u.status === "banned" ? "destructive" : "outline"}
                      className="text-[10px] px-2 py-0 capitalize"
                    >
                      {u.status || "active"}
                    </Badge>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No users registered yet.</p>
            )}
          </CardContent>
        </Card>

        {/* Recent Contact Inquiries */}
        <Card className="border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 dark:border-zinc-800 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 rounded-xl">
                <Mail className="w-4 h-4" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Recent Inquiries
              </CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50">
              <Link href="/admin/dashboard/contacts" className="flex items-center gap-1">
                View all <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-4 divide-y divide-slate-100 dark:divide-zinc-800">
            {recentContacts && recentContacts.length > 0 ? (
              recentContacts.slice(0, 5).map((c) => (
                <div key={c._id} className="py-3 flex flex-col gap-1">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-semibold text-slate-900 dark:text-white">
                      {c.firstName} {c.lastName}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      {c.createdAt ? new Date(c.createdAt).toLocaleDateString() : ""}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 truncate">
                    {c.email}
                  </p>
                  <p className="text-xs text-slate-700 dark:text-zinc-300 line-clamp-1 mt-0.5">
                    {c.message}
                  </p>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-500 py-6 text-center">No inquiries received yet.</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Recent Blog Highlights */}
      {recentBlogs && recentBlogs.length > 0 && (
        <Card className="border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 rounded-2xl shadow-xs overflow-hidden">
          <CardHeader className="p-5 border-b border-slate-100 dark:border-zinc-800 flex flex-row items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 rounded-xl">
                <BookOpen className="w-4 h-4" />
              </div>
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Latest Blog Articles
              </CardTitle>
            </div>
            <Button asChild variant="ghost" size="sm" className="text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50">
              <Link href="/admin/dashboard/blogs" className="flex items-center gap-1">
                Manage Blogs <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent className="p-5 grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentBlogs.slice(0, 3).map((blog) => (
              <div
                key={blog._id}
                className="p-4 rounded-xl border border-slate-100 dark:border-zinc-800 bg-slate-50/50 dark:bg-zinc-800/40 hover:border-amber-300 dark:hover:border-amber-500/50 transition-all flex flex-col justify-between"
              >
                <div>
                  <Badge variant="secondary" className="text-[10px] uppercase font-semibold mb-2">
                    {blog.category || "General"}
                  </Badge>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white line-clamp-2 mb-1">
                    {blog.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 dark:text-zinc-400 line-clamp-2">
                    {blog.introduction || blog.mainContent}
                  </p>
                </div>
                <div className="flex items-center justify-between mt-3 pt-2 border-t border-slate-200/60 dark:border-zinc-700/60 text-[10px] text-slate-400">
                  <span>By {blog.authorName || "Admin"}</span>
                  <Link
                    href={`/admin/dashboard/blogs/update-blog/${blog._id}`}
                    className="text-amber-600 hover:underline font-medium"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
