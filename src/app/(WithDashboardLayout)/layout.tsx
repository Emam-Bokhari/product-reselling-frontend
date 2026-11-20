import { AppSidebar } from "@/components/app-sidebar";
import { ProfileMenu } from "@/components/modules/Dashboard/ProfileMenu";
import NotificationMenu from "@/components/modules/Dashboard/Notifications/NotificationMenu";
import DynamicBreadcrumb from "@/components/shared/Dashboard/DynamicBreadcrumb";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";
import { getCurrentUser } from "@/services/Auth";
import { getMe } from "@/services/User";
import { Plus, Search, Store } from "lucide-react";
import Link from "next/link";
import { Fragment } from "react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [currentUser, meResponse] = await Promise.all([
    getCurrentUser().catch(() => null),
    getMe().catch(() => null),
  ]);
  const user = meResponse?.data || currentUser;

  return (
    <Fragment>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="bg-slate-50/50 dark:bg-zinc-950/50 min-h-screen flex flex-col">
          {/* Professional Header */}
          <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-slate-200/80 dark:border-zinc-800 bg-white/90 dark:bg-zinc-900/90 backdrop-blur-md px-4 sm:px-6 transition-all">
            {/* Left section: Trigger & Breadcrumbs */}
            <div className="flex items-center gap-2.5">
              <SidebarTrigger className="text-slate-600 hover:text-slate-900 dark:text-zinc-300 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-zinc-800" />
              <Separator orientation="vertical" className="h-4 hidden sm:block opacity-60" />
              <DynamicBreadcrumb />
            </div>

            {/* Middle search shortcut (Desktop) */}
            <div className="hidden lg:flex items-center flex-1 max-w-sm mx-6">
              <Link
                href="/products"
                className="w-full flex items-center justify-between px-3 py-1.5 rounded-full bg-slate-100/80 dark:bg-zinc-800/80 border border-slate-200/60 dark:border-zinc-700/60 text-xs text-muted-foreground hover:border-amber-500/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <Search className="w-3.5 h-3.5 text-slate-400" />
                  <span>Search products, categories, deals...</span>
                </div>
                <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-white dark:bg-zinc-900 text-slate-500 border border-slate-200 dark:border-zinc-750">
                  Ctrl K
                </kbd>
              </Link>
            </div>

            {/* Right section: Quick actions, notifications, profile */}
            <div className="flex items-center gap-2 sm:gap-3">
              {/* Visit Marketplace Button */}
              <Button
                asChild
                variant="ghost"
                size="sm"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 dark:text-zinc-300 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-full h-8 px-3"
              >
                <Link href="/products">
                  <Store className="w-3.5 h-3.5 text-amber-500" />
                  <span>Marketplace</span>
                </Link>
              </Button>

              {/* Quick Post Ad CTA */}
              <Button
                asChild
                size="sm"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 shadow-xs rounded-full h-8 px-3.5"
              >
                <Link href="/user/dashboard/products/add-product">
                  <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Post Ad</span>
                </Link>
              </Button>

              <Separator orientation="vertical" className="h-4 hidden sm:block opacity-60" />

              {/* Notification Bell */}
              <NotificationMenu />

              {/* Profile Menu */}
              <ProfileMenu user={user} />
            </div>
          </header>

          {/* Main Dashboard Workspace */}
          <main className="flex-1 w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
            {children}
          </main>
        </SidebarInset>
      </SidebarProvider>
    </Fragment>
  );
}
