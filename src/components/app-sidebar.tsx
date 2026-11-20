import logo from "@/assets/Logo.png";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";
import Link from "next/link";
import Image from "next/image";
import { getCurrentUser } from "@/services/Auth";
import { getMe } from "@/services/User";
import { AppSidebarNav } from "./app-sidebar-nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ShieldCheck, Store } from "lucide-react";

export async function AppSidebar({
  ...props
}: React.ComponentProps<typeof Sidebar>) {
  const [currentUser, meResponse] = await Promise.all([
    getCurrentUser().catch(() => null),
    getMe().catch(() => null),
  ]);

  const user = meResponse?.data || currentUser;
  const isAdmin = user?.role === "admin";
  const displayName = user?.name || "Seller";
  const roleTitle = isAdmin ? "Administrator" : "Verified Seller";

  const initials = displayName
    .split(" ")
    .map((n: string) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <Sidebar className="border-r border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-950" {...props}>
      {/* Brand Header */}
      <SidebarHeader className="border-b border-slate-100 dark:border-zinc-800/80 p-4">
        <Link
          href="/"
          className="flex items-center gap-3 group transition-transform hover:scale-[1.01]"
        >
          <div className="relative w-9 h-9 rounded-xl bg-amber-500/10 flex items-center justify-center p-1.5 ring-1 ring-amber-500/30">
            <Image
              src={logo}
              width={32}
              height={32}
              alt="ReSellBD Logo"
              className="object-contain"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-base tracking-tight text-slate-900 dark:text-white">
                ReSell<span className="text-amber-500">BD</span>
              </span>
              <span className="text-[10px] font-bold px-1.5 py-0.2 rounded-full bg-slate-900 text-amber-400 dark:bg-amber-400 dark:text-slate-950 uppercase tracking-wider">
                HUB
              </span>
            </div>
            <span className="text-[11px] text-muted-foreground font-medium">
              Second-Hand Marketplace
            </span>
          </div>
        </Link>
      </SidebarHeader>

      {/* Main Navigation */}
      <SidebarContent className="px-3">
        <AppSidebarNav isAdmin={isAdmin} />
      </SidebarContent>

      {/* Footer Profile Mini Card */}
      <SidebarFooter className="border-t border-slate-100 dark:border-zinc-800 p-3">
        <div className="flex items-center justify-between p-2 rounded-xl bg-slate-50 dark:bg-zinc-900/60 border border-slate-200/60 dark:border-zinc-800">
          <div className="flex items-center gap-2.5 min-w-0">
            <div className="relative">
              <Avatar className="h-8 w-8 ring-1 ring-amber-500/30">
                <AvatarImage
                  src={user?.profilePicture || "https://res.cloudinary.com/dvpqm6zct/image/upload/v1742736505/user_ug5gxm.png"}
                  alt={displayName}
                />
                <AvatarFallback className="bg-amber-500 text-slate-950 font-bold text-xs">
                  {initials || "RB"}
                </AvatarFallback>
              </Avatar>
              <span className="absolute bottom-0 right-0 w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
            </div>

            <div className="flex flex-col min-w-0">
              <div className="flex items-center gap-1">
                <p className="text-xs font-semibold text-slate-800 dark:text-slate-200 truncate">
                  {displayName}
                </p>
                <ShieldCheck className="w-3 h-3 text-emerald-500 shrink-0" />
              </div>
              <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
                {roleTitle}
              </span>
            </div>
          </div>

          <Link
            href="/products"
            title="Browse Marketplace"
            className="p-1.5 text-muted-foreground hover:text-amber-600 dark:hover:text-amber-400 hover:bg-white dark:hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <Store className="w-4 h-4" />
          </Link>
        </div>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
