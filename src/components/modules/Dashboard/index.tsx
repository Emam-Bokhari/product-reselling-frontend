import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Calendar,
  Package,
  Plus,
  ShoppingBag,
  Store,
  Wallet,
} from "lucide-react";
import Link from "next/link";

interface DashboardOverviewProps {
  totalProductsAdded: number;
  totalPurchases: number;
  totalSales: number;
  user?: {
    name?: string;
    role?: string;
    identifier?: string;
  } | null;
}

export default function DashboardOverview({
  totalProductsAdded = 0,
  totalPurchases = 0,
  totalSales = 0,
  user,
}: DashboardOverviewProps) {
  const userName = user?.name || "Seller";
  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(new Date());

  const metrics = [
    {
      title: "Total Sales & Revenue",
      value: `৳ ${Number(totalSales).toLocaleString()}`,
      icon: Wallet,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-200 dark:ring-amber-800/60",
      href: "/user/dashboard/orders/sales-history",
    },
    {
      title: "Active Listed Products",
      value: totalProductsAdded.toString(),
      icon: Package,
      iconColor: "text-slate-700 dark:text-zinc-200",
      iconBg: "bg-slate-100 dark:bg-zinc-800 ring-1 ring-slate-200 dark:ring-zinc-700",
      href: "/user/dashboard/products",
    },
    {
      title: "Purchases Made",
      value: totalPurchases.toString(),
      icon: ShoppingBag,
      iconColor: "text-amber-600 dark:text-amber-400",
      iconBg: "bg-amber-50 dark:bg-amber-950/40 ring-1 ring-amber-200 dark:ring-amber-800/60",
      href: "/user/dashboard/orders/purchase-history",
    },
  ];

  return (
    <div className="space-y-6">
      {/* Hero Welcome Banner - ReSellBD Brand Palette */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white p-6 sm:p-8 shadow-xl border border-slate-800">
        {/* Amber brand ambient glow */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-80 h-80 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/4 -mb-20 w-64 h-64 rounded-full bg-amber-600/10 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            {/* Live platform status badges */}
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium bg-white/10 text-slate-200 border border-white/10 backdrop-blur-md">
                <Calendar className="w-3 h-3 text-amber-400" />
                {formattedDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-white">
              Welcome back, <span className="text-amber-400">{userName}</span>
            </h1>
            <p className="text-sm sm:text-base text-slate-300 leading-relaxed font-normal">
              Manage your second-hand listings, track sales revenue, and handle buyer orders with Bangladesh’s premier pre-loved trading hub.
            </p>
          </div>

          {/* Banner Quick Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Button
              asChild
              className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-5 py-2.5 rounded-xl shadow-md hover:shadow-amber-500/25 transition-all duration-200 border border-amber-400/60"
            >
              <Link href="/user/dashboard/products/add-product">
                <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
                Post New Listing
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-white/10 hover:bg-white/20 text-white border-white/20 hover:border-white/40 rounded-xl px-4 py-2.5 transition-all backdrop-blur-md"
            >
              <Link href="/user/dashboard/products">
                <Package className="w-4 h-4 mr-1.5 text-amber-400" />
                My Listings
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              className="text-slate-300 hover:text-white hover:bg-white/10 rounded-xl px-3.5 py-2.5 transition-all"
            >
              <Link href="/products">
                <Store className="w-4 h-4 mr-1.5 text-amber-400" />
                Storefront
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* 3-Card KPI Metric Grid (100% Real Backend Data) */}
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
    </div>
  );
}
