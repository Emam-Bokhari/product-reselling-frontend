"use client";

import { useState } from "react";
import Link from "next/link";
import { TSalesData } from "@/types/analytics";
import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import {
  BarChart3,
  Calendar,
  Plus,
  TrendingUp,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function SalesAnalytics({ data }: { data: TSalesData[] }) {
  const [activeTab, setActiveTab] = useState<"all" | "revenue" | "sales">("all");

  const hasRealData =
    Boolean(data) &&
    data.length > 0 &&
    data.some((d) => (d.totalSales || 0) > 0 || (d.totalRevenue || 0) > 0);

  const totalCalculatedRevenue = hasRealData
    ? data.reduce((acc, curr) => acc + (curr.totalRevenue || 0), 0)
    : 0;

  const totalCalculatedSales = hasRealData
    ? data.reduce((acc, curr) => acc + (curr.totalSales || 0), 0)
    : 0;

  // Custom tooltips
  const CustomRevenueTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-slate-900/95 backdrop-blur-md p-3.5 shadow-2xl border border-slate-700/60 text-white text-xs space-y-1.5 min-w-[150px]">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium pb-1 border-b border-slate-800">
            <Calendar className="w-3 h-3 text-[#F59E0B]" />
            <span>{label}</span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-slate-300">Revenue:</span>
            <span className="font-bold text-[#F59E0B] text-sm">
              ৳ {Number(payload[0].value).toLocaleString()}
            </span>
          </div>
          <div className="flex items-center gap-1 text-[10px] text-[#F59E0B] font-medium">
            <TrendingUp className="w-3 h-3" />
            <span>Verified Transactions</span>
          </div>
        </div>
      );
    }
    return null;
  };

  const CustomSalesTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="rounded-xl bg-slate-900/95 backdrop-blur-md p-3.5 shadow-2xl border border-slate-700/60 text-white text-xs space-y-1.5 min-w-[150px]">
          <div className="flex items-center gap-1.5 text-slate-400 font-medium pb-1 border-b border-slate-800">
            <Calendar className="w-3 h-3 text-[#F59E0B]" />
            <span>{label}</span>
          </div>
          <div className="flex items-center justify-between gap-3 pt-1">
            <span className="text-slate-300">Orders Sold:</span>
            <span className="font-bold text-[#F59E0B] text-sm">
              {payload[0].value} units
            </span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="space-y-4">
      {/* Analytics Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 dark:text-white">
              Sales & Revenue Performance
            </h2>
            {hasRealData && (
              <span className="hidden sm:inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60">
                Live Data
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Monitor monthly cash flow, sales volume, and order demand trends.
          </p>
        </div>

        {/* View mode buttons (only shown when real data is available) */}
        {hasRealData && (
          <div className="flex items-center gap-1.5 p-1 bg-slate-100 dark:bg-zinc-800/80 rounded-xl border border-slate-200/60 dark:border-zinc-700/60 self-start sm:self-auto">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("all")}
              className={`h-7 px-3 text-xs rounded-lg font-medium transition-all ${
                activeTab === "all"
                  ? "bg-white dark:bg-zinc-900 text-amber-700 dark:text-amber-400 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400"
              }`}
            >
              All Views
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("revenue")}
              className={`h-7 px-3 text-xs rounded-lg font-medium transition-all ${
                activeTab === "revenue"
                  ? "bg-white dark:bg-zinc-900 text-amber-700 dark:text-amber-400 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400"
              }`}
            >
              Revenue
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setActiveTab("sales")}
              className={`h-7 px-3 text-xs rounded-lg font-medium transition-all ${
                activeTab === "sales"
                  ? "bg-white dark:bg-zinc-900 text-amber-700 dark:text-amber-400 shadow-xs font-bold"
                  : "text-slate-500 hover:text-slate-900 dark:text-zinc-400"
              }`}
            >
              Orders Volume
            </Button>
          </div>
        )}
      </div>

      {/* When no real data from backend, display clean empty state (NO dummy charts) */}
      {!hasRealData ? (
        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs p-8 sm:p-12 text-center">
          <CardContent className="p-0 flex flex-col items-center justify-center space-y-3 max-w-md mx-auto">
            <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <BarChart3 className="w-7 h-7" />
            </div>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white">
              No Sales Analytics Yet
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed">
              Your monthly revenue growth curve and order volume charts will automatically visualize here once you complete transactions.
            </p>
            <Button
              asChild
              className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-xl text-xs mt-2 shadow-xs transition-all"
            >
              <Link href="/user/dashboard/products/add-product">
                <Plus className="w-4 h-4 mr-1.5" />
                Post New Listing
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        /* Real Data Charts Grid */
        <div
          className={`grid gap-4 ${
            activeTab === "all" ? "grid-cols-1 xl:grid-cols-2" : "grid-cols-1"
          }`}
        >
          {/* Total Revenue Trend Card (AreaChart) */}
          {(activeTab === "all" || activeTab === "revenue") && (
            <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:shadow-md transition-all">
              <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <TrendingUp className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                      Revenue Growth Trend
                    </CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground pl-7">
                    Monthly gross sales generated from second-hand listings
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Tracked Total</span>
                  <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                    ৳ {totalCalculatedRevenue.toLocaleString()}
                  </p>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-4">
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart
                      data={data}
                      margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
                    >
                      <defs>
                        <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#F59E0B" stopOpacity={0.35} />
                          <stop offset="95%" stopColor="#F59E0B" stopOpacity={0.0} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                        strokeOpacity={0.6}
                      />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        tickFormatter={(val) =>
                          val >= 1000 ? `৳${(val / 1000).toFixed(0)}k` : `৳${val}`
                        }
                      />
                      <Tooltip content={<CustomRevenueTooltip />} />
                      <Area
                        type="monotone"
                        dataKey="totalRevenue"
                        stroke="#F59E0B"
                        strokeWidth={3}
                        fillOpacity={1}
                        fill="url(#revenueGradient)"
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Total Orders Volume (BarChart) */}
          {(activeTab === "all" || activeTab === "sales") && (
            <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs hover:shadow-md transition-all">
              <CardHeader className="p-5 pb-2 flex flex-row items-center justify-between border-b border-slate-100 dark:border-zinc-800/80">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                      <BarChart3 className="w-4 h-4" />
                    </div>
                    <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                      Order Volume & Velocity
                    </CardTitle>
                  </div>
                  <p className="text-xs text-muted-foreground pl-7">
                    Total completed item trades & orders closed per month
                  </p>
                </div>

                <div className="text-right">
                  <span className="text-xs text-muted-foreground">Total Orders</span>
                  <p className="text-lg font-extrabold text-amber-600 dark:text-amber-400">
                    {totalCalculatedSales} items
                  </p>
                </div>
              </CardHeader>

              <CardContent className="p-5 pt-4">
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart
                      data={data}
                      margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
                    >
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                        stroke="#e2e8f0"
                        strokeOpacity={0.6}
                      />
                      <XAxis
                        dataKey="date"
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#64748b", fontSize: 12 }}
                      />
                      <YAxis
                        tickLine={false}
                        axisLine={false}
                        tick={{ fill: "#64748b", fontSize: 11 }}
                        allowDecimals={false}
                      />
                      <Tooltip
                        content={<CustomSalesTooltip />}
                        cursor={{ fill: "rgba(245, 158, 11, 0.08)" }}
                      />
                      <Bar
                        dataKey="totalSales"
                        fill="#F59E0B"
                        radius={[6, 6, 0, 0]}
                        maxBarSize={44}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
}
