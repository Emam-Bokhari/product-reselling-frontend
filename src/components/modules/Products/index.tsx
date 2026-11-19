"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import ProductCard from "@/components/ui/core/ProductCard";
import SidebarFilters from "./SidebarFilters";
import Container from "@/components/shared/Container";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { TProduct } from "@/types";
import { Button } from "@/components/ui/button";
import {
  Search,
  X,
  RotateCcw,
  SlidersHorizontal,
  Grid3X3,
  List,
  ChevronLeft,
  ChevronRight,
  PackageSearch,
  ShieldCheck,
  PhoneCall,
  MapPin,
  TrendingDown,
} from "lucide-react";

interface AllProductsProps {
  products: TProduct[];
}

export default function AllProducts({ products = [] }: AllProductsProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productsTopRef = useRef<HTMLDivElement>(null);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState<{
    min: number | "";
    max: number | "";
  }>({ min: "", max: "" });
  const [isAvailable, setIsAvailable] = useState(false);
  const [isNegotiable, setIsNegotiable] = useState(false);

  // UI States
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 12;

  // Sync with URL query parameters (?search=..., ?category=..., ?location=...)
  useEffect(() => {
    const searchParam = searchParams.get("search");
    if (searchParam !== null) {
      setSearchTerm(searchParam);
    } else {
      setSearchTerm("");
    }

    const categoryParam = searchParams.get("category");
    if (categoryParam) {
      setSelectedCategories([categoryParam]);
    }

    const locationParam = searchParams.get("location");
    if (locationParam) {
      setSelectedDistricts([locationParam.toLowerCase()]);
    }

    setCurrentPage(1);
  }, [searchParams]);

  // Reset pagination when any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [
    searchTerm,
    sortOrder,
    selectedCategories,
    selectedConditions,
    selectedDistricts,
    priceRange,
    isAvailable,
    isNegotiable,
  ]);

  // Compute dynamic counts from raw products
  const { categoryCounts, conditionCounts, districtCounts } = useMemo(() => {
    const catCounts: Record<string, number> = {};
    const condCounts: Record<string, number> = {};
    const distCounts: Record<string, number> = {};

    (products || []).forEach((prod) => {
      // Category count
      if (prod.category) {
        const catLower = prod.category.toLowerCase().trim();
        let normalized = catLower;
        if (catLower === "mobile") normalized = "mobiles";
        if (catLower === "cloths" || catLower === "fashion") normalized = "clothes";
        catCounts[normalized] = (catCounts[normalized] || 0) + 1;
      }

      // Condition count
      if (prod.condition) {
        const clean = prod.condition.toLowerCase().replace(/[\s-_]/g, "");
        condCounts[clean] = (condCounts[clean] || 0) + 1;
      }

      // District count
      if (prod.location) {
        const locLower = prod.location.toLowerCase().trim();
        distCounts[locLower] = (distCounts[locLower] || 0) + 1;
      }
    });

    return {
      categoryCounts: catCounts,
      conditionCounts: condCounts,
      districtCounts: distCounts,
    };
  }, [products]);

  // Smart Filtering Function
  const filteredProducts = useMemo(() => {
    return (products || [])
      .filter((product) => {
        // Search Term Filter
        if (!searchTerm.trim()) return true;
        const term = searchTerm.toLowerCase().trim();
        return [
          product.title,
          product.category,
          product.location,
          product.brand,
          product.description,
        ].some((field) => field?.toLowerCase().includes(term));
      })
      .filter((product) => {
        // Category Filter
        if (selectedCategories.length === 0) return true;
        if (!product.category) return false;
        const prodCat = product.category.toLowerCase().trim();
        return selectedCategories.some((sc) => {
          const scNorm = sc.toLowerCase().trim();
          if (prodCat === scNorm) return true;
          if (
            (prodCat === "mobile" || prodCat === "mobiles") &&
            (scNorm === "mobile" || scNorm === "mobiles")
          )
            return true;
          if (
            (prodCat === "cloths" || prodCat === "clothes") &&
            (scNorm === "cloths" || scNorm === "clothes")
          )
            return true;
          return false;
        });
      })
      .filter((product) => {
        // Condition Filter
        if (selectedConditions.length === 0) return true;
        if (!product.condition) return false;
        const cleanProd = product.condition.toLowerCase().replace(/[\s-_]/g, "");
        return selectedConditions.some((sc) => {
          const cleanFilter = sc.toLowerCase().replace(/[\s-_]/g, "");
          return cleanProd === cleanFilter;
        });
      })
      .filter((product) => {
        // District Filter
        if (selectedDistricts.length === 0) return true;
        if (!product.location) return false;
        const prodLoc = product.location.toLowerCase().trim();
        return selectedDistricts.some((sd) => sd.toLowerCase().trim() === prodLoc);
      })
      .filter((product) => {
        // Price Filter
        if (priceRange.min !== "" && product.price < Number(priceRange.min)) {
          return false;
        }
        if (priceRange.max !== "" && product.price > Number(priceRange.max)) {
          return false;
        }
        return true;
      })
      .filter((product) => {
        // Availability Filter
        if (!isAvailable) return true;
        return product.status === "available";
      })
      .filter((product) => {
        // Negotiable Filter
        if (!isNegotiable) return true;
        return product.negotiable === "yes";
      })
      .sort((a, b) => {
        if (sortOrder === "low-to-high") return a.price - b.price;
        if (sortOrder === "high-to-low") return b.price - a.price;
        if (sortOrder === "newest") {
          return (
            new Date(b.createdAt || 0).getTime() -
            new Date(a.createdAt || 0).getTime()
          );
        }
        return 0;
      });
  }, [
    products,
    searchTerm,
    selectedCategories,
    selectedConditions,
    selectedDistricts,
    priceRange,
    isAvailable,
    isNegotiable,
    sortOrder,
  ]);

  // Pagination calculations
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

  const handlePageChange = (newPage: number) => {
    setCurrentPage(newPage);
    if (productsTopRef.current) {
      productsTopRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const handleClearAll = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedConditions([]);
    setSelectedDistricts([]);
    setPriceRange({ min: "", max: "" });
    setIsAvailable(false);
    setIsNegotiable(false);
    setSortOrder("newest");
    setCurrentPage(1);
    router.replace("/products");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.replace(
        `/products?search=${encodeURIComponent(searchTerm.trim())}`
      );
    } else {
      router.replace("/products");
    }
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCategories.length > 0 ||
    selectedConditions.length > 0 ||
    selectedDistricts.length > 0 ||
    priceRange.min !== "" ||
    priceRange.max !== "" ||
    isAvailable ||
    isNegotiable;

  const activeFiltersCount =
    (searchTerm ? 1 : 0) +
    selectedCategories.length +
    selectedConditions.length +
    selectedDistricts.length +
    (priceRange.min !== "" || priceRange.max !== "" ? 1 : 0) +
    (isAvailable ? 1 : 0) +
    (isNegotiable ? 1 : 0);

  return (
    <div className="bg-[#F8FAFC] min-h-screen pb-16">
      {/* ============================================================
          TOP HERO
          ============================================================ */}
      <div className="bg-white border-b border-slate-200/80 shadow-2xs py-5">
        <Container>
          {/* Breadcrumb */}
          <nav className="flex items-center gap-2 text-xs text-slate-500 mb-2 font-medium">
            <Link
              href="/"
              className="hover:text-amber-600 transition-colors"
            >
              Home
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">Products</span>
          </nav>

          {/* Headline & Subtitle */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
                Explore All <span className="text-amber-500">Products</span>
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
                Browse authentic second-hand &amp; certified pre-owned items across
                Bangladesh. Direct buyer-seller contact with zero commission fees.
              </p>
            </div>
          </div>
        </Container>
      </div>

      {/* ============================================================
          MAIN BODY (Sidebar + Products Grid)
          ============================================================ */}
      <Container className="mt-6">
        <div ref={productsTopRef} className="flex flex-col lg:flex-row gap-6">
          {/* SIDEBAR COMPONENT */}
          <SidebarFilters
            selectedCategories={selectedCategories}
            setSelectedCategories={setSelectedCategories}
            selectedConditions={selectedConditions}
            setSelectedConditions={setSelectedConditions}
            selectedDistricts={selectedDistricts}
            setSelectedDistricts={setSelectedDistricts}
            priceRange={priceRange}
            setPriceRange={setPriceRange}
            isAvailable={isAvailable}
            setIsAvailable={setIsAvailable}
            isNegotiable={isNegotiable}
            setIsNegotiable={setIsNegotiable}
            categoryCounts={categoryCounts}
            conditionCounts={conditionCounts}
            districtCounts={districtCounts}
            totalFilteredCount={totalItems}
            onClearAll={handleClearAll}
            isMobileOpen={isMobileOpen}
            setIsMobileOpen={setIsMobileOpen}
          />

          {/* MAIN RESULTS COLUMN */}
          <div className="flex-1 min-w-0">
            {/* Top Toolbar: Search, Sort, View Switcher & Mobile Trigger */}
            <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-xs mb-4">
              <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
                {/* Search Bar */}
                <form
                  onSubmit={handleSearchSubmit}
                  className="relative flex-1"
                >
                  <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <Input
                    type="text"
                    placeholder="Search by title, brand, category, or location..."
                    className="w-full pl-9 pr-9 h-10 text-xs sm:text-sm bg-slate-50 border-slate-200 rounded-xl focus:bg-white focus:border-amber-500 focus:ring-amber-500/20"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {searchTerm && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        router.replace("/products");
                      }}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label="Clear search"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </form>

                {/* Right actions: Mobile Filter Button, Sort & View Mode */}
                <div className="flex items-center gap-2">
                  {/* Mobile Filter Button */}
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setIsMobileOpen(true)}
                    className="lg:hidden h-10 px-3 text-xs font-semibold rounded-xl border-slate-200 text-slate-700 hover:border-amber-400 flex items-center gap-1.5 cursor-pointer shrink-0"
                  >
                    <SlidersHorizontal className="w-3.5 h-3.5 text-amber-500" />
                    <span>Filters</span>
                    {activeFiltersCount > 0 && (
                      <span className="w-5 h-5 rounded-full bg-amber-500 text-white text-[10px] font-bold flex items-center justify-center">
                        {activeFiltersCount}
                      </span>
                    )}
                  </Button>

                  {/* Sort Order Select */}
                  <Select value={sortOrder} onValueChange={setSortOrder}>
                    <SelectTrigger className="w-full sm:w-[170px] h-10 text-xs sm:text-sm rounded-xl border-slate-200 bg-slate-50/50 hover:bg-white">
                      <SelectValue placeholder="Sort Products" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="newest">Newest Listed</SelectItem>
                      <SelectItem value="low-to-high">Price: Low to High</SelectItem>
                      <SelectItem value="high-to-low">Price: High to Low</SelectItem>
                    </SelectContent>
                  </Select>

                  {/* View Mode Toggle (Grid vs List) */}
                  <div className="hidden sm:flex items-center border border-slate-200 rounded-xl p-0.5 bg-slate-50 shrink-0">
                    <button
                      type="button"
                      onClick={() => setViewMode("grid")}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === "grid"
                          ? "bg-white text-amber-600 shadow-2xs font-bold"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                      title="Grid view"
                      aria-label="Grid view"
                    >
                      <Grid3X3 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setViewMode("list")}
                      className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                        viewMode === "list"
                          ? "bg-white text-amber-600 shadow-2xs font-bold"
                          : "text-slate-400 hover:text-slate-700"
                      }`}
                      title="List view"
                      aria-label="List view"
                    >
                      <List className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Reset All Filters Button */}
                  {hasActiveFilters && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleClearAll}
                      className="h-10 px-3 text-xs rounded-xl border-slate-200 hover:border-amber-400 text-slate-600 hover:text-amber-700 flex items-center gap-1 cursor-pointer shrink-0"
                      title="Reset all filters"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span className="hidden xl:inline">Reset</span>
                    </Button>
                  )}
                </div>
              </div>

              {/* Active Filter Tags */}
              {hasActiveFilters && (
                <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                  <span className="text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                    Active:
                  </span>

                  {/* Search Term Chip */}
                  {searchTerm && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                      <span>Search: &ldquo;{searchTerm}&rdquo;</span>
                      <button
                        type="button"
                        onClick={() => {
                          setSearchTerm("");
                          router.replace("/products");
                        }}
                        className="hover:text-amber-950 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Category Chips */}
                  {selectedCategories.map((cat) => (
                    <span
                      key={cat}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 capitalize font-medium"
                    >
                      <span>{cat}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedCategories((prev) =>
                            prev.filter((c) => c !== cat)
                          )
                        }
                        className="hover:text-slate-900 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Condition Chips */}
                  {selectedConditions.map((cond) => (
                    <span
                      key={cond}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 font-medium"
                    >
                      <span>{cond}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedConditions((prev) =>
                            prev.filter((c) => c !== cond)
                          )
                        }
                        className="hover:text-slate-900 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* District Chips */}
                  {selectedDistricts.map((dist) => (
                    <span
                      key={dist}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 capitalize font-medium"
                    >
                      <span>{dist}</span>
                      <button
                        type="button"
                        onClick={() =>
                          setSelectedDistricts((prev) =>
                            prev.filter((d) => d !== dist)
                          )
                        }
                        className="hover:text-slate-900 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}

                  {/* Price Range Chip */}
                  {(priceRange.min !== "" || priceRange.max !== "") && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                      <span>
                        ৳{priceRange.min || 0} -{" "}
                        {priceRange.max ? `৳${priceRange.max}` : "Any"}
                      </span>
                      <button
                        type="button"
                        onClick={() => setPriceRange({ min: "", max: "" })}
                        className="hover:text-amber-950 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Available Chip */}
                  {isAvailable && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-800 border border-emerald-200 font-medium">
                      <span>In Stock Only</span>
                      <button
                        type="button"
                        onClick={() => setIsAvailable(false)}
                        className="hover:text-emerald-950 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Negotiable Chip */}
                  {isNegotiable && (
                    <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                      <span>Negotiable Only</span>
                      <button
                        type="button"
                        onClick={() => setIsNegotiable(false)}
                        className="hover:text-amber-950 cursor-pointer"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  )}

                  {/* Count summary */}
                  <span className="text-slate-400 ml-auto font-medium text-xs">
                    Showing {startIndex + 1} - {endIndex} of {totalItems} items
                  </span>
                </div>
              )}
            </div>

            {/* PRODUCT CARDS LIST / GRID */}
            {paginatedProducts && paginatedProducts.length > 0 ? (
              <div
                className={
                  viewMode === "grid"
                    ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5"
                    : "flex flex-col gap-4"
                }
              >
                {paginatedProducts.map((product) => (
                  <ProductCard
                    key={product?._id}
                    product={product}
                    viewMode={viewMode}
                  />
                ))}
              </div>
            ) : (
              /* EMPTY STATE */
              <div className="text-center py-16 px-6 bg-white rounded-2xl border border-dashed border-slate-300 shadow-2xs my-4">
                <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 shadow-xs">
                  <PackageSearch className="w-8 h-8" />
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-1.5">
                  No products found
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto mb-5 leading-relaxed">
                  {searchTerm
                    ? `We couldn't find any products matching "${searchTerm}". Try checking for spelling or using more general keywords.`
                    : "No products match the selected filters. Try broadening your price range or clearing some filters."}
                </p>
                <Button
                  onClick={handleClearAll}
                  size="sm"
                  className="rounded-xl text-xs font-semibold bg-amber-500 hover:bg-amber-600 text-white px-5 py-2.5 shadow-xs cursor-pointer"
                >
                  Clear All Filters &amp; Search
                </Button>
              </div>
            )}

            {/* PAGINATION CONTROLS */}
            {totalPages > 1 && (
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mt-10 pt-6 border-t border-slate-200/80">
                <span className="text-xs text-slate-500">
                  Showing <strong className="text-slate-800">{startIndex + 1}</strong> to{" "}
                  <strong className="text-slate-800">{endIndex}</strong> of{" "}
                  <strong className="text-slate-800">{totalItems}</strong> listings
                </span>

                <div className="flex items-center gap-1.5">
                  {/* Prev Button */}
                  <Button
                    onClick={() => handlePageChange(Math.max(validCurrentPage - 1, 1))}
                    disabled={validCurrentPage === 1}
                    size="sm"
                    variant="outline"
                    className="h-9 px-3 rounded-xl border-slate-200 text-xs text-slate-700 hover:border-amber-400 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    <ChevronLeft className="w-4 h-4" />
                    <span>Prev</span>
                  </Button>

                  {/* Page numbers */}
                  {Array.from({ length: totalPages }, (_, i) => i + 1)
                    .filter((pageNum) => {
                      // Show first, last, and within 1 of current
                      return (
                        pageNum === 1 ||
                        pageNum === totalPages ||
                        Math.abs(pageNum - validCurrentPage) <= 1
                      );
                    })
                    .map((pageNum, idx, array) => {
                      const prevNum = array[idx - 1];
                      const showEllipsis = prevNum && pageNum - prevNum > 1;

                      return (
                        <div key={pageNum} className="flex items-center">
                          {showEllipsis && (
                            <span className="px-2 text-slate-400 text-xs">...</span>
                          )}
                          <Button
                            onClick={() => handlePageChange(pageNum)}
                            size="sm"
                            variant={validCurrentPage === pageNum ? "default" : "outline"}
                            className={`w-9 h-9 p-0 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                              validCurrentPage === pageNum
                                ? "bg-amber-500 hover:bg-amber-600 text-white border-amber-500 shadow-xs"
                                : "border-slate-200 text-slate-700 hover:border-amber-400 hover:text-amber-700"
                            }`}
                          >
                            {pageNum}
                          </Button>
                        </div>
                      );
                    })}

                  {/* Next Button */}
                  <Button
                    onClick={() =>
                      handlePageChange(Math.min(validCurrentPage + 1, totalPages))
                    }
                    disabled={validCurrentPage === totalPages}
                    size="sm"
                    variant="outline"
                    className="h-9 px-3 rounded-xl border-slate-200 text-xs text-slate-700 hover:border-amber-400 disabled:opacity-40 cursor-pointer flex items-center gap-1"
                  >
                    <span>Next</span>
                    <ChevronRight className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* ============================================================
            BOTTOM MARKETPLACE VALUE PROPOSITIONS
            ============================================================ */}
        <div className="mt-14 pt-10 border-t border-slate-200/80">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 border border-amber-200/60">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Verified Listings
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Community-screened genuine products
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 border border-emerald-200/60">
                <PhoneCall className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Direct Contact
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Call or chat directly with the seller
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 border border-blue-200/60">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  64 Districts Covered
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Find deals right in your neighbourhood
                </p>
              </div>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0 border border-purple-200/60">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-900">
                  Save Up to 70%
                </h4>
                <p className="text-[11px] text-slate-500 mt-0.5">
                  Fair resale prices on branded gear
                </p>
              </div>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
