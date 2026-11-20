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
  BookOpen,
  Calendar,
  ChevronDown,
  Edit,
  ExternalLink,
  Eye,
  FilePlus,
  FolderOpen,
  Loader2,
  MoreHorizontal,
  PenTool,
  Search,
  SlidersHorizontal,
  Trash2,
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
import { TBlog } from "@/types";
import { deleteBlogById } from "@/services/Blog";
import moment from "moment-timezone";

// Category badge color mapping helper (deterministic, beautiful palettes)
const getCategoryBadgeClass = (category?: string) => {
  if (!category) {
    return "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700";
  }
  const normalized = category.toLowerCase().trim();
  if (normalized.includes("tech") || normalized.includes("mobile") || normalized.includes("electronic")) {
    return "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60";
  }
  if (normalized.includes("guide") || normalized.includes("tip") || normalized.includes("advice")) {
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60";
  }
  if (normalized.includes("lifestyle") || normalized.includes("fashion") || normalized.includes("cloth")) {
    return "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60";
  }
  if (normalized.includes("safety") || normalized.includes("security") || normalized.includes("resell")) {
    return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300 border-emerald-200/80 dark:border-emerald-800/60";
  }
  return "bg-amber-50 text-amber-800 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60";
};

export default function ManageBlogs({ blogs = [] }: { blogs: TBlog[] }) {
  const [blogList, setBlogList] = React.useState<TBlog[]>(blogs);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("all");

  // Dialog states
  const [selectedBlogForPreview, setSelectedBlogForPreview] = React.useState<TBlog | null>(null);
  const [blogToDelete, setBlogToDelete] = React.useState<TBlog | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Sync blogs prop
  React.useEffect(() => {
    setBlogList(blogs);
  }, [blogs]);

  // Derived metrics
  const totalCount = blogList.length;
  const uniqueCategories = React.useMemo(() => {
    const set = new Set<string>();
    blogList.forEach((b) => {
      if (b.category) set.add(b.category);
    });
    return Array.from(set);
  }, [blogList]);

  const uniqueAuthors = React.useMemo(() => {
    const set = new Set<string>();
    blogList.forEach((b) => {
      if (b.authorName) set.add(b.authorName);
    });
    return Array.from(set);
  }, [blogList]);

  const latestBlogDate = React.useMemo(() => {
    if (!blogList.length) return "None";
    const sorted = [...blogList].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    return sorted[0]?.createdAt
      ? moment.tz(sorted[0].createdAt, "UTC").format("MMM D, YYYY")
      : "Recent";
  }, [blogList]);

  // Handle delete blog
  const confirmDeleteBlog = async () => {
    if (!blogToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteBlogById(blogToDelete._id);
      if (response?.success) {
        toast.success(`Blog "${blogToDelete.title}" deleted successfully`);
        setBlogList((prev) => prev.filter((b) => b._id !== blogToDelete._id));
        setBlogToDelete(null);
      } else {
        toast.error(response?.error?.[0]?.message || "Failed to delete blog");
      }
    } catch {
      toast.error("Something went wrong while deleting article!");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered dataset
  const filteredBlogs = React.useMemo(() => {
    return blogList.filter((b) => {
      // Category filter
      if (
        selectedCategory !== "all" &&
        b.category?.toLowerCase() !== selectedCategory.toLowerCase()
      ) {
        return false;
      }
      // Search query across title, authorName, tags, introduction
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const titleMatch = b.title?.toLowerCase().includes(q);
        const authorMatch = b.authorName?.toLowerCase().includes(q);
        const introMatch = b.introduction?.toLowerCase().includes(q);
        const catMatch = b.category?.toLowerCase().includes(q);
        const tagMatch = b.tags?.some((t) => t.toLowerCase().includes(q));
        return titleMatch || authorMatch || introMatch || catMatch || tagMatch;
      }
      return true;
    });
  }, [blogList, selectedCategory, searchQuery]);

  const columns: ColumnDef<TBlog>[] = [
    {
      accessorKey: "title",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-bold hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <span>Article Details</span>
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      ),
      cell: ({ row }) => {
        const blog = row.original;

        return (
          <div className="flex items-center gap-3.5 py-1">
            {/* Thumbnail */}
            <div className="relative w-14 h-14 rounded-xl bg-slate-100 dark:bg-zinc-800 overflow-hidden shrink-0 border border-slate-200/80 dark:border-zinc-700 flex items-center justify-center group-hover:border-amber-500/40 transition-colors shadow-2xs">
              {blog.thumbnail ? (
                <Image
                  src={blog.thumbnail}
                  alt={blog.title || "Blog Thumbnail"}
                  fill
                  className="object-cover transition-transform group-hover:scale-105"
                />
              ) : (
                <BookOpen className="w-5 h-5 text-slate-400" />
              )}
            </div>

            {/* Info */}
            <div className="min-w-0 max-w-[320px] space-y-1">
              <button
                type="button"
                onClick={() => setSelectedBlogForPreview(blog)}
                className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block text-left capitalize"
                title={blog.title}
              >
                {blog.title}
              </button>
              {blog.introduction && (
                <p className="text-[11px] text-muted-foreground line-clamp-1">
                  {blog.introduction}
                </p>
              )}
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "category",
      header: "Category",
      cell: ({ row }) => {
        const cat = row.getValue("category") as string;
        const badgeStyle = getCategoryBadgeClass(cat);

        return (
          <Badge
            variant="outline"
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${badgeStyle}`}
          >
            {cat || "General"}
          </Badge>
        );
      },
    },
    {
      accessorKey: "authorName",
      header: "Author",
      cell: ({ row }) => {
        const author = row.original.authorName || "Editorial Team";

        return (
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700 dark:text-zinc-300">
            <PenTool className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span className="capitalize">{author}</span>
          </div>
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
          <span>Published Date</span>
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
        const blog = row.original;

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedBlogForPreview(blog)}
              title="Preview article"
              className="h-8 w-8 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              title="Edit article"
              className="h-8 w-8 text-slate-600 dark:text-zinc-400 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-950/30 rounded-lg transition-colors"
            >
              <Link href={`/admin/dashboard/blogs/update-blog/${blog._id}`}>
                <Edit className="w-4 h-4" />
              </Link>
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
                  Article Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSelectedBlogForPreview(blog)}
                  className="text-xs cursor-pointer flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  Quick Preview
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/blogs/${blog._id}`}
                    target="_blank"
                    className="text-xs cursor-pointer flex items-center gap-2"
                  >
                    <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                    View Live Page
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link
                    href={`/admin/dashboard/blogs/update-blog/${blog._id}`}
                    className="text-xs cursor-pointer flex items-center gap-2"
                  >
                    <Edit className="w-3.5 h-3.5 text-blue-500" />
                    Edit Content
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setBlogToDelete(blog)}
                  className="text-xs cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  Delete Post
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredBlogs,
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
    setSelectedCategory("all");
  };

  const isFiltered = searchQuery !== "" || selectedCategory !== "all";

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Call to Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Blog & Article Hub
            </h1>
            <Badge
              variant="secondary"
              className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold"
            >
              {totalCount} Articles
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Create, curate, and oversee editorial content, buying advice, and platform announcements.
          </p>
        </div>

        <Button
          asChild
          className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold px-4 py-2.5 rounded-xl shadow-md hover:shadow-amber-500/25 transition-all self-start sm:self-auto border border-amber-400/60"
        >
          <Link href="/admin/dashboard/blogs/add-blog">
            <FilePlus className="w-4 h-4 mr-1.5 stroke-[2.5]" />
            Write New Article
          </Link>
        </Button>
      </div>

      {/* 2. 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Total Articles
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalCount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Published community posts
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800/60 shrink-0">
              <BookOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Topic Categories
              </span>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {uniqueCategories.length}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Distinct topic verticals
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800/60 shrink-0">
              <FolderOpen className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Authors / Writers
              </span>
              <p className="text-2xl font-extrabold text-emerald-600 dark:text-emerald-400">
                {uniqueAuthors.length}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Content contributors
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 ring-1 ring-emerald-200 dark:ring-emerald-800/60 shrink-0">
              <PenTool className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Latest Post
              </span>
              <p className="text-sm sm:text-base font-extrabold text-purple-600 dark:text-purple-400 pt-1">
                {latestBlogDate}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Most recent publication
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 ring-1 ring-purple-200 dark:ring-purple-800/60 shrink-0">
              <Calendar className="w-5 h-5 stroke-[2.2]" />
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
                placeholder="Search articles by title, author, category, or tags..."
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
              {/* Category Select */}
              <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                <SelectTrigger className="w-[160px] h-10 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs font-semibold">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Categories</SelectItem>
                  {uniqueCategories.map((cat) => (
                    <SelectItem key={cat} value={cat} className="capitalize">
                      {cat}
                    </SelectItem>
                  ))}
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

      {/* 4. Blogs Table */}
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
                        <BookOpen className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                        No articles found
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        {isFiltered
                          ? "Try adjusting your search query or category filter."
                          : "There are currently no articles in the blog directory."}
                      </p>
                      {isFiltered ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleResetFilters}
                          className="mt-2 text-xs rounded-xl"
                        >
                          Clear all filters
                        </Button>
                      ) : (
                        <Button
                          asChild
                          size="sm"
                          className="mt-2 text-xs rounded-xl bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
                        >
                          <Link href="/admin/dashboard/blogs/add-blog">
                            Write First Article
                          </Link>
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
                (filteredBlogs.length > 0 ? 1 : 0)}
            </span>{" "}
            to{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                filteredBlogs.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {filteredBlogs.length}
            </span>{" "}
            articles
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

      {/* Article Quick Preview Dialog */}
      <Dialog
        open={Boolean(selectedBlogForPreview)}
        onOpenChange={(open) => !open && setSelectedBlogForPreview(null)}
      >
        <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto rounded-2xl p-6">
          <DialogHeader className="border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <Badge
                variant="outline"
                className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${getCategoryBadgeClass(
                  selectedBlogForPreview?.category
                )}`}
              >
                {selectedBlogForPreview?.category || "Article"}
              </Badge>
              <span className="text-[11px] text-muted-foreground flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {selectedBlogForPreview?.createdAt
                  ? moment.tz(selectedBlogForPreview.createdAt, "UTC").format("MMMM D, YYYY")
                  : "Recently"}
              </span>
            </div>
            <DialogTitle className="text-xl font-extrabold text-slate-900 dark:text-white capitalize">
              {selectedBlogForPreview?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-1">
              <span className="flex items-center gap-1 font-semibold text-slate-700 dark:text-zinc-300">
                <PenTool className="w-3 h-3 text-amber-500" />
                {selectedBlogForPreview?.authorName || "Editorial Team"}
              </span>
            </DialogDescription>
          </DialogHeader>

          {selectedBlogForPreview && (
            <div className="space-y-4 pt-2 text-xs">
              {/* Thumbnail Display */}
              {selectedBlogForPreview.thumbnail && (
                <div className="relative w-full h-56 rounded-xl overflow-hidden bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700">
                  <Image
                    src={selectedBlogForPreview.thumbnail}
                    alt={selectedBlogForPreview.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              {/* Introduction Quote */}
              {selectedBlogForPreview.introduction && (
                <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 text-slate-800 dark:text-zinc-200 text-xs sm:text-sm font-medium leading-relaxed italic">
                  &ldquo;{selectedBlogForPreview.introduction}&rdquo;
                </div>
              )}

              {/* Main Content Body Preview */}
              {selectedBlogForPreview.mainContent && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Article Content Preview
                  </span>
                  <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 text-slate-700 dark:text-zinc-300 text-xs leading-relaxed whitespace-pre-wrap max-h-60 overflow-y-auto">
                    {selectedBlogForPreview.mainContent}
                  </div>
                </div>
              )}

              {/* Tags */}
              {selectedBlogForPreview.tags && selectedBlogForPreview.tags.length > 0 && (
                <div className="space-y-1.5">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                    Tags
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    {selectedBlogForPreview.tags.map((t, idx) => (
                      <Badge
                        key={idx}
                        variant="secondary"
                        className="bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 text-[10px] px-2 py-0.5 rounded-md"
                      >
                        #{t}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="border-t border-slate-100 dark:border-zinc-800 pt-3 flex flex-row items-center justify-between">
            {selectedBlogForPreview && (
              <Button
                asChild
                variant="outline"
                size="sm"
                className="h-8 rounded-xl text-xs gap-1.5 text-amber-600 dark:text-amber-400"
              >
                <Link href={`/blogs/${selectedBlogForPreview._id}`} target="_blank">
                  <ExternalLink className="w-3.5 h-3.5" />
                  View Public Page
                </Link>
              </Button>
            )}
            <DialogClose asChild>
              <Button
                variant="outline"
                className="h-8 px-4 rounded-xl border-slate-200 dark:border-zinc-700 text-xs font-semibold"
              >
                Close
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Blog Confirmation Dialog */}
      <Dialog
        open={Boolean(blogToDelete)}
        onOpenChange={(open) => !open && !isDeleting && setBlogToDelete(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <div className="w-11 h-11 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-2">
              <Trash2 className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Delete Blog Article
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              Are you sure you want to delete{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                &ldquo;{blogToDelete?.title}&rdquo;
              </span>
              ? This post will be permanently removed from the website and community feed.
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
              onClick={confirmDeleteBlog}
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
