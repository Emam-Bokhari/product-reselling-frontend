"use client";

import * as React from "react";
import Image from "next/image";
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  Calendar,
  ChevronDown,
  Loader2,
  Mail,
  MapPin,
  MoreHorizontal,
  Search,
  ShieldAlert,
  ShieldCheck,
  Trash2,
  User,
  UserCheck,
  UserX,
  Users,
  Eye,
  SlidersHorizontal,
  X,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { IUser } from "@/types";
import {
  deleteUserById,
  updateUserRoleById,
  updateUserStatusById,
} from "@/services/User";
import { toast } from "sonner";
import moment from "moment-timezone";

export default function ManageUsers({ users = [] }: { users: IUser[] }) {
  const [userList, setUserList] = React.useState<IUser[]>(users);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedRole, setSelectedRole] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Dialog states
  const [selectedUserForDetail, setSelectedUserForDetail] = React.useState<IUser | null>(null);
  const [userToDelete, setUserToDelete] = React.useState<IUser | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);
  const [updatingUserId, setUpdatingUserId] = React.useState<string | null>(null);

  // Sync users prop
  React.useEffect(() => {
    setUserList(users);
  }, [users]);

  // Derived metrics
  const totalCount = userList.length;
  const activeCount = userList.filter((u) => u.status === "active").length;
  const bannedCount = userList.filter((u) => u.status === "banned").length;
  const adminCount = userList.filter((u) => u.role === "admin").length;

  // Handle delete user
  const confirmDeleteUser = async () => {
    if (!userToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteUserById(userToDelete._id);
      if (response?.success) {
        toast.success(`User "${userToDelete.name || userToDelete.identifier}" deleted successfully`);
        setUserList((prev) => prev.filter((u) => u._id !== userToDelete._id));
        setUserToDelete(null);
      } else {
        toast.error(response?.error?.[0]?.message || "Failed to delete user");
      }
    } catch {
      toast.error("Something went wrong while deleting user!");
    } finally {
      setIsDeleting(false);
    }
  };

  // Handle user status update
  const handleUpdateUserStatus = async (id: string, status: "active" | "banned") => {
    setUpdatingUserId(id);
    try {
      const response = await updateUserStatusById(id, { status });
      if (response?.success) {
        toast.success(`User status changed to ${status}`);
        setUserList((prev) =>
          prev.map((u) => (u._id === id ? { ...u, status } : u))
        );
      } else {
        toast.error(response?.error?.[0]?.message || "Failed to update status");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Handle user role update
  const handleUpdateUserRole = async (id: string, role: "user" | "admin") => {
    setUpdatingUserId(id);
    try {
      const response = await updateUserRoleById(id, { role });
      if (response?.success) {
        toast.success(`User role changed to ${role.toUpperCase()}`);
        setUserList((prev) =>
          prev.map((u) => (u._id === id ? { ...u, role } : u))
        );
      } else {
        toast.error(response?.error?.[0]?.message || "Failed to update role");
      }
    } catch {
      toast.error("Something went wrong!");
    } finally {
      setUpdatingUserId(null);
    }
  };

  // Filtered dataset for TanStack Table
  const filteredUsers = React.useMemo(() => {
    return userList.filter((u) => {
      // Role filter
      if (selectedRole !== "all" && u.role !== selectedRole) {
        return false;
      }
      // Status filter
      if (selectedStatus !== "all" && u.status !== selectedStatus) {
        return false;
      }
      // Search query across name, identifier, city, country
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const nameMatch = u.name?.toLowerCase().includes(q);
        const idMatch = u.identifier?.toLowerCase().includes(q);
        const cityMatch = u.city?.toLowerCase().includes(q);
        const countryMatch = u.country?.toLowerCase().includes(q);
        return nameMatch || idMatch || cityMatch || countryMatch;
      }
      return true;
    });
  }, [userList, selectedRole, selectedStatus, searchQuery]);

  const columns: ColumnDef<IUser>[] = [
    {
      accessorKey: "name",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-bold hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <span>User Details</span>
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      ),
      cell: ({ row }) => {
        const u = row.original;
        const initial = (u.name || u.identifier || "U").charAt(0).toUpperCase();

        return (
          <div className="flex items-center gap-3 py-1">
            <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center shrink-0 text-slate-700 dark:text-zinc-200 font-bold text-sm shadow-xs">
              {u.profilePicture ? (
                <Image
                  src={u.profilePicture}
                  alt={u.name || "User"}
                  fill
                  className="object-cover"
                />
              ) : (
                <span>{initial}</span>
              )}
            </div>

            <div className="min-w-0 max-w-[240px] space-y-0.5">
              <button
                type="button"
                onClick={() => setSelectedUserForDetail(u)}
                className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block text-left"
              >
                {u.name || u.identifier || "User"}
              </button>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
                <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                <span className="truncate">{u.identifier}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "city",
      header: "Location",
      cell: ({ row }) => {
        const u = row.original;
        const locationText = [u.city, u.country].filter(Boolean).join(", ");

        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-zinc-300">
            <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="capitalize">{locationText || "Not specified"}</span>
          </div>
        );
      },
    },
    {
      accessorKey: "role",
      header: "Role",
      cell: ({ row }) => {
        const u = row.original;
        const isAdmin = u.role === "admin";
        const isUpdating = updatingUserId === u._id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isUpdating}>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2.5 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                {isAdmin ? (
                  <Badge
                    variant="outline"
                    className="bg-amber-500/10 text-amber-700 dark:text-amber-300 border-amber-300/80 dark:border-amber-700/60 font-bold text-[11px] px-2.5 py-0.5 gap-1 cursor-pointer"
                  >
                    <ShieldCheck className="w-3 h-3 text-amber-600 dark:text-amber-400" />
                    Admin
                    <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700 font-semibold text-[11px] px-2.5 py-0.5 gap-1 cursor-pointer"
                  >
                    <User className="w-3 h-3 text-slate-500" />
                    User
                    <ChevronDown className="w-2.5 h-2.5 ml-0.5 opacity-60" />
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36 rounded-xl">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">
                Change Role
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleUpdateUserRole(u._id, "user")}
                className="text-xs cursor-pointer flex items-center justify-between"
              >
                <span>User</span>
                {!isAdmin && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateUserRole(u._id, "admin")}
                className="text-xs cursor-pointer flex items-center justify-between font-semibold text-amber-600 dark:text-amber-400"
              >
                <span>Admin</span>
                {isAdmin && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Status",
      cell: ({ row }) => {
        const u = row.original;
        const isActive = u.status === "active";
        const isUpdating = updatingUserId === u._id;

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild disabled={isUpdating}>
              <Button
                variant="ghost"
                size="sm"
                className="h-7 px-2 rounded-full hover:bg-slate-100 dark:hover:bg-zinc-800"
              >
                {isActive ? (
                  <Badge
                    variant="outline"
                    className="bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400 border-emerald-200/80 dark:border-emerald-800/60 font-bold text-[11px] px-2.5 py-0.5 gap-1 cursor-pointer"
                  >
                    Active
                    <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                  </Badge>
                ) : (
                  <Badge
                    variant="outline"
                    className="bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400 border-rose-200/80 dark:border-rose-800/60 font-bold text-[11px] px-2.5 py-0.5 gap-1 cursor-pointer"
                  >
                    Banned
                    <ChevronDown className="w-2.5 h-2.5 opacity-60" />
                  </Badge>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36 rounded-xl">
              <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">
                Change Status
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleUpdateUserStatus(u._id, "active")}
                className="text-xs text-emerald-600 dark:text-emerald-400 cursor-pointer flex items-center justify-between"
              >
                <span>Active</span>
                {isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateUserStatus(u._id, "banned")}
                className="text-xs text-rose-600 dark:text-rose-400 cursor-pointer flex items-center justify-between"
              >
                <span>Banned</span>
                {!isActive && <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      },
    },
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-bold hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <span>Joined Date</span>
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      ),
      cell: ({ row }) => {
        const date = row.original.createdAt;
        const formatted = date
          ? moment.tz(date, "UTC").format("MMM DD, YYYY")
          : "—";

        return (
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatted}</span>
          </div>
        );
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const u = row.original;

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedUserForDetail(u)}
              title="View full profile"
              className="h-8 w-8 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Button>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-600 dark:text-zinc-400 hover:text-slate-900 dark:hover:text-white rounded-lg transition-colors"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl">
                <DropdownMenuLabel className="text-xs text-muted-foreground font-semibold">
                  Manage Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSelectedUserForDetail(u)}
                  className="text-xs cursor-pointer flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  View Profile
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() =>
                    handleUpdateUserStatus(
                      u._id,
                      u.status === "active" ? "banned" : "active"
                    )
                  }
                  className="text-xs cursor-pointer flex items-center gap-2"
                >
                  {u.status === "active" ? (
                    <>
                      <UserX className="w-3.5 h-3.5 text-rose-500" />
                      Ban Account
                    </>
                  ) : (
                    <>
                      <UserCheck className="w-3.5 h-3.5 text-emerald-500" />
                      Activate Account
                    </>
                  )}
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setUserToDelete(u)}
                  className="text-xs cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  Delete User
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredUsers,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
    initialState: {
      pagination: {
        pageSize: 10,
        pageIndex: 0,
      },
    },
  });

  const handleResetFilters = () => {
    setSearchQuery("");
    setSelectedRole("all");
    setSelectedStatus("all");
  };

  const isFiltered = searchQuery !== "" || selectedRole !== "all" || selectedStatus !== "all";

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              User Directory & Management
            </h1>
            <Badge
              variant="secondary"
              className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold"
            >
              {totalCount} Total
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Manage registered members, regulate roles & permissions, and control account statuses across ReSellBD.
          </p>
        </div>
      </div>

      {/* 2. 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Total Users
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalCount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                All platform registered accounts
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800/60 shrink-0">
              <Users className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Active Accounts
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {activeCount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                In good standing
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 ring-1 ring-slate-200 dark:ring-zinc-700 shrink-0">
              <UserCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Suspended / Banned
              </span>
              <p className="text-2xl font-extrabold text-rose-600 dark:text-rose-400">
                {bannedCount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Restricted from platform
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 ring-1 ring-rose-200 dark:ring-rose-800/60 shrink-0">
              <ShieldAlert className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Administrators
              </span>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {adminCount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Admin privilege granted
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800/60 shrink-0">
              <ShieldCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search & Filter Bar */}
      <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
        <CardContent className="p-4 sm:p-5">
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3.5">
            {/* Search Input */}
            <div className="relative flex-1 min-w-[240px]">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search user by name, email, phone, city..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-zinc-200"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Filter Dropdowns */}
            <div className="flex flex-wrap items-center gap-2.5">
              {/* Role Select */}
              <Select value={selectedRole} onValueChange={setSelectedRole}>
                <SelectTrigger className="w-[130px] h-10 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs font-semibold">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="user">User</SelectItem>
                </SelectContent>
              </Select>

              {/* Status Select */}
              <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                <SelectTrigger className="w-[140px] h-10 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs font-semibold">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Statuses</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="banned">Banned</SelectItem>
                </SelectContent>
              </Select>

              {/* Columns Visibility */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    className="h-10 px-3 rounded-xl border-slate-200 dark:border-zinc-700 bg-slate-50/70 dark:bg-zinc-800/50 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
                    <span>Columns</span>
                    <ChevronDown className="w-3 h-3 opacity-60" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-44 rounded-xl">
                  <DropdownMenuLabel className="text-xs text-muted-foreground">
                    Toggle Columns
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {table
                    .getAllColumns()
                    .filter((col) => col.getCanHide())
                    .map((col) => (
                      <DropdownMenuCheckboxItem
                        key={col.id}
                        className="text-xs capitalize"
                        checked={col.getIsVisible()}
                        onCheckedChange={(val) => col.toggleVisibility(!!val)}
                      >
                        {col.id}
                      </DropdownMenuCheckboxItem>
                    ))}
                </DropdownMenuContent>
              </DropdownMenu>

              {/* Reset filters */}
              {isFiltered && (
                <Button
                  variant="ghost"
                  onClick={handleResetFilters}
                  className="h-10 px-3 rounded-xl text-xs text-slate-500 hover:text-slate-900 dark:hover:text-white"
                >
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* 4. Users Table */}
      <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-slate-50/75 dark:bg-zinc-800/40 border-b border-slate-200/80 dark:border-zinc-800">
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id} className="hover:bg-transparent">
                  {headerGroup.headers.map((header) => (
                    <TableHead
                      key={header.id}
                      className="text-xs font-bold text-slate-700 dark:text-zinc-300 py-3.5"
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  ))}
                </TableRow>
              ))}
            </TableHeader>
            <TableBody className="divide-y divide-slate-100 dark:divide-zinc-800">
              {table.getRowModel().rows.length ? (
                table.getRowModel().rows.map((row) => (
                  <TableRow
                    key={row.id}
                    className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors group"
                  >
                    {row.getVisibleCells().map((cell) => (
                      <TableCell key={cell.id} className="py-3 px-4">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext()
                        )}
                      </TableCell>
                    ))}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-44 text-center"
                  >
                    <div className="flex flex-col items-center justify-center space-y-2 py-6">
                      <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400">
                        <UserX className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                        No users found
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        {isFiltered
                          ? "Try adjusting your search query or role/status filters."
                          : "There are currently no registered users on the platform."}
                      </p>
                      {isFiltered && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetFilters}
                          className="mt-2 text-xs rounded-xl"
                        >
                          Clear all filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>

        {/* 5. Pagination */}
        <div className="p-4 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-muted-foreground">
          <div>
            Showing{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {table.getState().pagination.pageIndex *
                table.getState().pagination.pageSize +
                (filteredUsers.length > 0 ? 1 : 0)}
            </span>{" "}
            to{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                filteredUsers.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {filteredUsers.length}
            </span>{" "}
            users
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-3 rounded-xl border-slate-200 dark:border-zinc-700 text-xs font-semibold"
            >
              Previous
            </Button>
            <span className="text-xs px-2 font-medium">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {Math.max(1, table.getPageCount())}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
              className="h-8 px-3 rounded-xl border-slate-200 dark:border-zinc-700 text-xs font-semibold"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>

      {/* User Detail Dialog */}
      <Dialog
        open={Boolean(selectedUserForDetail)}
        onOpenChange={(open) => !open && setSelectedUserForDetail(null)}
      >
        <DialogContent className="sm:max-w-xl rounded-2xl p-6">
          <DialogHeader className="border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center font-bold text-base text-slate-800 dark:text-zinc-200 shrink-0">
                {selectedUserForDetail?.profilePicture ? (
                  <Image
                    src={selectedUserForDetail.profilePicture}
                    alt={selectedUserForDetail.name || "User"}
                    width={48}
                    height={48}
                    className="object-cover w-full h-full"
                  />
                ) : (
                  <span>
                    {(
                      selectedUserForDetail?.name ||
                      selectedUserForDetail?.identifier ||
                      "U"
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </span>
                )}
              </div>
              <div>
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  {selectedUserForDetail?.name || selectedUserForDetail?.identifier || "User"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span>{selectedUserForDetail?.identifier}</span>
                  <span>•</span>
                  <span className="capitalize">{selectedUserForDetail?.role || "user"}</span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedUserForDetail && (
            <div className="space-y-4 pt-2 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Account Status
                  </span>
                  <div className="mt-1 flex items-center gap-1.5 font-bold capitalize">
                    {selectedUserForDetail.status === "active" ? (
                      <span className="text-emerald-600 dark:text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Active
                      </span>
                    ) : (
                      <span className="text-rose-600 dark:text-rose-400 flex items-center gap-1">
                        <AlertCircle className="w-3.5 h-3.5" /> Banned
                      </span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                  <span className="text-[11px] font-semibold text-muted-foreground uppercase tracking-wide">
                    Assigned Role
                  </span>
                  <div className="mt-1 flex items-center gap-1.5 font-bold capitalize">
                    {selectedUserForDetail.role === "admin" ? (
                      <span className="text-amber-600 dark:text-amber-400 flex items-center gap-1">
                        <ShieldCheck className="w-3.5 h-3.5" /> Administrator
                      </span>
                    ) : (
                      <span className="text-slate-700 dark:text-zinc-300 flex items-center gap-1 capitalize">
                        <User className="w-3.5 h-3.5" /> {selectedUserForDetail.role || "User"}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl bg-slate-50/70 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 space-y-2.5">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">City / Location</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">
                      {[selectedUserForDetail.city, selectedUserForDetail.country].filter(Boolean).join(", ") || "Not provided"}
                    </span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Postal Code</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">
                      {selectedUserForDetail.postalCode || "Not provided"}
                    </span>
                  </div>
                </div>

                {selectedUserForDetail.address && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Address</span>
                    <span className="font-semibold text-slate-800 dark:text-zinc-200">
                      {selectedUserForDetail.address}
                    </span>
                  </div>
                )}

                {selectedUserForDetail.bio && (
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-semibold">Bio</span>
                    <p className="text-slate-700 dark:text-zinc-300 italic text-[11px] leading-relaxed">
                      &ldquo;{selectedUserForDetail.bio}&rdquo;
                    </p>
                  </div>
                )}

                <div className="pt-1 border-t border-slate-200/50 dark:border-zinc-700/50 flex flex-wrap gap-4 text-[11px] text-muted-foreground">
                  <div>
                    Joined:{" "}
                    <span className="font-medium text-slate-700 dark:text-zinc-300">
                      {selectedUserForDetail.createdAt
                        ? moment.tz(selectedUserForDetail.createdAt, "UTC").format("MMMM D, YYYY")
                        : "Unknown"}
                    </span>
                  </div>
                  <div>
                    User ID:{" "}
                    <span className="font-mono text-[10px] text-slate-500">
                      {selectedUserForDetail._id}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-slate-100 dark:border-zinc-800 pt-3">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-9 px-4 rounded-xl border-slate-200 dark:border-zinc-700 text-xs font-semibold"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete User Confirmation Dialog */}
      <Dialog
        open={Boolean(userToDelete)}
        onOpenChange={(open) => !open && !isDeleting && setUserToDelete(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <div className="w-11 h-11 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-2">
              <Trash2 className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Delete User Account
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              Are you sure you want to permanently delete{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {userToDelete?.name || userToDelete?.identifier}
              </span>
              ? This action is irreversible and will remove all their listed products, reviews, and associated records.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 pt-3 border-t border-slate-100 dark:border-zinc-800">
            <DialogClose asChild>
              <Button
                variant="outline"
                disabled={isDeleting}
                className="h-9 rounded-xl border-slate-200 dark:border-zinc-700 text-xs font-semibold"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              disabled={isDeleting}
              onClick={confirmDeleteUser}
              className="h-9 px-4 rounded-xl text-xs font-bold bg-red-600 hover:bg-red-700 shadow-sm flex items-center gap-1.5"
            >
              {isDeleting ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Confirm Delete</span>
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
