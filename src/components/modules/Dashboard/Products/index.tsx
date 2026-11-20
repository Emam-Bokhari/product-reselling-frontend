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
  AlertTriangle,
  ArrowUpDown,
  CheckCircle2,
  ChevronDown,
  Clock,
  ExternalLink,
  Eye,
  MoreHorizontal,
  Package,
  Pencil,
  Plus,
  Search,
  ShoppingBag,
  SlidersHorizontal,
  Tag,
  Trash2,
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
import { toast } from "sonner";
import { TProduct } from "@/types";
import { deleteProductById, updateProductStatusById } from "@/services/Product";

// Consistent category styling - ReSellBD Brand Palette
const categoryConfig: Record<string, { label: string; badge: string }> = {
  mobiles: {
    label: "Mobiles",
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
  },
  electronics: {
    label: "Electronics",
    badge: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
  },
  vehicles: {
    label: "Vehicles",
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
  },
  property: {
    label: "Property",
    badge: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
  },
  home: {
    label: "Home & Living",
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
  },
  cloths: {
    label: "Fashion",
    badge: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
  },
  sports: {
    label: "Sports",
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
  },
  pets: {
    label: "Pets",
    badge: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
  },
};

const conditionConfig: Record<string, { label: string; badge: string }> = {
  new: {
    label: "Brand New",
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
  },
  likeNew: {
    label: "Like New",
    badge: "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60",
  },
  used: {
    label: "Used",
    badge: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
  },
  refurbished: {
    label: "Refurbished",
    badge: "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700",
  },
};

