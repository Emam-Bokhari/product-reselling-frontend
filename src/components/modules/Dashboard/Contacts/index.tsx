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
  ChevronDown,
  Eye,
  Inbox,
  Loader2,
  Mail,
  MoreHorizontal,
  Phone,
  PhoneCall,
  Search,
  Send,
  SlidersHorizontal,
  Tag,
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
import { TContact } from "@/types";
import { deleteContactById } from "@/services/Contact";
import moment from "moment-timezone";

// Category badge color mapping helper
const getServiceBadgeClass = (service?: string) => {
  if (!service) {
    return "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700";
  }
  const s = service.toLowerCase();
  if (s.includes("support") || s.includes("help") || s.includes("issue")) {
    return "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300 border-amber-200/80 dark:border-amber-800/60";
  }
  if (s.includes("sell") || s.includes("post") || s.includes("order")) {
    return "bg-amber-500/10 text-amber-800 dark:text-amber-300 border-amber-400/30";
  }
  return "bg-slate-100 text-slate-700 dark:bg-zinc-800 dark:text-zinc-300 border-slate-200 dark:border-zinc-700";
};

export default function ManageContacts({
  contacts = [],
}: {
  contacts: TContact[];
}) {
  const [contactList, setContactList] = React.useState<TContact[]>(contacts);
  const [sorting, setSorting] = React.useState<SortingState>([
    { id: "createdAt", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([]);
  const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({});
  const [rowSelection, setRowSelection] = React.useState({});

  // Filter states
  const [searchQuery, setSearchQuery] = React.useState("");
  const [selectedService, setSelectedService] = React.useState<string>("all");

  // Dialog states
  const [selectedContactForView, setSelectedContactForView] = React.useState<TContact | null>(null);
  const [contactToDelete, setContactToDelete] = React.useState<TContact | null>(null);
  const [isDeleting, setIsDeleting] = React.useState(false);

  // Sync contacts prop
  React.useEffect(() => {
    setContactList(contacts);
  }, [contacts]);

  // Derived metrics
  const totalCount = contactList.length;
  const withPhoneCount = contactList.filter((c) => Boolean(c.phone?.trim())).length;

  const uniqueServices = React.useMemo(() => {
    const set = new Set<string>();
    contactList.forEach((c) => {
      if (Array.isArray(c.services)) {
        c.services.forEach((s) => s && set.add(s));
      } else if (typeof c.services === "string" && (c.services as unknown as string).trim()) {
        set.add(c.services as unknown as string);
      }
    });
    return Array.from(set);
  }, [contactList]);

  const latestInquiryDate = React.useMemo(() => {
    if (!contactList.length) return "None";
    const sorted = [...contactList].sort(
      (a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
    return sorted[0]?.createdAt
      ? moment.tz(sorted[0].createdAt, "UTC").format("MMM D, YYYY")
      : "Recent";
  }, [contactList]);

  // Handle delete contact
  const confirmDeleteContact = async () => {
    if (!contactToDelete) return;
    setIsDeleting(true);
    try {
      const response = await deleteContactById(contactToDelete._id);
      if (response?.success) {
        toast.success("Inquiry deleted successfully");
        setContactList((prev) => prev.filter((c) => c._id !== contactToDelete._id));
        setContactToDelete(null);
      } else {
        toast.error(response?.error?.[0]?.message || "Failed to delete inquiry");
      }
    } catch {
      toast.error("Something went wrong while deleting inquiry!");
    } finally {
      setIsDeleting(false);
    }
  };

  // Filtered dataset
  const filteredContacts = React.useMemo(() => {
    return contactList.filter((c) => {
      // Service filter
      if (selectedService !== "all") {
        const matchesService = Array.isArray(c.services)
          ? c.services.includes(selectedService)
          : (c.services as unknown as string) === selectedService;
        if (!matchesService) return false;
      }
      // Search query across name, email, phone, message
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const fullName = `${c.firstName || ""} ${c.lastName || ""}`.toLowerCase();
        const emailMatch = c.email?.toLowerCase().includes(q);
        const phoneMatch = c.phone?.toLowerCase().includes(q);
        const msgMatch = c.message?.toLowerCase().includes(q);
        return fullName.includes(q) || emailMatch || phoneMatch || msgMatch;
      }
      return true;
    });
  }, [contactList, selectedService, searchQuery]);

  const columns: ColumnDef<TContact>[] = [
    {
      accessorKey: "firstName",
      header: ({ column }) => (
        <button
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          className="flex items-center gap-1.5 font-bold hover:text-slate-950 dark:hover:text-white transition-colors"
        >
          <span>Sender Details</span>
          <ArrowUpDown className="w-3.5 h-3.5 text-muted-foreground" />
        </button>
      ),
      cell: ({ row }) => {
        const c = row.original;
        const fullName = `${c.firstName || ""} ${c.lastName || ""}`.trim() || c.email || "Anonymous";
        const initial = (c.firstName || c.email || "C").charAt(0).toUpperCase();

        return (
          <div className="flex items-center gap-3 py-1">
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-zinc-800 border border-slate-200 dark:border-zinc-700 flex items-center justify-center font-bold text-sm text-slate-700 dark:text-zinc-200 shrink-0 shadow-xs">
              {initial}
            </div>

            <div className="min-w-0 max-w-[240px] space-y-0.5">
              <button
                type="button"
                onClick={() => setSelectedContactForView(c)}
                className="font-bold text-xs sm:text-sm text-slate-900 dark:text-slate-100 hover:text-amber-600 dark:hover:text-amber-400 transition-colors truncate block text-left"
              >
                {fullName}
              </button>
              <div className="flex items-center gap-1.5 text-[11px] text-muted-foreground truncate">
                <Mail className="w-3 h-3 shrink-0 text-slate-400" />
                <span className="truncate">{c.email}</span>
              </div>
            </div>
          </div>
        );
      },
    },
    {
      accessorKey: "phone",
      header: "Phone Number",
      cell: ({ row }) => {
        const phone = row.original.phone;

        return phone ? (
          <a
            href={`tel:${phone}`}
            className="flex items-center gap-1.5 text-xs text-slate-700 dark:text-zinc-300 hover:text-amber-600 font-medium transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-amber-500 shrink-0" />
            <span>{phone}</span>
          </a>
        ) : (
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
            Not provided
          </span>
        );
      },
    },
    {
      accessorKey: "services",
      header: "Inquiry Topic",
      cell: ({ row }) => {
        const c = row.original;
        const s = Array.isArray(c.services)
          ? c.services[0]
          : (c.services as unknown as string);

        return s ? (
          <Badge
            variant="outline"
            className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full border capitalize ${getServiceBadgeClass(
              s
            )}`}
          >
            {s}
          </Badge>
        ) : (
          <span className="text-[11px] text-slate-400 dark:text-zinc-500 italic">
            Not specified
          </span>
        );
      },
    },
    {
      accessorKey: "message",
      header: "Message Preview",
      cell: ({ row }) => {
        const msg = row.original.message;

        return (
          <div
            onClick={() => setSelectedContactForView(row.original)}
            className="cursor-pointer max-w-[280px] group"
          >
            <p className="text-xs text-slate-600 dark:text-zinc-300 line-clamp-1 group-hover:text-amber-600 dark:group-hover:text-amber-400 transition-colors">
              {msg || "No message body"}
            </p>
            <span className="text-[10px] text-amber-600 dark:text-amber-400 font-medium">
              Click to read full
            </span>
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
          <span>Date Received</span>
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
        const c = row.original;

        return (
          <div className="flex items-center gap-1">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setSelectedContactForView(c)}
              title="Read full message"
              className="h-8 w-8 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
            >
              <Eye className="w-4 h-4" />
            </Button>

            <Button
              variant="ghost"
              size="icon"
              asChild
              title="Reply via email"
              className="h-8 w-8 text-slate-600 dark:text-zinc-400 hover:text-amber-600 dark:hover:text-amber-400 hover:bg-amber-50 dark:hover:bg-amber-950/30 rounded-lg transition-colors"
            >
              <a
                href={`mailto:${c.email}?subject=Re:%20Inquiry%20regarding%20ReSellBD`}
              >
                <Send className="w-4 h-4" />
              </a>
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
                  Inquiry Actions
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setSelectedContactForView(c)}
                  className="text-xs cursor-pointer flex items-center gap-2"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-500" />
                  Read Full Message
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a
                    href={`mailto:${c.email}?subject=Re:%20Inquiry%20regarding%20ReSellBD`}
                    className="text-xs cursor-pointer flex items-center gap-2"
                  >
                    <Mail className="w-3.5 h-3.5 text-blue-500" />
                    Send Email Reply
                  </a>
                </DropdownMenuItem>
                {c.phone && (
                  <DropdownMenuItem asChild>
                    <a
                      href={`tel:${c.phone}`}
                      className="text-xs cursor-pointer flex items-center gap-2"
                    >
                      <PhoneCall className="w-3.5 h-3.5 text-emerald-500" />
                      Call Number
                    </a>
                  </DropdownMenuItem>
                )}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => setContactToDelete(c)}
                  className="text-xs cursor-pointer text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-950/50 flex items-center gap-2"
                >
                  <Trash2 className="w-3.5 h-3.5 text-red-500" />
                  Delete Inquiry
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];

  const table = useReactTable({
    data: filteredContacts,
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
    setSelectedService("all");
  };

  const isFiltered = searchQuery !== "" || selectedService !== "all";

  return (
    <div className="space-y-6">
      {/* 1. Header with Title & Meta */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
              Customer Inquiries & Messages
            </h1>
            <Badge
              variant="secondary"
              className="bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs px-2.5 py-0.5 rounded-full font-bold"
            >
              {totalCount} Messages
            </Badge>
          </div>
          <p className="text-xs sm:text-sm text-muted-foreground mt-1">
            Review user inquiries, support requests, and contact submissions from the ReSellBD website.
          </p>
        </div>
      </div>

      {/* 2. 4 Metric Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Total Inquiries
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {totalCount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                All-time contact messages
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 ring-1 ring-amber-200 dark:ring-amber-800/60 shrink-0">
              <Mail className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Phone Contacts
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {withPhoneCount.toLocaleString()}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Includes phone number
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 ring-1 ring-slate-200 dark:ring-zinc-700 shrink-0">
              <Phone className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Topic Verticals
              </span>
              <p className="text-2xl font-extrabold text-slate-900 dark:text-white">
                {uniqueServices.length}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Different support topics
              </p>
            </div>
            <div className="p-3 rounded-2xl bg-slate-100 dark:bg-zinc-800 text-slate-700 dark:text-zinc-300 ring-1 ring-slate-200 dark:ring-zinc-700 shrink-0">
              <Tag className="w-5 h-5 stroke-[2.2]" />
            </div>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border border-slate-200/80 dark:border-zinc-800 bg-white dark:bg-zinc-900 shadow-xs">
          <CardContent className="p-4 sm:p-5 flex items-center justify-between">
            <div className="space-y-1">
              <span className="text-xs font-semibold text-slate-500 dark:text-zinc-400 uppercase tracking-wide">
                Latest Inquiry
              </span>
              <p className="text-sm sm:text-base font-extrabold text-amber-600 dark:text-amber-400 pt-1">
                {latestInquiryDate}
              </p>
              <p className="text-[11px] text-slate-400 dark:text-zinc-500">
                Most recent submission
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
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <Input
                placeholder="Search by sender name, email, phone, or message body..."
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
              {/* Service Select */}
              <Select value={selectedService} onValueChange={setSelectedService}>
                <SelectTrigger className="w-[160px] h-10 rounded-xl bg-slate-50/70 dark:bg-zinc-800/50 border-slate-200 dark:border-zinc-700 text-xs font-semibold">
                  <SelectValue placeholder="Topic / Service" />
                </SelectTrigger>
                <SelectContent className="rounded-xl">
                  <SelectItem value="all">All Topics</SelectItem>
                  {uniqueServices.map((svc) => (
                    <SelectItem key={svc} value={svc} className="capitalize">
                      {svc}
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

      {/* 4. Contacts Table */}
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
                        No messages found
                      </p>
                      <p className="text-xs text-muted-foreground max-w-sm">
                        {isFiltered
                          ? "Try adjusting your search query or topic filter."
                          : "There are currently no inquiries in your inbox."}
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
                (filteredContacts.length > 0 ? 1 : 0)}
            </span>{" "}
            to{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {Math.min(
                (table.getState().pagination.pageIndex + 1) *
                  table.getState().pagination.pageSize,
                filteredContacts.length
              )}
            </span>{" "}
            of{" "}
            <span className="font-bold text-slate-900 dark:text-white">
              {filteredContacts.length}
            </span>{" "}
            messages
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

      {/* Message Reader Dialog */}
      <Dialog
        open={Boolean(selectedContactForView)}
        onOpenChange={(open) => !open && setSelectedContactForView(null)}
      >
        <DialogContent className="sm:max-w-xl rounded-2xl p-6">
          <DialogHeader className="border-b border-slate-100 dark:border-zinc-800 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-full bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 border border-amber-200/80 dark:border-amber-800/60 flex items-center justify-center font-bold text-base shrink-0">
                {(
                  selectedContactForView?.firstName ||
                  selectedContactForView?.email ||
                  "C"
                )
                  .charAt(0)
                  .toUpperCase()}
              </div>
              <div className="min-w-0">
                <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
                  {`${selectedContactForView?.firstName || ""} ${
                    selectedContactForView?.lastName || ""
                  }`.trim() || "Customer Message"}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground flex items-center gap-2 mt-0.5">
                  <span className="truncate">{selectedContactForView?.email}</span>
                  <span>•</span>
                  <span>
                    {selectedContactForView?.createdAt
                      ? moment
                          .tz(selectedContactForView.createdAt, "UTC")
                          .format("MMM D, YYYY [at] h:mm A")
                      : "Recently"}
                  </span>
                </DialogDescription>
              </div>
            </div>
          </DialogHeader>

          {selectedContactForView && (
            <div className="space-y-4 pt-2 text-xs">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Phone Number
                  </span>
                  <div className="mt-1 font-semibold text-slate-800 dark:text-zinc-200">
                    {selectedContactForView.phone ? (
                      <a
                        href={`tel:${selectedContactForView.phone}`}
                        className="text-amber-600 dark:text-amber-400 hover:underline flex items-center gap-1.5"
                      >
                        <Phone className="w-3.5 h-3.5" />
                        {selectedContactForView.phone}
                      </a>
                    ) : (
                      <span className="text-muted-foreground italic">Not provided</span>
                    )}
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-slate-50 dark:bg-zinc-800/50 border border-slate-100 dark:border-zinc-800">
                  <span className="text-[10px] uppercase font-bold text-muted-foreground block">
                    Service / Topic
                  </span>
                  <div className="mt-1">
                    <Badge
                      variant="outline"
                      className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full capitalize ${getServiceBadgeClass(
                        Array.isArray(selectedContactForView.services)
                          ? selectedContactForView.services[0]
                          : (selectedContactForView.services as unknown as string)
                      )}`}
                    >
                      {Array.isArray(selectedContactForView.services)
                        ? selectedContactForView.services.join(", ")
                        : (selectedContactForView.services as unknown as string) || "Not specified"}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Full Message Body */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  Message Content
                </span>
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-zinc-800/40 border border-slate-100 dark:border-zinc-800 text-slate-800 dark:text-zinc-200 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap max-h-72 overflow-y-auto">
                  {selectedContactForView.message || "No content provided."}
                </div>
              </div>
            </div>
          )}

          <DialogFooter className="border-t border-slate-100 dark:border-zinc-800 pt-3 flex flex-row items-center justify-between">
            {selectedContactForView && (
              <Button
                asChild
                className="h-8 rounded-xl text-xs gap-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
              >
                <a
                  href={`mailto:${selectedContactForView.email}?subject=Re:%20Inquiry%20regarding%20ReSellBD`}
                >
                  <Send className="w-3.5 h-3.5" />
                  Reply by Email
                </a>
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

      {/* Delete Contact Confirmation Dialog */}
      <Dialog
        open={Boolean(contactToDelete)}
        onOpenChange={(open) => !open && !isDeleting && setContactToDelete(null)}
      >
        <DialogContent className="sm:max-w-md rounded-2xl p-6">
          <DialogHeader>
            <div className="w-11 h-11 rounded-2xl bg-red-100 dark:bg-red-950/50 text-red-600 dark:text-red-400 flex items-center justify-center mb-2">
              <Trash2 className="w-5 h-5" />
            </div>
            <DialogTitle className="text-lg font-bold text-slate-900 dark:text-white">
              Delete Customer Inquiry
            </DialogTitle>
            <DialogDescription className="text-xs text-muted-foreground leading-relaxed pt-1">
              Are you sure you want to delete this message from{" "}
              <span className="font-bold text-slate-900 dark:text-white">
                {`${contactToDelete?.firstName || ""} ${contactToDelete?.lastName || ""}`.trim() || contactToDelete?.email}
              </span>
              ? This action cannot be undone.
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
              onClick={confirmDeleteContact}
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
