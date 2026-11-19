"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
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
import { Search, X, RotateCcw } from "lucide-react";

export default function AllProducts({ products }: { products: TProduct[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedConditions, setSelectedConditions] = useState<string[]>([]);
  const [selectedDistricts, setSelectedDistricts] = useState<string[]>([]);
  const [isAvailable, setIsAvailable] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 9;

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
      setSelectedDistricts([locationParam]);
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
    isAvailable,
  ]);

  const filteredProducts = (products || [])
    ?.filter((product) => {
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
    ?.filter((product) =>
      selectedCategories.length === 0
        ? true
        : selectedCategories.includes(product.category)
    )
    ?.filter((product) =>
      selectedConditions.length === 0
        ? true
        : selectedConditions.includes(product.condition)
    )
    ?.filter((product) =>
      selectedDistricts.length === 0
        ? true
        : selectedDistricts.includes(product.location)
    )
    ?.filter((product) => (isAvailable ? product.status === "available" : true))
    ?.sort((a, b) => {
      if (sortOrder === "low-to-high") return a.price - b.price;
      if (sortOrder === "high-to-low") return b.price - a.price;
      return 0;
    });

  // Pagination calculation
  const totalItems = filteredProducts?.length || 0;
  const totalPages = Math.max(1, Math.ceil(totalItems / itemsPerPage));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const paginatedProducts = filteredProducts?.slice(
    (validCurrentPage - 1) * itemsPerPage,
    validCurrentPage * itemsPerPage
  );

  const handleClearAll = () => {
    setSearchTerm("");
    setSelectedCategories([]);
    setSelectedConditions([]);
    setSelectedDistricts([]);
    setIsAvailable(false);
    setSortOrder("");
    setCurrentPage(1);
    router.replace("/products");
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      router.replace(`/products?search=${encodeURIComponent(searchTerm.trim())}`);
    } else {
      router.replace("/products");
    }
  };

  const hasActiveFilters =
    Boolean(searchTerm) ||
    selectedCategories.length > 0 ||
    selectedConditions.length > 0 ||
    selectedDistricts.length > 0 ||
    isAvailable ||
    Boolean(sortOrder);

  return (
    <Container className="mt-4 pb-12">
      <div className="flex flex-col lg:flex-row gap-6">
        <SidebarFilters
          selectedCategories={selectedCategories}
          setSelectedCategories={setSelectedCategories}
          selectedConditions={selectedConditions}
          setSelectedConditions={setSelectedConditions}
          selectedDistricts={selectedDistricts}
          setSelectedDistricts={setSelectedDistricts}
          setIsAvailable={setIsAvailable}
        />

        <div className="flex-1">
          {/* Top Search & Sort Bar */}
          <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/80 shadow-2xs mb-4">
            <div className="flex flex-col md:flex-row justify-between items-stretch md:items-center gap-3">
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

              <div className="flex items-center gap-2">
                <Select value={sortOrder} onValueChange={setSortOrder}>
                  <SelectTrigger className="w-full md:w-[180px] h-10 text-xs sm:text-sm rounded-xl border-slate-200">
                    <SelectValue placeholder="Sort by Price" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low-to-high">Price: Low to High</SelectItem>
                    <SelectItem value="high-to-low">Price: High to Low</SelectItem>
                  </SelectContent>
                </Select>

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
                    <span className="hidden sm:inline">Reset</span>
                  </Button>
                )}
              </div>
            </div>

            {/* Active search / filter indicators */}
            {hasActiveFilters && (
              <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-100 text-xs">
                <span className="text-slate-400 font-medium">Active:</span>
                {searchTerm && (
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-medium">
                    Search: &ldquo;{searchTerm}&rdquo;
                    <button
                      type="button"
                      onClick={() => {
                        setSearchTerm("");
                        router.replace("/products");
                      }}
                      className="hover:text-amber-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                )}
                {selectedCategories.map((cat) => (
                  <span
                    key={cat}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 capitalize font-medium"
                  >
                    {cat}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedCategories((prev) =>
                          prev.filter((c) => c !== cat)
                        )
                      }
                      className="hover:text-slate-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                {selectedDistricts.map((dist) => (
                  <span
                    key={dist}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-100 text-slate-700 border border-slate-200 capitalize font-medium"
                  >
                    {dist}
                    <button
                      type="button"
                      onClick={() =>
                        setSelectedDistricts((prev) =>
                          prev.filter((d) => d !== dist)
                        )
                      }
                      className="hover:text-slate-900"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </span>
                ))}
                <span className="text-slate-400 ml-auto">
                  {totalItems} item{totalItems === 1 ? "" : "s"} found
                </span>
              </div>
            )}
          </div>

          {/* Products Grid */}
          {paginatedProducts && paginatedProducts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-4 flex-1">
              {paginatedProducts.map((product) => (
                <ProductCard key={product?._id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16 px-4 bg-white rounded-2xl border border-dashed border-slate-200 shadow-2xs">
              <div className="w-12 h-12 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-3">
                <Search className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-slate-800 mb-1">
                No products found
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto mb-4">
                {searchTerm
                  ? `We couldn't find any products matching "${searchTerm}". Try checking for spelling or using more general terms.`
                  : "No products match the selected filters. Try broadening your criteria."}
              </p>
              <Button
                onClick={handleClearAll}
                variant="outline"
                size="sm"
                className="rounded-full text-xs font-semibold border-amber-500 text-amber-700 hover:bg-amber-50"
              >
                Clear all filters & search
              </Button>
            </div>
          )}

          {/* Pagination Actions */}
          {totalPages > 1 && (
            <div className="flex justify-end items-center gap-2 my-10">
              <Button
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={validCurrentPage === 1}
                size="sm"
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white cursor-pointer rounded-lg text-xs"
              >
                Previous
              </Button>
              <span className="text-xs sm:text-sm font-semibold text-slate-600 px-2">
                Page {validCurrentPage} of {totalPages}
              </span>
              <Button
                onClick={() =>
                  setCurrentPage((prev) => Math.min(prev + 1, totalPages))
                }
                disabled={validCurrentPage === totalPages}
                size="sm"
                className="bg-[#F59E0B] hover:bg-[#D97706] text-white cursor-pointer rounded-lg text-xs"
              >
                Next
              </Button>
            </div>
          )}
        </div>
      </div>
    </Container>
  );
}