export default function ManageProducts({ products = [] }: { products: TProduct[] }) {
  const [productList, setProductList] = React.useState<TProduct[]>(products);
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Filter dropdown states
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("all");

  // Delete modal state
  const [productToDelete, setProductToDelete] = React.useState<TProduct | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Sync state if products prop changes
  React.useEffect(() => {
    setProductList(products);
  }, [products]);

  // Metric summaries
  const totalCount = productList.length;
  const availableCount = productList.filter((p) => p.status === "available").length;
  const soldCount = productList.filter((p) => p.status === "sold").length;
  const totalCatalogValue = productList.reduce(
    (acc, curr) => acc + (Number(curr.price) || 0),
    0
  );

  // Delete handler
  const handleConfirmDelete = async () => {
    if (!productToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteProductById(productToDelete._id);
      if (response?.success) {
        setProductList((prev) => prev.filter((p) => p._id !== productToDelete._id));
        toast.success("Listing deleted successfully");
      } else {
        toast.error(response?.message || "Failed to delete listing");
      }
    } catch {
      toast.error("Something went wrong while deleting");
    } finally {
      setIsDeleting(false);
      setProductToDelete(null);
    }
  };

  // Status update handler
  const handleUpdateProductStatus = async (id: string, newStatus: string) => {
    try {
      const response = await updateProductStatusById(id, { status: newStatus });
      if (response?.success) {
        setProductList((prev) =>
          prev.map((item) =>
            item._id === id ? { ...item, status: newStatus as any } : item
          )
        );
        toast.success(`Product marked as ${newStatus}`);
      } else {
        toast.error(response?.message || "Status update failed");
      }
    } catch {
      toast.error("Network error while updating status");
    }
  };

  // Format date helper
  const formatDate = (dateString?: string) => {
    if (!dateString) return "—";
    try {
      return new Intl.DateTimeFormat("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }).format(new Date(dateString));
    } catch {
      return dateString;
    }
  };

  // Columns definition
  const columns: ColumnDef<TProduct>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-bold hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <span>Product</span>
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      ),
      cell: ({ row }) => {
        const product = row.original;
        const firstImage = product.images?.[0];

        return (
          <div className="flex items-center gap-3.5 py-1">
            {/* Thumbnail */}
            <div className="relative w-12 h-12 rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-slate-200/80 dark:border-zinc-700/80 flex items-center justify-center group-hover:border-amber-500/40 transition-colors">
              {firstImage ? (
                <Image
                  src={firstImage}
                  alt={product.title}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <Package className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 max-w-[280px] space-y-0.5">
              <Link
                href={`/products/${product._id}`}
                className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block"
                title={product.title}
              >
                {product.title}
              </Link>
              <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted-foreground">
                {product.brand && (
                  <span className="font-semibold text-slate-700 dark:text-zinc-300">
                    {product.brand}
                  </span>
                )}
                {product.brand && <span>•</span>}
                <span className="capitalize">{product.location || "Bangladesh"}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const cat = (row.getValue("category") as string)?.toLowerCase();
        const conf = categoryConfig[cat] || {
          label: cat || "General",
          badge: "bg-slate-500/10 text-slate-700 dark:text-zinc-300 border-slate-500/20",
        };

        return (
          <Badge
            variant="outline"
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${conf.badge}`}
          >
            {conf.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "price",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-bold hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <span>Price</span>
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      ),
      cell: ({ row }) => {
        const price = Number(row.getValue("price")) || 0;
        const isNegotiable = row.original.negotiable === "yes";

        return (
          <div className="space-y-0.5">
            <div className="font-extrabold text-xs sm:text-sm text-amber-600 dark:text-amber-400">
              ৳ {price.toLocaleString()}
            </div>
            <span
              className={`text-[10px] font-semibold uppercase tracking-wider ${
                isNegotiable
                  ? "text-amber-700 dark:text-amber-300"
                  : "text-slate-400 dark:text-zinc-500"
              }`}
            >
              {isNegotiable ? "Negotiable" : "Fixed Price"}
            </span>
          </div>
        );
      },
    },
    {
      accessorKey: "condition",
      header: "Condition",
      cell: ({ row }) => {
        const condition = row.getValue("condition") as string;
        const conf = conditionConfig[condition] || {
          label: condition || "Used",
          badge: "bg-slate-500/10 text-slate-700 dark:text-zinc-300 border-slate-500/20",
        };

        return (
          <Badge
            variant="outline"
            className={`text-[11px] font-medium px-2 py-0.5 rounded-md border ${conf.badge}`}
          >
            {conf.label}
          </Badge>
        );
      },
    },
    {
      accessorKey: "status",
      header: "Availability",
      cell: ({ row }) => {
        const product = row.original;
        const isAvailable = product.status === "available";

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border transition-all cursor-pointer ${
                  isAvailable
                    ? "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-300/80 dark:border-amber-800/60 hover:bg-amber-100/70"
                    : "bg-slate-100 text-slate-600 dark:bg-zinc-800 dark:text-zinc-400 border-slate-200 dark:border-zinc-700 hover:bg-slate-200/60"
                }`}
              >
                <span
                  className={`w-1.5 h-1.5 rounded-full ${
                    isAvailable ? "bg-amber-500 animate-pulse" : "bg-slate-400"
                  }`}
                />
                <span className="capitalize">{product.status || "available"}</span>
                <ChevronDown className="w-3 h-3 opacity-60 ml-0.5" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-40 rounded-xl shadow-lg border-slate-200 dark:border-zinc-800">
              <DropdownMenuLabel className="text-xs text-muted-foreground">
                Set Availability
              </DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem
                onClick={() => handleUpdateProductStatus(product._id, "available")}
                className="flex items-center justify-between text-xs cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-500" />
                  <span>Available</span>
                </div>
                {isAvailable && <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => handleUpdateProductStatus(product._id, "sold")}
                className="flex items-center justify-between text-xs cursor-pointer font-medium"
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-slate-400" />
                  <span>Sold</span>
                </div>
                {!isAvailable && <CheckCircle2 className="w-3.5 h-3.5 text-slate-600" />}
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
          <span>Listed On</span>
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      ),
      cell: ({ row }) => (
        <span className="text-xs text-muted-foreground flex items-center gap-1">
          <Clock className="w-3 h-3 opacity-70" />
          {formatDate(row.getValue("createdAt"))}
        </span>
      ),
    },
    {
      id: "actions",
      header: "Actions",
      enableHiding: false,
      cell: ({ row }) => {
        const product = row.original;

        return (
          <div className="flex items-center gap-1 justify-end">
            {/* View store shortcut */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg"
              title="View in Store"
            >
              <Link href={`/products/${product._id}`}>
                <Eye className="w-4 h-4" />
              </Link>
            </Button>

            {/* Edit shortcut */}
            <Button
              asChild
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-slate-500 hover:text-blue-600 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg"
              title="Edit Listing"
            >
              <Link href={`/user/dashboard/products/update-product/${product._id}`}>
                <Pencil className="w-4 h-4" />
              </Link>
            </Button>

            {/* More Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-slate-900 rounded-lg"
                >
                  <MoreHorizontal className="w-4 h-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-44 rounded-xl shadow-lg border-slate-200 dark:border-zinc-800">
                <DropdownMenuLabel className="text-xs text-muted-foreground">
                  Listing Options
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link
                    href={`/products/${product._id}`}
                    className="flex items-center gap-2 text-xs font-medium cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    <span>View Public Page</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/user/dashboard/products/update-product/${product._id}`}
                    className="flex items-center gap-2 text-xs font-medium cursor-pointer"
                  >
                    <Pencil className="w-3.5 h-3.5 text-blue-500" />
                    <span>Edit Details</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setProductToDelete(product)}
                  className="flex items-center gap-2 text-xs font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30 cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Delete Listing</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  // React Table setup
  const table = useReactTable({
    data: productList,
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

  // Handle category filter
  const handleCategoryChange = (val: string) => {
    setSelectedCategory(val);
    if (val === "all") {
      table.getColumn("category")?.setFilterValue(undefined);
    } else {
      table.getColumn("category")?.setFilterValue(val);
    }
  };

  // Handle status filter
  const handleStatusChange = (val: string) => {
    setSelectedStatus(val);
    if (val === "all") {
      table.getColumn("status")?.setFilterValue(undefined);
    } else {
      table.getColumn("status")?.setFilterValue(val);
    }
  };

  const isFiltered =
    Boolean(table.getColumn("title")?.getFilterValue()) ||
    selectedCategory !== "all" ||
    selectedStatus !== "all";

  const handleResetFilters = () => {
    table.getColumn("title")?.setFilterValue("");
    handleCategoryChange("all");
    handleStatusChange("all");
  };

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Inventory & Listed Products
            </h1>
            <Badge variant="secondary" className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs px-2 py-0.5">
              {totalCount} Total
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
            Manage your second-hand catalog, track inventory value, and update listing prices.
          </p>
        </div>

        <Button
          asChild
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-amber-500/25 transition-all self-start sm:self-auto"
        >
          <Link href="/user/dashboard/products/add-product">
            <Plus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Post New Listing
          </Link>
        </Button>
      </div>

      {/* 2. 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Total Listed
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalCount}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300">
              <Package className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Available for Sale
              </span>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                {availableCount}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 ring-1 ring-amber-200 dark:ring-amber-800/60">
              <CheckCircle2 className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Sold Out
              </span>
              <p className="text-2xl font-extrabold text-slate-700 dark:text-zinc-300">
                {soldCount}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-slate-100 dark:bg-zinc-800 text-slate-600 ring-1 ring-slate-200 dark:ring-zinc-700">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Catalog Value
              </span>
              <p className="text-2xl font-extrabold text-amber-600 dark:text-amber-400">
                ৳ {totalCatalogValue.toLocaleString()}
              </p>
            </div>
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 ring-1 ring-amber-200 dark:ring-amber-800/60">
              <Wallet className="w-5 h-5" />
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
              placeholder="Search product by title..."
              value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
              onChange={(e) =>
                table.getColumn("title")?.setFilterValue(e.target.value)
              }
              className="pl-9 pr-8 h-9 text-xs rounded-xl bg-slate-50/60 dark:bg-zinc-800/60 border-slate-200 dark:border-zinc-700"
            />
            {Boolean(table.getColumn("title")?.getFilterValue()) && (
              <button
                onClick={() => table.getColumn("title")?.setFilterValue("")}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filter dropdowns */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Category Filter */}
            <Select value={selectedCategory} onValueChange={handleCategoryChange}>
              <SelectTrigger className="w-[145px] h-9 text-xs rounded-xl bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="mobiles">Mobiles</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="vehicles">Vehicles</SelectItem>
                <SelectItem value="property">Property</SelectItem>
                <SelectItem value="home">Home & Living</SelectItem>
                <SelectItem value="cloths">Fashion</SelectItem>
                <SelectItem value="sports">Sports</SelectItem>
                <SelectItem value="pets">Pets</SelectItem>
              </SelectContent>
            </Select>

            {/* Status Filter */}
            <Select value={selectedStatus} onValueChange={handleStatusChange}>
              <SelectTrigger className="w-[130px] h-9 text-xs rounded-xl bg-white dark:bg-zinc-800 border-slate-200 dark:border-zinc-700">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="available">Available</SelectItem>
                <SelectItem value="sold">Sold</SelectItem>
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

      {/* 4. Professional Data Table */}
      <div className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs overflow-hidden">
        <Table>
          <TableHeader className="bg-slate-50/80 dark:bg-zinc-900/80 border-b border-slate-200/80 dark:border-zinc-800">
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id} className="hover:bg-transparent">
                {headerGroup.headers.map((header) => (
                  <TableHead
                    key={header.id}
                    className="h-11 px-4 text-xs font-bold text-slate-600 dark:text-zinc-400 uppercase tracking-wider whitespace-nowrap"
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

          <TableBody className="divide-y divide-slate-100 dark:divide-zinc-800/80">
            {table.getRowModel().rows.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                  className="hover:bg-slate-50/70 dark:hover:bg-zinc-800/40 transition-colors group"
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="px-4 py-3">
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
                  className="h-48 text-center p-8"
                >
                  <div className="flex flex-col items-center justify-center space-y-3">
                    <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-zinc-800 flex items-center justify-center text-slate-400">
                      <Tag className="w-6 h-6" />
                    </div>
                    <div className="space-y-1">
                      <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
                        {isFiltered
                          ? "No products match your filter criteria"
                          : "No products listed in your inventory yet"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {isFiltered
                          ? "Try clearing filters or search term to see all listings."
                          : "Post your first pre-loved listing to start selling across Bangladesh."}
                      </p>
                    </div>
                    {isFiltered ? (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleResetFilters}
                        className="rounded-xl text-xs mt-1"
                      >
                        Clear Filters
                      </Button>
                    ) : (
                      <Button
                        asChild
                        size="sm"
                        className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold rounded-xl text-xs mt-1"
                      >
                        <Link href="/user/dashboard/products/add-product">
                          <Plus className="w-3.5 h-3.5 mr-1" />
                          Post First Listing
                        </Link>
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>

        {/* 5. Pagination & Counter Footer */}
        <div className="p-4 bg-slate-50/50 dark:bg-zinc-900/60 border-t border-slate-100 dark:border-zinc-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="text-muted-foreground">
            Showing{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {table.getRowModel().rows.length}
            </span>{" "}
            of{" "}
            <span className="font-semibold text-slate-800 dark:text-slate-200">
              {productList.length}
            </span>{" "}
            listings
          </div>

          <div className="flex items-center gap-2 self-end sm:self-auto">
            <span className="text-muted-foreground">
              Page {table.getState().pagination.pageIndex + 1} of{" "}
              {Math.max(1, table.getPageCount())}
            </span>

            <div className="flex items-center space-x-1.5 ml-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
                className="h-8 px-3 rounded-lg text-xs"
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
                className="h-8 px-3 rounded-lg text-xs"
              >
                Next
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* 6. Delete Confirmation Modal */}
      <Dialog
        open={Boolean(productToDelete)}
        onOpenChange={(open) => !open && setProductToDelete(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl">
          <DialogHeader className="space-y-2">
            <div className="w-10 h-10 rounded-full bg-red-500/10 text-red-600 flex items-center justify-center">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <DialogTitle className="text-base font-bold text-slate-900 dark:text-white">
              Delete Product Listing?
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed">
              Are you sure you want to permanently delete{" "}
              <strong className="text-slate-800 dark:text-slate-200">
                &ldquo;{productToDelete?.title}&rdquo;
              </strong>
              ? This action cannot be reversed and the listing will be removed from the public marketplace.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="gap-2 sm:gap-0 mt-3">
            <DialogClose asChild>
              <Button variant="outline" size="sm" className="rounded-xl text-xs">
                Cancel
              </Button>
            </DialogClose>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleConfirmDelete}
              disabled={isDeleting}
              className="rounded-xl text-xs font-semibold ml-2"
            >
              {isDeleting ? "Deleting..." : "Yes, Delete Listing"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
