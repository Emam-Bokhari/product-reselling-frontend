"use client";

import * as React from "react";
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
  Check,
  ChevronDown,
  Copy,
  Download,
  Globe,
  Inbox,
  Mail,
  MailCheck,
  Send,
  SlidersHorizontal,
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
import { toast } from "sonner";
import moment from "moment-timezone";
import { TNewsLetter } from "@/types/newsLetter";

export default function ManageNewsLetters({
  newsLetters = [],
}: {
  newsLetters: TNewsLetter[];
}) {
  const [newsLetterList, setNewsLetterList] = React.useState<TNewsLetter[]>(newsLetters);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedDomain, setSelectedDomain] = React.useState<string>("all");
  const [hasCopiedAll, setHasCopiedAll] = React.useState(false);

  // Sync prop
  React.useEffect(() => {
    setNewsLetterList(newsLetters);
  }, [newsLetters]);

  // Derived metrics
  const totalCount = newsLetterList.length;

  const gmailCount = newsLetterList.filter((item) =>
    item.email?.toLowerCase().includes("@gmail.com")
  ).length;

  const outlookCount = newsLetterList.filter((item) => {
    const e = item.email?.toLowerCase() || "";
    return e.includes("@outlook.com") || e.includes("@hotmail.com");
  }).length;

  const latestSubscriberDate = React.useMemo(() => {
    if (!newsLetterList.length) return "None";
    const sorted = [...newsLetterList].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    return sorted[0]?.createdAt
      ? moment.tz(sorted[0].createdAt, "UTC").format("MMM D, YYYY")
      : "Recent";
  }, [newsLetterList]);

  // Copy all emails
  const handleCopyAllEmails = () => {
    const allEmails = newsLetterList.map((n) => n.email).filter(Boolean).join(", ");
    if (!allEmails) {
      toast.error("No subscriber emails available to copy");
      return;
    }
    navigator.clipboard.writeText(allEmails);
    setHasCopiedAll(true);
    toast.success(`${newsLetterList.length} subscriber emails copied to clipboard!`);
    setTimeout(() => setHasCopiedAll(false), 2500);
  };

  // Export CSV
  const handleExportCSV = () => {
    if (!newsLetterList.length) {
      toast.error("No subscriber records to export");
      return;
    }
    const headers = "ID,Email,SubscribedDate\n";
    const rows = newsLetterList
      .map(
        (n) =>
          `"${n._id}","${n.email}","${
            n.createdAt ? moment.tz(n.createdAt, "UTC").format("YYYY-MM-DD HH:mm:ss") : ""
          }"`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `ReSellBD-Newsletter-Subscribers-${moment().format("YYYYMMDD")}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast.success("Subscriber CSV exported successfully!");
  };

  // Copy single email
  const handleCopyEmail = (email: string) => {
    navigator.clipboard.writeText(email);
    toast.success(`Copied "${email}"`);
  };

  // Filtered dataset
  const filteredSubscribers = React.useMemo(() => {
    return newsLetterList.filter((item) => {
      // Domain filter
      if (selectedDomain !== "all") {
        const e = item.email?.toLowerCase() || "";
        if (selectedDomain === "gmail" && !e.includes("@gmail.com")) return false;
        if (selectedDomain === "outlook" && !e.includes("@outlook.com") && !e.includes("@hotmail.com")) return false;
        if (selectedDomain === "other" && (e.includes("@gmail.com") || e.includes("@outlook.com") || e.includes("@hotmail.com"))) return false;
      }
      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        return item.email?.toLowerCase().includes(q);
      }
      return true;
    });
  }, [newsLetterList, selectedDomain, searchQuery]);

  const columns: ColumnDef<TNewsLetter>[] = [
    {
      accessorKey: "email",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-bold hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <span>Subscriber Email</span>
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      ),
      cell: ({ row }) => {
        const email = row.getValue("email") as string;
        const initial = (email || "S").charAt(0).toUpperCase();

        return (
          <div className="flex items-center gap-3 py-1">
            <div className="w-9 h-9 rounded-full bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 border border-purple-200/80 dark:border-purple-800/60 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {initial}
            </div>

            <div className="min-w-0 max-w-[280px] space-y-0.5">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 truncate block">
                {email}
              </span>
              <div className="flex items-center gap-2 text-[11px] text-muted-foreground">
                <button
                  type="button"
                  onClick={() => handleCopyEmail(email)}
                  className="hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors"
                >
                  <Copy className="w-3 h-3" />
                  <span>Copy</span>
                </button>
                <span>•</span>
                <a
                  href={`mailto:${email}`}
                  className="hover:text-purple-600 dark:hover:text-purple-400 flex items-center gap-1 transition-colors"
                >
                  <Send className="w-3 h-3" />
                  <span>Mail</span>
                </a>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      id: "domain",
      header: "Domain Provider",
      cell: ({ row }) => {
        const email = (row.getValue("email") as string)?.toLowerCase() || "";
        let provider = "Custom / Other";
        let badgeStyle = "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200";

        if (email.includes("@gmail.com")) {
          provider = "Google Mail";
          badgeStyle = "bg-red-50 text-red-700 dark:bg-red-950/40 dark:text-red-300 border-red-200/80 dark:border-red-800/60";
        } else if (email.includes("@outlook.com") || email.includes("@hotmail.com")) {
          provider = "Microsoft";
          badgeStyle = "bg-blue-50 text-blue-700 dark:bg-blue-950/40 dark:text-blue-300 border-blue-200/80 dark:border-blue-800/60";
        } else if (email.includes("@yahoo.com")) {
          provider = "Yahoo Mail";
          badgeStyle = "bg-purple-50 text-purple-700 dark:bg-purple-950/40 dark:text-purple-300 border-purple-200/80 dark:border-purple-800/60";
        }

        return (
          <Badge
            variant="outline"
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border ${badgeStyle}`}
          >
            {provider}
          </Badge>
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
          <span>Subscribed Date</span>
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
        const email = row.original.email;

        return (
          <div className="flex items-center gap-1.5">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopyEmail(email)}
              title="Copy email address"
              className="h-8 px-2.5 rounded-lg text-xs text-slate-600 dark:text-zinc-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-50 dark:hover:bg-purple-950/30 gap-1.5 transition-colors"
            >
              <Copy className="w-3.5 h-3.5" />
              <span>Copy</span>
            </Button>
            <Button
              variant="outline"
              size="sm"
              asChild
              className="h-8 px-2.5 rounded-lg text-xs text-slate-700 dark:text-zinc-300 hover:text-amber-600 border-slate-200 dark:border-zinc-700 gap-1.5 transition-colors"
            >
              <a href={`mailto:${email}`}>
                <Send className="w-3 h-3 text-amber-500" />
                <span>Email</span>
              </a>
            </Button>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredSubscribers,
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
    setSelectedDomain("all");
  };

  const isFiltered = searchQuery !== "" || selectedDomain !== "all";

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Call to Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Newsletter Audience & Subscribers
            </h1>
            <Badge
              variant="secondary"
              className="bg-purple-500/10 text-purple-700 dark:text-purple-400 border border-purple-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold"
            >
              {totalCount} Subscribers
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Monitor email list growth, analyze subscriber domains, and export lists for promotional newsletters.
          </p>
        </div>

        {/* Action CTAs */}
        <div className="flex items-center gap-2.5 self-start sm:self-auto">
          <Button
            type="button"
            variant="outline"
            onClick={handleCopyAllEmails}
            className="h-10 px-4 rounded-xl text-xs font-semibold border-slate-200 dark:border-zinc-700 hover:bg-slate-100 dark:hover:bg-zinc-800 flex items-center gap-1.5"
          >
            {hasCopiedAll ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-600 dark:text-emerald-400">Copied All!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5 text-slate-500" />
                <span>Copy All Emails</span>
              </>
            )}
          </Button>

          <Button
            type="button"
            onClick={handleExportCSV}
            className="h-10 px-4 rounded-xl text-xs font-bold bg-purple-600 hover:bg-purple-700 text-white shadow-md hover:shadow-purple-500/25 transition-all flex items-center gap-1.5"
          >
            <Download className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>Export CSV</span>
          </Button>
        </div>
      </div>

      {/* 2. 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Total Audience
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalCount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Active marketing recipients
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 ring-1 ring-purple-200 dark:ring-purple-800/60 shrink-0">
              <Send className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Google Mail (Gmail)
              </span>
              <p className="text-2xl font-extrabold text-red-600 dark:text-red-400">
                {gmailCount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                {totalCount > 0 ? `${Math.round((gmailCount / totalCount) * 100)}% of audience` : "0%"}
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-red-50 dark:bg-red-950/40 text-red-600 dark:text-red-400 ring-1 ring-red-200 dark:ring-red-800/60 shrink-0">
              <MailCheck className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Microsoft / Outlook
              </span>
              <p className="text-2xl font-extrabold text-blue-600 dark:text-blue-400">
                {outlookCount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Outlook & Hotmail users
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 ring-1 ring-blue-200 dark:ring-blue-800/60 shrink-0">
              <Globe className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Latest Sign Up
              </span>
              <p className="text-sm sm:text-base font-extrabold text-amber-600 dark:text-amber-400 pt-1">
                {latestSubscriberDate}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Most recent subscription
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800/60 shrink-0">
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
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search subscribers by email address..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-10 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs sm:text-sm focus:border-purple-500 focus:ring-1 focus:ring-purple-500"
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
              {/* Domain Select */}
              <Select value={selectedDomain} onValueChange={setSelectedDomain}>
                <SelectTrigger className="w-[160px] h-10 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs font-semibold">
                  <SelectValue placeholder="Email Provider" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Domains</SelectItem>
                  <SelectItem value="gmail">Gmail (@gmail.com)</SelectItem>
                  <SelectItem value="outlook">Outlook / Hotmail</SelectItem>
                  <SelectItem value="other">Custom / Corporate</SelectItem>
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

      {/* 4. Subscribers Table */}
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
                        <Inbox className="w-6 h-6" />
                      </div>
                      <p className="text-sm font-bold text-slate-800 dark:text-zinc-200">
                        No subscribers found
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        {isFiltered
                          ? "Try adjusting your search query or email domain filter."
                          : "There are currently no newsletter subscribers registered."}
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
                (filteredSubscribers.length > 0 ? 1 : 0)}
            </span>{" "}
            to{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                filteredSubscribers.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {filteredSubscribers.length}
            </span>{" "}
            subscribers
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
    </div>
  );
}
