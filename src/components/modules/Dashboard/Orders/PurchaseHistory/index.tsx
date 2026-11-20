"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
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
  CheckCircle2,
  Clock,
  ExternalLink,
  Mail,
  Package,
  Receipt,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Store,
  User,
  Wallet,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
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
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { TOrder } from "@/types/order";

export default function PurchaseHistory({
  purchaseHistory = [],
}: {
  purchaseHistory: TOrder[];
}) {
  const [dataList, setDataList] = React.useState<TOrder[]>(purchaseHistory);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  React.useEffect(() => {
    setDataList(purchaseHistory);
  }, [purchaseHistory]);

  // Derived real KPI metrics
  const totalCount = dataList.length;
  const completedOrders = dataList.filter(
    (order) => order.status?.toLowerCase() === "completed"
  );
  const pendingOrders = dataList.filter(
    (order) => order.status?.toLowerCase() === "pending"
  );
  const totalSpent = dataList.reduce(
    (acc, order) => acc + (Number(order.itemID?.price) || 0),
    0
  );

  const formatDate = (dateString?: string) => {
    if (!dateString) return "N/A";
    try {
      const d = new Date(dateString);
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(d);
    } catch {
      return dateString;
    }
  };

  const columns: ColumnDef<TOrder>[] = [
    // 1. Purchased Product
    {
      id: "product",
      accessorFn: (row) => row.itemID?.title || "",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-bold text-xs text-slate-700 dark:text-zinc-300 hover:text-slate-900"
        >
          <span>Purchased Item</span>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ),
      cell: ({ row }) => {
        const order = row.original;
        const item = order.itemID;
        const firstImg = item?.images && item.images.length > 0 ? item.images[0] : "";

        return (
          <div className="flex items-center gap-3 min-w-[200px] max-w-[300px]">
            <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-slate-200 dark:border-zinc-700 flex items-center justify-center">
              {firstImg ? (
                <Image
                  src={firstImg}
                  alt={item?.title || "Item"}
                  fill
                  className="object-cover"
                />
              ) : (
                <Package className="w-5 h-5 text-slate-400" />
              )}
            </div>

            <div className="min-w-0 space-y-0.5">
              <p className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white truncate">
                {item?.title || "Purchased Product"}
              </p>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground">
                <span className="capitalize">{item?.category || "Second-hand"}</span>
                {item?._id && (
                  <>
                    <span>•</span>
                    <Link
                      href={`/products/${item._id}`}
                      className="text-amber-600 hover:text-amber-700 dark:text-amber-400 inline-flex items-center gap-0.5 font-medium"
                      title="View product details"
                    >
                      <span>View</span>
                      <ExternalLink className="w-2.5 h-2.5" />
                    </Link>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      },
    },

    // 2. Seller Details
    {
      id: "seller",
      accessorFn: (row) => `${row.sellerID?.name || ""} ${row.sellerID?.identifier || ""}`,
      header: "Seller Contact",
      cell: ({ row }) => {
        const seller = row.original.sellerID;
        return (
          <div className="space-y-0.5 min-w-[150px]">
            <div className="flex items-center gap-1.5">
              <User className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400 shrink-0" />
              <p className="text-xs sm:text-sm font-bold text-slate-800 dark:text-zinc-200 capitalize truncate">
                {seller?.name || seller?.identifier || "Seller"}
              </p>
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
              <Mail className="w-3 h-3 text-slate-400 shrink-0" />
              <span className="truncate">{seller?.identifier || "—"}</span>
            </div>
          </div>
        );
      },
    },

    // 3. Paid Price
    {
      id: "price",
      accessorFn: (row) => row.itemID?.price || 0,
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-bold text-xs text-slate-700 dark:text-zinc-300 hover:text-slate-900"
        >
          <span>Paid Amount</span>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ),
      cell: ({ row }) => {
        const price = row.original.itemID?.price;
        return (
          <div className="font-extrabold text-sm text-[#F59E0B]">
            ৳ {price ? Number(price).toLocaleString() : "0"}
          </div>
        );
      },
    },

    // 4. Payment & TXN
    {
      accessorKey: "transactionId",
      header: "Payment & TXN",
      cell: ({ row }) => {
        const order = row.original;
        return (
          <div className="space-y-1 min-w-[140px]">
            <Badge
              variant="outline"
              className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700"
            >
              {order.paymentMethod === "online" ? "SSLCommerz Online" : "Online"}
            </Badge>
            <div className="text-[11px] font-mono text-slate-500 dark:text-zinc-400 truncate max-w-[150px]">
              {order.transactionId || "—"}
            </div>
          </div>
        );
      },
    },

    // 5. Date
    {
      accessorKey: "createdAt",
      header: ({ column }) => (
        <button
          type="button"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-bold text-xs text-slate-700 dark:text-zinc-300 hover:text-slate-900"
        >
          <span>Purchase Date</span>
          <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
        </button>
      ),
      cell: ({ row }) => {
        return (
          <div className="flex items-center gap-1.5 text-xs text-slate-600 dark:text-zinc-400 whitespace-nowrap">
            <Calendar className="w-3.5 h-3.5 text-slate-400" />
            <span>{formatDate(row.getValue("createdAt"))}</span>
          </div>
        );
      },
    },

    // 6. Status
    {
      accessorKey: "status",
      header: "Order Status",
      cell: ({ row }) => {
        const order = row.original;
        const isCompleted = order.status === "completed";

        return (
          <span
            className={`inline-flex items-center px-2.5 py-1 text-xs font-bold rounded-full border ${
              isCompleted
                ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80"
                : "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200"
            }`}
          >
            <span className="capitalize">{order.status || "Pending"}</span>
          </span>
        );
      },
    },

    // 7. Action
    {
      id: "actions",
      header: "Receipt",
      cell: ({ row }) => {
        const item = row.original.itemID;
        return (
          <div>
            {item?._id ? (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-7 px-2.5 text-xs rounded-lg border-slate-200 hover:bg-amber-50 hover:text-amber-700 dark:hover:bg-zinc-800"
              >
                <Link href={`/products/${item._id}`}>
                  <Receipt className="w-3 h-3 mr-1 text-amber-500" />
                  <span>Item</span>
                </Link>
              </Button>
            ) : (
              <span className="text-slate-400 text-xs">—</span>
            )}
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: dataList,
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

  const handleStatusFilterChange = (val: string) => {
    setSelectedStatus(val);
    if (val === "all") {
      table.getColumn("status")?.setFilterValue(undefined);
    } else {
      table.getColumn("status")?.setFilterValue(val);
    }
  };

  const handleGlobalSearch = (val: string) => {
    table.getColumn("product")?.setFilterValue(val || undefined);
  };

  const isFiltered =
    Boolean(table.getColumn("product")?.getFilterValue()) || selectedStatus !== "all";

  const handleResetFilters = () => {
    table.getColumn("product")?.setFilterValue(undefined);
    handleStatusFilterChange("all");
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-[#F59E0B]/10 text-[#F59E0B] flex items-center justify-center font-bold">
              <ShoppingBag className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                  Purchase History & Receipts
                </h1>
                <Badge
                  variant="secondary"
                  className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs px-2 py-0.5"
                >
                  {totalCount} Total
                </Badge>
              </div>
              <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
                Review your acquired pre-loved items, payment proofs, and seller contacts.
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            asChild
            className="h-10 px-4 rounded-xl text-xs font-bold bg-[#F59E0B] hover:bg-[#D97706] text-white shadow-md shadow-amber-500/20 transition-all flex items-center gap-1.5"
          >
            <Link href="/products">
              <Store className="w-4 h-4" />
              <span>Explore Marketplace</span>
            </Link>
          </Button>
        </div>
      </div>

      {/* 2. 4 Metric KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Purchases */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Total Purchases
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalCount}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Total Amount Spent */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Total Spent
              </span>
              <p className="text-2xl font-extrabold text-[#F59E0B]">
                ৳ {totalSpent.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 ring-1 ring-amber-200 dark:ring-amber-800/60">
              <Wallet className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Completed Deliveries */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Completed
              </span>
              <p className="text-2xl font-extrabold text-amber-700 dark:text-amber-400">
                {completedOrders.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 ring-1 ring-amber-200 dark:ring-amber-800/60">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        {/* Pending Orders */}
        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Pending Delivery
              </span>
              <p className="text-2xl font-extrabold text-slate-700 dark:text-zinc-300">
                {pendingOrders.length}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 ring-1 ring-slate-200 dark:ring-zinc-700">
              <Clock className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 3. Search & Multi-Filter Toolbar */}
      <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs p-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
          {/* Search box */}
          <div className="relative flex-1 min-w-[240px] max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <Input
              placeholder="Search purchases by product title..."
              value={(table.getColumn("product")?.getFilterValue() as string) ?? ""}
              onChange={(e) => handleGlobalSearch(e.target.value)}
              className="pl-9 pr-8 h-9 text-xs rounded-xl bg-slate-50/60 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700"
            />
            {Boolean(table.getColumn("product")?.getFilterValue()) && (
              <button
                onClick={() => handleGlobalSearch("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={handleStatusFilterChange}>
              <SelectTrigger className="w-[140px] h-9 text-xs rounded-xl bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="completed">Completed</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
              </SelectContent>
            </Select>

            {/* Reset Filters button */}
            {isFiltered && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleResetFilters}
                className="h-9 px-2.5 text-xs text-amber-600 hover:text-amber-700 hover:bg-amber-50 dark:hover:bg-amber-950/40 rounded-xl"
              >
                <X className="w-3.5 h-3.5 mr-1" />
                Reset
              </Button>
            )}

            {/* Columns Customizer */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-9 px-3 text-xs rounded-xl border-slate-200 dark:border-zinc-700 gap-1.5 ml-auto"
                >
                  <SlidersHorizontal className="w-3.5 h-3.5" />
                  <span>Columns</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl">
                <DropdownMenuLabel className="text-xs">Toggle Columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => (
                    <DropdownMenuCheckboxItem
                      key={column.id}
                      className="capitalize text-xs"
                      checked={column.getIsVisible()}
                      onCheckedChange={(value) => column.toggleVisibility(!!value)}
                    >
                      {column.id}
                    </DropdownMenuCheckboxItem>
                  ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </Card>

      {/* 4. TanStack Table Container */}
      <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/70 dark:bg-zinc-800/50">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="border-b border-slate-200/80 dark:border-zinc-800 hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 text-xs font-bold text-slate-700 dark:text-zinc-300 uppercase tracking-wider"
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(header.column.columnDef.header, header.getContext())}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>

          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  className="border-b border-slate-100 dark:border-zinc-800/80 hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3.5 text-xs">
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-64 text-center p-8"
                >
                  <div className="flex flex-col items-center justify-center space-y-3 max-w-sm mx-auto">
                    <div className="w-14 h-14 rounded-2xl bg-amber-500/10 text-amber-600 flex items-center justify-center">
                      <ShoppingBag className="w-7 h-7" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                        No Purchases Found
                      </p>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        {isFiltered
                          ? "Try resetting your search query or status filter to see other orders."
                          : "Items you purchase on ReSellBD will be tracked here with verified transaction receipts."}
                      </p>
                    </div>
                    {isFiltered ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        className="rounded-xl text-xs"
                      >
                        Reset Filters
                      </Button>
                    ) : (
                      <Button
                        asChild
                        size="sm"
                        className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-xl text-xs"
                      >
                        <Link href="/products">
                          <Store className="w-3.5 h-3.5 mr-1" />
                          Explore Marketplace
                        </Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* 5. Pagination Bar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 p-4 border-t border-slate-100 dark:border-zinc-800 bg-slate-50/40 dark:bg-zinc-900/40 text-xs text-muted-foreground">
          <div>
            Showing{" "}
            <strong>
              {table.getFilteredRowModel().rows.length === 0
                ? 0
                : table.getState().pagination.pageIndex *
                    table.getState().pagination.pageSize +
                  1}
            </strong>{" "}
            to{" "}
            <strong>
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                table.getFilteredRowModel().rows.length
              )}
            </strong>{" "}
            of <strong>{table.getFilteredRowModel().rows.length}</strong> purchases
          </div>

          <div className="flex items-center space-x-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
              className="h-8 px-3 rounded-lg text-xs font-semibold border-slate-200 dark:border-zinc-700"
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
              className="h-8 px-3 rounded-lg text-xs font-semibold border-slate-200 dark:border-zinc-700"
            >
              Next
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
