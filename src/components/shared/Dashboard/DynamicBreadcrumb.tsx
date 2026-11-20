"use client";

import { usePathname } from "next/navigation";
import Link from "next/link";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Fragment } from "react";
import { Home } from "lucide-react";

const labelMap: Record<string, string> = {
  user: "Portal",
  admin: "Admin",
  dashboard: "Dashboard",
  products: "Inventory",
  "add-product": "Add Listing",
  "update-product": "Edit Listing",
  orders: "Orders",
  "purchase-history": "Purchases",
  "sales-history": "Sales",
  "user-profile": "Profile",
  blogs: "Blogs",
  "add-blog": "Add Blog",
  "update-blog": "Edit Blog",
  contacts: "Messages",
  newsLetters: "Newsletters",
  users: "Users",
};

export default function DynamicBreadcrumb() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment !== "");

  return (
    <Breadcrumb className="hidden sm:flex">
      <BreadcrumbList className="text-xs sm:text-sm font-medium">
        <BreadcrumbItem>
          <BreadcrumbLink asChild>
            <Link
              href="/user/dashboard"
              className="flex items-center gap-1 text-muted-foreground hover:text-amber-600 transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Home</span>
            </Link>
          </BreadcrumbLink>
        </BreadcrumbItem>
        {pathSegments.length > 0 && <BreadcrumbSeparator className="opacity-40" />}

        {pathSegments.map((segment, index) => {
          const href = `/${pathSegments.slice(0, index + 1).join("/")}`;
          const isLast = index === pathSegments.length - 1;
          const formattedSegment =
            labelMap[segment] ||
            segment
              .replace(/-/g, " ")
              .replace(/\b\w/g, (char) => char.toUpperCase());

          return (
            <Fragment key={href}>
              <BreadcrumbItem>
                {isLast ? (
                  <BreadcrumbPage className="font-semibold text-slate-800 dark:text-slate-100">
                    {formattedSegment}
                  </BreadcrumbPage>
                ) : (
                  <BreadcrumbLink asChild>
                    <Link
                      href={href}
                      className="text-muted-foreground hover:text-amber-600 transition-colors"
                    >
                      {formattedSegment}
                    </Link>
                  </BreadcrumbLink>
                )}
              </BreadcrumbItem>
              {!isLast && <BreadcrumbSeparator className="opacity-40" />}
            </Fragment>
          );
        })}
      </BreadcrumbList>
    </Breadcrumb>
  );
}
