"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { TOrder } from "@/types/order";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Clock,
  HelpCircle,
  Package,
  PlusCircle,
  Receipt,
  ShoppingBag,
  TrendingUp,
  UserCheck,
} from "lucide-react";

interface RecentOrdersActivityProps {
  purchaseHistory?: TOrder[];
  salesHistory?: TOrder[];
}

export default function RecentOrdersActivity({
  purchaseHistory = [],
  salesHistory = [],
}: RecentOrdersActivityProps) {
  const [activeTab, setActiveTab] = useState<"sales" | "purchases">("sales");

  const displayedOrders =
    activeTab === "sales" ? salesHistory.slice(0, 5) : purchaseHistory.slice(0, 5);

  const formatDate = (dateString?: string) => {
    if (!dateString) return "Recent";
    try {
      const date = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(date);
    } catch {
      return dateString;
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      {/* Left Column: Recent Orders Activity List (8 cols) */}
      <div className="lg:col-span-7 xl:col-span-8">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardHeader className="p-5 pb-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 dark:border-zinc-800/80">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <div className="p-1.5 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400">
                  <Receipt className="w-4 h-4" />
                </div>
                <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                  Recent Marketplace Activity
                </CardTitle>
              </div>
              <p className="text-xs text-muted-foreground pl-7">
                Latest orders, buyer transactions, and purchase receipts
              </p>
            </div>

            {/* Sub-tabs */}
            <div className="flex items-center gap-1 p-1 bg-slate-100 dark:bg-zinc-800 rounded-xl self-start sm:self-auto text-xs">
              <button
                onClick={() => setActiveTab("sales")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === "sales"
                    ? "bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 dark:text-zinc-400"
                }`}
              >
                Recent Sales ({salesHistory.length})
              </button>
              <button
                onClick={() => setActiveTab("purchases")}
                className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                  activeTab === "purchases"
                    ? "bg-white dark:bg-zinc-900 text-amber-600 dark:text-amber-400 shadow-xs font-bold"
                    : "text-slate-600 hover:text-slate-900 dark:text-zinc-400"
                }`}
              >
                Purchases ({purchaseHistory.length})
              </button>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {displayedOrders.length === 0 ? (
              <div className="p-8 sm:p-12 text-center flex flex-col items-center justify-center space-y-3">
                <div className="w-14 h-14 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 flex items-center justify-center">
                  {activeTab === "sales" ? (
                    <TrendingUp className="w-6 h-6" />
                  ) : (
                    <ShoppingBag className="w-6 h-6" />
                  )}
                </div>
                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                  {activeTab === "sales"
                    ? "No Sales Recorded Yet"
                    : "No Purchases Made Yet"}
                </h4>
                <p className="text-xs text-muted-foreground max-w-sm leading-relaxed">
                  {activeTab === "sales"
                    ? "List your unused phones, electronics, or vehicles to attract buyers all over Bangladesh."
                    : "Browse thousands of verified second-hand items and make your first smart purchase today."}
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs mt-2 border border-amber-400/60"
                >
                  <Link
                    href={
                      activeTab === "sales"
                        ? "/user/dashboard/products/add-product"
                        : "/products"
                    }
                  >
                    {activeTab === "sales" ? "+ Post New Listing" : "Explore Marketplace"}
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="divide-y divide-slate-100 dark:divide-zinc-800/80">
                {displayedOrders.map((order) => {
                  const item = order.itemID;
                  const otherParty =
                    activeTab === "sales" ? order.buyerID : order.sellerID;
                  const isCompleted = order.status === "completed";

                  return (
                    <div
                      key={order._id}
                      className="p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        {/* Thumbnail image or placeholder */}
                        <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-slate-200 dark:border-zinc-700 flex items-center justify-center">
                          {item?.images && item.images.length > 0 ? (
                            <Image
                              src={item.images[0]}
                              alt={item.title || "Product"}
                              fill
                              className="object-cover"
                            />
                          ) : (
                            <Package className="w-5 h-5 text-slate-400" />
                          )}
                        </div>

                        <div className="min-w-0 space-y-0.5">
                          <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                            {item?.title || "Marketplace Product"}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 text-[11px] text-muted-foreground">
                            <span>
                              {activeTab === "sales" ? "Buyer:" : "Seller:"}{" "}
                              <span className="font-semibold text-slate-700 dark:text-zinc-300">
                                {otherParty?.name || "Verified Customer"}
                              </span>
                            </span>
                            <span>•</span>
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-slate-400" />
                              {formatDate(order.createdAt)}
                            </span>
                          </div>
                          {order.transactionId && (
                            <p className="text-[10px] font-mono text-slate-400 truncate">
                              ID: {order.transactionId}
                            </p>
                          )}
                        </div>
                      </div>

                      {/* Right side: Price & status */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-1.5 shrink-0 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100 dark:border-zinc-800">
                        <span className="text-sm font-extrabold text-amber-600 dark:text-amber-400">
                          ৳ {item?.price ? Number(item.price).toLocaleString() : "—"}
                        </span>
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full capitalize ${
                            isCompleted
                              ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80"
                              : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200"
                          }`}
                        >
                          {order.status || "Completed"}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* Footer view all link */}
            <div className="p-3.5 bg-slate-50/50 dark:bg-zinc-900/60 border-t border-slate-100 dark:border-zinc-800 flex items-center justify-between text-xs rounded-b-2xl">
              <span className="text-muted-foreground">
                Showing recent {activeTab === "sales" ? "sales" : "purchases"}
              </span>
              <Link
                href={
                  activeTab === "sales"
                    ? "/user/dashboard/orders/sales-history"
                    : "/user/dashboard/orders/purchase-history"
                }
                className="font-bold text-amber-600 hover:text-amber-700 dark:text-amber-400 flex items-center gap-1 transition-colors"
              >
                <span>View Full History</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Right Column: Seller Quick Toolkit (4 cols) */}
      <div className="lg:col-span-5 xl:col-span-4 space-y-5">
        {/* Quick Tools Grid */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardHeader className="p-5 pb-3 border-b border-slate-100 dark:border-zinc-800/80">
            <div className="flex items-center gap-2">
              <CardTitle className="text-base font-bold text-slate-900 dark:text-white">
                Seller Toolkit
              </CardTitle>
            </div>
          </CardHeader>

          <CardContent className="p-4 grid grid-cols-2 gap-2.5">
            <Link
              href="/user/dashboard/products/add-product"
              className="p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all flex flex-col gap-1.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <PlusCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Post New Ad
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Create listing
              </span>
            </Link>

            <Link
              href="/user/dashboard/products"
              className="p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all flex flex-col gap-1.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <Package className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                My Listings
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Manage inventory
              </span>
            </Link>

            <Link
              href="/user/dashboard/user-profile"
              className="p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all flex flex-col gap-1.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <UserCheck className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Seller Profile
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                View profile
              </span>
            </Link>

            <Link
              href="/contactUs"
              className="p-3 rounded-xl border border-slate-200/80 dark:border-zinc-800 hover:border-amber-500/50 hover:bg-amber-50/50 dark:hover:bg-amber-950/20 transition-all flex flex-col gap-1.5 group"
            >
              <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
                <HelpCircle className="w-4 h-4" />
              </div>
              <span className="text-xs font-bold text-slate-800 dark:text-slate-200">
                Help & Support
              </span>
              <span className="text-[10px] text-muted-foreground leading-tight">
                Contact support
              </span>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
