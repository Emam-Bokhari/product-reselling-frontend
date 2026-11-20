"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  BookOpen,
  FilePlus,
  LayoutDashboard,
  Mail,
  Package,
  PlusCircle,
  Send,
  ShoppingBag,
  Store,
  TrendingUp,
  User,
  Users,
} from "lucide-react";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from "@/components/ui/sidebar";

interface NavItem {
  title: string;
  url: string;
  icon: typeof LayoutDashboard;
  badge?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export function AppSidebarNav({ isAdmin }: { isAdmin: boolean }) {
  const pathname = usePathname();

  const sections: NavSection[] = [
    {
      title: "Overview",
      items: [
        {
          title: "Dashboard",
          url: "/user/dashboard",
          icon: LayoutDashboard,
        },
      ],
    },
    {
      title: "Marketplace Hub",
      items: [
        {
          title: "My Listings",
          url: "/user/dashboard/products",
          icon: Package,
        },
        {
          title: "Post New Ad",
          url: "/user/dashboard/products/add-product",
          icon: PlusCircle,
          badge: "Free",
        },
      ],
    },
    {
      title: "Orders & Trades",
      items: [
        {
          title: "Sales History",
          url: "/user/dashboard/orders/sales-history",
          icon: TrendingUp,
        },
        {
          title: "Purchases History",
          url: "/user/dashboard/orders/purchase-history",
          icon: ShoppingBag,
        },
      ],
    },
    {
      title: "Account",
      items: [
        {
          title: "My Profile",
          url: "/user/dashboard/user-profile",
          icon: User,
        },
        {
          title: "Live Storefront",
          url: "/products",
          icon: Store,
        },
      ],
    },
  ];

  const adminSections: NavSection[] = [
    {
      title: "Admin Panel",
      items: [
        {
          title: "Manage Users",
          url: "/admin/dashboard/users",
          icon: Users,
        },
        {
          title: "Blog Articles",
          url: "/admin/dashboard/blogs",
          icon: BookOpen,
        },
        {
          title: "Write Blog",
          url: "/admin/dashboard/blogs/add-blog",
          icon: FilePlus,
        },
        {
          title: "User Messages",
          url: "/admin/dashboard/contacts",
          icon: Mail,
        },
        {
          title: "Newsletter Subs",
          url: "/admin/dashboard/newsLetters",
          icon: Send,
        },
      ],
    },
  ];

  const allSections = [...sections, ...(isAdmin ? adminSections : [])];

  return (
    <div className="flex flex-col gap-5 py-2">
      {allSections.map((section) => (
        <SidebarGroup key={section.title} className="p-0">
          <SidebarGroupLabel className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-zinc-500 px-3 mb-1">
            {section.title}
          </SidebarGroupLabel>
          <SidebarMenu className="gap-1">
            {section.items.map((item) => {
              const IconComponent = item.icon;
              const isActive =
                item.url === "/user/dashboard"
                  ? pathname === "/user/dashboard"
                  : pathname === item.url ||
                    (item.url !== "/products" && pathname.startsWith(item.url));

              return (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton
                    asChild
                    isActive={isActive}
                    className={`h-9 px-3 rounded-xl text-xs font-medium transition-all ${
                      isActive
                        ? "bg-amber-500/10 text-amber-700 dark:text-amber-400 font-semibold shadow-xs"
                        : "text-slate-600 hover:text-slate-900 hover:bg-slate-100 dark:text-zinc-400 dark:hover:text-zinc-100 dark:hover:bg-zinc-800/60"
                    }`}
                  >
                    <Link
                      href={item.url}
                      className="flex items-center justify-between w-full"
                    >
                      <div className="flex items-center gap-2.5">
                        <IconComponent
                          className={`w-4 h-4 transition-colors ${
                            isActive
                              ? "text-amber-500"
                              : "text-slate-400 group-hover:text-slate-600 dark:text-zinc-500 dark:group-hover:text-zinc-300"
                          }`}
                        />
                        <span>{item.title}</span>
                      </div>

                      {item.badge ? (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-amber-500 text-slate-950 uppercase tracking-wider">
                          {item.badge}
                        </span>
                      ) : isActive ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-500" />
                      ) : null}
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      ))}
    </div>
  );
}
