"use client";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { logout, selectCurrentUser } from "@/redux/features/authSlice";
import { useAppDispatch, useAppSelector } from "@/redux/hooks";
import { logoutFromCookie } from "@/services/Auth";
import {
  LogOutIcon,
  Package,
  ShoppingBag,
  Store,
  TrendingUp,
  User,
  ShieldCheck,
  ChevronDown,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";

interface ProfileMenuProps {
  user?: {
    name?: string;
    identifier?: string;
    role?: string;
    profilePicture?: string;
  } | null;
}

export const ProfileMenu = ({ user: initialUser }: ProfileMenuProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const reduxUser = useAppSelector(selectCurrentUser);

  const currentUser = initialUser || reduxUser;
  const displayName = (currentUser as any)?.name || (currentUser as any)?.identifier || "Account";
  const displayIdentifier = currentUser?.identifier || "";
  const role = currentUser?.role === "admin" ? "Admin" : currentUser?.role ? currentUser.role.toUpperCase() : "User";

  const getInitials = (name?: string) => {
    if (!name) return "RB";
    return name
      .split(" ")
      .map((n) => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  const handleLogout = async () => {
    dispatch(logout());
    await logoutFromCookie();
    router.push("/");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="outline-none focus:outline-none">
        <div className="flex items-center gap-2.5 p-1 sm:px-2.5 sm:py-1 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800 transition-all cursor-pointer border border-transparent hover:border-slate-200 dark:hover:border-zinc-700">
          <div className="relative">
            <Avatar className="h-8 w-8 sm:h-9 sm:w-9 ring-2 ring-amber-500/30">
              <AvatarImage
                src={(currentUser as any)?.profilePicture || ""}
                alt={displayName}
              />
              <AvatarFallback className="bg-amber-500 text-slate-950 font-bold text-xs">
                {getInitials(displayName)}
              </AvatarFallback>
            </Avatar>
            <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-white dark:ring-zinc-900" />
          </div>

          <div className="hidden md:flex flex-col text-left leading-tight">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 truncate max-w-[120px]">
              {displayName}
            </span>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              {role}
            </span>
          </div>
          <ChevronDown className="hidden md:block w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-60 p-1.5 rounded-2xl shadow-xl border-slate-200 dark:border-zinc-800">
        <DropdownMenuLabel className="p-3">
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-1.5">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">
                {displayName}
              </p>
              <ShieldCheck className="w-4 h-4 text-emerald-500 shrink-0" />
            </div>
            <p className="text-xs text-muted-foreground truncate">{displayIdentifier}</p>
            <div className="mt-1">
              <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-semibold bg-amber-500/10 text-amber-700 dark:text-amber-300">
                {role}
              </span>
            </div>
          </div>
        </DropdownMenuLabel>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/user/dashboard/user-profile"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <User className="w-4 h-4 text-slate-500" />
            <span>Profile & Account</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/user/dashboard/products"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <Package className="w-4 h-4 text-slate-500" />
            <span>My Listed Products</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/user/dashboard/orders/sales-history"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <TrendingUp className="w-4 h-4 text-slate-500" />
            <span>Sales History</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild>
          <Link
            href="/user/dashboard/orders/purchase-history"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer hover:bg-slate-100 dark:hover:bg-zinc-800"
          >
            <ShoppingBag className="w-4 h-4 text-slate-500" />
            <span>Purchases History</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem asChild>
          <Link
            href="/products"
            className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium rounded-lg cursor-pointer text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/40"
          >
            <Store className="w-4 h-4" />
            <span>Visit Marketplace</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator />

        <DropdownMenuItem
          onClick={handleLogout}
          className="flex items-center gap-2.5 px-3 py-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 rounded-lg cursor-pointer"
        >
          <LogOutIcon className="w-4 h-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};
