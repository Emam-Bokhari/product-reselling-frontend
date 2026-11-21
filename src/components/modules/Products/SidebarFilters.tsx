"use client";

import { useState, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  SlidersHorizontal,
  RotateCcw,
  Search,
  X,
  Smartphone,
  Laptop,
  Car,
  Building,
  Home,
  Shirt,
  PawPrint,
  Trophy,
  MapPin,
  Tag,
  CheckCircle2,
} from "lucide-react";
import { districts } from "@/constants/districts";

export const CATEGORIES_CONFIG = [
  { id: "mobiles", label: "Mobiles & Tablets", icon: Smartphone },
  { id: "electronics", label: "Electronics & Gadgets", icon: Laptop },
  { id: "vehicles", label: "Vehicles & Cars", icon: Car },
  { id: "property", label: "Property & Real Estate", icon: Building },
  { id: "home", label: "Home & Living", icon: Home },
  { id: "clothes", label: "Fashion & Clothing", icon: Shirt },
  { id: "pets", label: "Pets & Animals", icon: PawPrint },
  { id: "sports", label: "Sports & Hobbies", icon: Trophy },
];

export const CONDITIONS_CONFIG = [
  {
    id: "new",
    label: "New",
    dotColor: "bg-emerald-500",
  },
  {
    id: "likeNew",
    label: "Like New",
    dotColor: "bg-amber-500",
  },
  {
    id: "used",
    label: "Used",
    dotColor: "bg-blue-500",
  },
  {
    id: "refurbished",
    label: "Refurbished",
    dotColor: "bg-purple-500",
  },
];

export const POPULAR_DISTRICTS = ["dhaka", "chattogram", "sylhet", "khulna", "bogura"];

const PRICE_PRESETS = [
  { label: "Under ৳5K", min: 0, max: 5000 },
  { label: "৳5K - ৳25K", min: 5000, max: 25000 },
  { label: "৳25K - ৳50K", min: 25000, max: 50000 },
  { label: "৳50K+", min: 50000, max: "" as const },
];

interface SidebarFiltersProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  selectedConditions: string[];
  setSelectedConditions: React.Dispatch<React.SetStateAction<string[]>>;
  selectedDistricts: string[];
  setSelectedDistricts: React.Dispatch<React.SetStateAction<string[]>>;
  priceRange: { min: number | ""; max: number | "" };
  setPriceRange: React.Dispatch<
    React.SetStateAction<{ min: number | ""; max: number | "" }>
  >;
  isAvailable: boolean;
  setIsAvailable: React.Dispatch<React.SetStateAction<boolean>>;
  isNegotiable: boolean;
  setIsNegotiable: React.Dispatch<React.SetStateAction<boolean>>;
  categoryCounts?: Record<string, number>;
  conditionCounts?: Record<string, number>;
  districtCounts?: Record<string, number>;
  totalFilteredCount?: number;
  onClearAll: () => void;
  isMobileOpen: boolean;
  setIsMobileOpen: (open: boolean) => void;
}

export default function SidebarFilters({
  selectedCategories,
  setSelectedCategories,
  selectedConditions,
  setSelectedConditions,
  selectedDistricts,
  setSelectedDistricts,
  priceRange,
  setPriceRange,
  isAvailable,
  setIsAvailable,
  isNegotiable,
  setIsNegotiable,
  categoryCounts = {},
  conditionCounts = {},
  districtCounts = {},
  totalFilteredCount = 0,
  onClearAll,
  isMobileOpen,
  setIsMobileOpen,
}: SidebarFiltersProps) {
  // District search term
  const [districtSearch, setDistrictSearch] = useState("");

  // Min / Max local input states
  const [minInput, setMinInput] = useState(priceRange.min === "" ? "" : String(priceRange.min));
  const [maxInput, setMaxInput] = useState(priceRange.max === "" ? "" : String(priceRange.max));

  // Sync inputs if priceRange changes externally (e.g. on reset)
  useMemo(() => {
    setMinInput(priceRange.min === "" ? "" : String(priceRange.min));
    setMaxInput(priceRange.max === "" ? "" : String(priceRange.max));
  }, [priceRange.min, priceRange.max]);

  const toggleCategory = (catId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(catId) ? prev.filter((c) => c !== catId) : [...prev, catId]
    );
  };

  const toggleCondition = (condId: string) => {
    setSelectedConditions((prev) => {
      const exists = prev.some((c) => c.toLowerCase() === condId.toLowerCase());
      if (exists) {
        return prev.filter((c) => c.toLowerCase() !== condId.toLowerCase());
      } else {
        return [...prev, condId];
      }
    });
  };

  const toggleDistrict = (dist: string) => {
    setSelectedDistricts((prev) =>
      prev.includes(dist) ? prev.filter((d) => d !== dist) : [...prev, dist]
    );
  };

  const handleApplyPrice = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const minVal = minInput.trim() === "" ? "" : Math.max(0, Number(minInput));
    const maxVal = maxInput.trim() === "" ? "" : Math.max(0, Number(maxInput));
    setPriceRange({ min: minVal, max: maxVal });
  };

  const handlePricePreset = (min: number | "", max: number | "") => {
    setMinInput(min === "" ? "" : String(min));
    setMaxInput(max === "" ? "" : String(max));
    setPriceRange({ min, max });
  };

  const handleClearPrice = () => {
    setMinInput("");
    setMaxInput("");
    setPriceRange({ min: "", max: "" });
  };

  // Filtered districts list
  const filteredDistricts = useMemo(() => {
    if (!districtSearch.trim()) return districts;
    const term = districtSearch.toLowerCase().trim();
    return districts.filter((d) => d.toLowerCase().includes(term));
  }, [districtSearch]);

  const activeFiltersCount =
    selectedCategories.length +
    selectedConditions.length +
    selectedDistricts.length +
    (priceRange.min !== "" || priceRange.max !== "" ? 1 : 0) +
    (isAvailable ? 1 : 0) +
    (isNegotiable ? 1 : 0);

  // Common Filter Content JSX
  const FilterContent = (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-200/80">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-amber-500/10 text-amber-600 flex items-center justify-center">
            <SlidersHorizontal className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 text-sm tracking-tight">
              Filters
            </h3>
            <p className="text-[11px] text-slate-400">
              Refine results
            </p>
          </div>
        </div>

        {activeFiltersCount > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClearAll}
            className="h-8 px-2 text-xs text-amber-700 hover:text-amber-800 hover:bg-amber-50 rounded-lg font-medium flex items-center gap-1 cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            Clear All
          </Button>
        )}
      </div>

      <Accordion
        type="multiple"
        defaultValue={["category", "price", "condition", "location", "availability"]}
        className="w-full"
      >
        {/* ============================================================
            1. CATEGORIES ACCORDION
            ============================================================ */}
        <AccordionItem value="category" className="border-b border-slate-100 py-1">
          <AccordionTrigger className="py-2.5 text-xs font-bold text-slate-800 uppercase tracking-wider hover:no-underline hover:text-amber-600">
            <div className="flex items-center gap-2">
              <span>Category</span>
              {selectedCategories.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0 h-4 rounded-full font-bold"
                >
                  {selectedCategories.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <div className="space-y-1">
              {CATEGORIES_CONFIG.map((cat) => {
                const Icon = cat.icon;
                const isChecked = selectedCategories.includes(cat.id);
                const count = categoryCounts[cat.id] || 0;

                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => toggleCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isChecked
                        ? "bg-amber-50 text-amber-900 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-amber-500 border-amber-500 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                      </div>
                      <Icon
                        className={`w-4 h-4 ${
                          isChecked ? "text-amber-600" : "text-slate-400"
                        }`}
                      />
                      <span className="truncate">{cat.label}</span>
                    </div>

                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                        isChecked
                          ? "bg-amber-200/60 text-amber-900 font-bold"
                          : "text-slate-400 bg-slate-100"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ============================================================
            2. PRICE RANGE ACCORDION
            ============================================================ */}
        <AccordionItem value="price" className="border-b border-slate-100 py-1">
          <AccordionTrigger className="py-2.5 text-xs font-bold text-slate-800 uppercase tracking-wider hover:no-underline hover:text-amber-600">
            <div className="flex items-center gap-2">
              <span>Price Range (BDT)</span>
              {(priceRange.min !== "" || priceRange.max !== "") && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0 h-4 rounded-full font-bold"
                >
                  Active
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            {/* Quick Price Presets */}
            <div className="grid grid-cols-2 gap-1.5 mb-3">
              {PRICE_PRESETS.map((preset, idx) => {
                const isActive =
                  priceRange.min === preset.min && priceRange.max === preset.max;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => handlePricePreset(preset.min, preset.max)}
                    className={`px-2 py-1.5 rounded-lg text-[11px] font-medium border text-center transition-all cursor-pointer ${
                      isActive
                        ? "bg-amber-500 text-white border-amber-500 shadow-xs"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100 hover:text-slate-900"
                    }`}
                  >
                    {preset.label}
                  </button>
                );
              })}
            </div>

            {/* Custom Inputs */}
            <form onSubmit={handleApplyPrice} className="space-y-2">
              <div className="flex items-center gap-2">
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ৳
                  </span>
                  <Input
                    type="number"
                    placeholder="Min"
                    value={minInput}
                    onChange={(e) => setMinInput(e.target.value)}
                    className="pl-6 h-8 text-xs bg-slate-50 border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
                <span className="text-slate-400 text-xs">-</span>
                <div className="relative flex-1">
                  <span className="absolute left-2.5 top-1/2 -translate-y-1/2 text-slate-400 text-xs">
                    ৳
                  </span>
                  <Input
                    type="number"
                    placeholder="Max"
                    value={maxInput}
                    onChange={(e) => setMaxInput(e.target.value)}
                    className="pl-6 h-8 text-xs bg-slate-50 border-slate-200 rounded-lg focus:bg-white"
                  />
                </div>
              </div>

              <div className="flex items-center gap-2 pt-1">
                <Button
                  type="submit"
                  size="sm"
                  className="flex-1 h-8 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-lg cursor-pointer"
                >
                  Apply Price
                </Button>
                {(priceRange.min !== "" || priceRange.max !== "") && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleClearPrice}
                    className="h-8 px-2.5 text-xs text-slate-500 border-slate-200 hover:text-rose-600 rounded-lg"
                    title="Reset price filter"
                  >
                    <X className="w-3.5 h-3.5" />
                  </Button>
                )}
              </div>
            </form>
          </AccordionContent>
        </AccordionItem>

        {/* ============================================================
            3. CONDITION ACCORDION
            ============================================================ */}
        <AccordionItem value="condition" className="border-b border-slate-100 py-1">
          <AccordionTrigger className="py-2.5 text-xs font-bold text-slate-800 uppercase tracking-wider hover:no-underline hover:text-amber-600">
            <div className="flex items-center gap-2">
              <span>Item Condition</span>
              {selectedConditions.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0 h-4 rounded-full font-bold"
                >
                  {selectedConditions.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            <div className="space-y-1">
              {CONDITIONS_CONFIG.map((cond) => {
                const isChecked = selectedConditions.some(
                  (c) => c.toLowerCase() === cond.id.toLowerCase()
                );
                const count =
                  conditionCounts[cond.id] ??
                  conditionCounts[cond.id.toLowerCase()] ??
                  0;

                return (
                  <button
                    key={cond.id}
                    type="button"
                    onClick={() => toggleCondition(cond.id)}
                    className={`w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs transition-all cursor-pointer ${
                      isChecked
                        ? "bg-amber-50 text-amber-900 font-semibold"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                          isChecked
                            ? "bg-amber-500 border-amber-500 text-white"
                            : "border-slate-300 bg-white"
                        }`}
                      >
                        {isChecked && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                      </div>
                      <span className={`w-2 h-2 rounded-full ${cond.dotColor}`} />
                      <span>{cond.label}</span>
                    </div>

                    <span
                      className={`text-[11px] px-1.5 py-0.2 rounded-md ${
                        isChecked
                          ? "bg-amber-200/60 text-amber-900 font-bold"
                          : "text-slate-400 bg-slate-100"
                      }`}
                    >
                      {count}
                    </span>
                  </button>
                );
              })}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ============================================================
            4. LOCATION / DISTRICTS ACCORDION
            ============================================================ */}
        <AccordionItem value="location" className="border-b border-slate-100 py-1">
          <AccordionTrigger className="py-2.5 text-xs font-bold text-slate-800 uppercase tracking-wider hover:no-underline hover:text-amber-600">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" /> Location
              </span>
              {selectedDistricts.length > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-amber-100 text-amber-800 text-[10px] px-1.5 py-0 h-4 rounded-full font-bold"
                >
                  {selectedDistricts.length}
                </Badge>
              )}
            </div>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-3">
            {/* Quick popular chips */}
            <div className="flex flex-wrap gap-1.5 mb-2.5">
              {POPULAR_DISTRICTS.map((dist) => {
                const isSelected = selectedDistricts.includes(dist);
                const count = districtCounts[dist] || 0;
                return (
                  <button
                    key={dist}
                    type="button"
                    onClick={() => toggleDistrict(dist)}
                    className={`px-2.5 py-1 rounded-full text-[11px] font-medium border capitalize transition-all cursor-pointer ${
                      isSelected
                        ? "bg-amber-500 text-white border-amber-500"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100"
                    }`}
                  >
                    {dist} {count > 0 && `(${count})`}
                  </button>
                );
              })}
            </div>

            {/* Search district input */}
            <div className="relative mb-2">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <Input
                type="text"
                placeholder="Search district..."
                value={districtSearch}
                onChange={(e) => setDistrictSearch(e.target.value)}
                className="pl-8 pr-7 h-8 text-xs bg-slate-50 border-slate-200 rounded-lg focus:bg-white"
              />
              {districtSearch && (
                <button
                  type="button"
                  onClick={() => setDistrictSearch("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                >
                  <X className="w-3 h-3" />
                </button>
              )}
            </div>

            {/* Scrollable districts list */}
            <div className="max-h-44 overflow-y-auto space-y-0.5 pr-1 text-xs">
              {filteredDistricts.length > 0 ? (
                filteredDistricts.map((item) => {
                  const isChecked = selectedDistricts.includes(item);
                  const count = districtCounts[item] || 0;

                  return (
                    <button
                      key={item}
                      type="button"
                      onClick={() => toggleDistrict(item)}
                      className={`w-full flex items-center justify-between px-2 py-1.5 rounded-lg text-xs capitalize transition-colors cursor-pointer ${
                        isChecked
                          ? "bg-amber-50 text-amber-900 font-semibold"
                          : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <div
                          className={`w-3.5 h-3.5 rounded-[3px] border flex items-center justify-center transition-colors ${
                            isChecked
                              ? "bg-amber-500 border-amber-500 text-white"
                              : "border-slate-300 bg-white"
                          }`}
                        >
                          {isChecked && <CheckCircle2 className="w-3 h-3 fill-current" />}
                        </div>
                        <span>{item}</span>
                      </div>
                      {count > 0 && (
                        <span className="text-[10px] text-amber-700 bg-amber-100 px-1.5 py-0.2 rounded font-semibold">
                          {count}
                        </span>
                      )}
                    </button>
                  );
                })
              ) : (
                <p className="text-slate-400 text-xs py-2 text-center">
                  No district matching &quot;{districtSearch}&quot;
                </p>
              )}
            </div>
          </AccordionContent>
        </AccordionItem>

        {/* ============================================================
            5. AVAILABILITY & DEALS ACCORDION
            ============================================================ */}
        <AccordionItem value="availability" className="border-b-0 py-1">
          <AccordionTrigger className="py-2.5 text-xs font-bold text-slate-800 uppercase tracking-wider hover:no-underline hover:text-amber-600">
            <span>Availability & Deals</span>
          </AccordionTrigger>
          <AccordionContent className="pt-1 pb-2">
            <div className="space-y-2">
              {/* Available toggle */}
              <button
                type="button"
                onClick={() => setIsAvailable((prev) => !prev)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  isAvailable
                    ? "bg-emerald-50 border-emerald-300 text-emerald-900 font-semibold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                      isAvailable
                        ? "bg-emerald-600 border-emerald-600 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isAvailable && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                  </div>
                  <span>In Stock / Available Only</span>
                </div>
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
              </button>

              {/* Negotiable toggle */}
              <button
                type="button"
                onClick={() => setIsNegotiable((prev) => !prev)}
                className={`w-full flex items-center justify-between p-2.5 rounded-xl border text-xs transition-all cursor-pointer ${
                  isNegotiable
                    ? "bg-amber-50 border-amber-300 text-amber-900 font-semibold"
                    : "bg-white border-slate-200 text-slate-700 hover:bg-slate-50"
                }`}
              >
                <div className="flex items-center gap-2">
                  <div
                    className={`w-4 h-4 rounded-[4px] border flex items-center justify-center transition-colors ${
                      isNegotiable
                        ? "bg-amber-500 border-amber-500 text-white"
                        : "border-slate-300 bg-white"
                    }`}
                  >
                    {isNegotiable && <CheckCircle2 className="w-3.5 h-3.5 fill-current" />}
                  </div>
                  <span>Price Negotiable Only</span>
                </div>
                <Tag className="w-3.5 h-3.5 text-amber-500" />
              </button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );

  return (
    <>
      {/* ============================================================
          DESKTOP SIDEBAR (Sticky on lg screens)
          ============================================================ */}
      <aside className="hidden lg:block w-72 xl:w-80 shrink-0">
        <div className="sticky top-20 bg-white rounded-2xl border border-slate-200/80 p-5 shadow-xs max-h-[calc(100vh-6rem)] overflow-y-auto">
          {FilterContent}
        </div>
      </aside>

      {/* ============================================================
          MOBILE DRAWER (Using Radix Sheet)
          ============================================================ */}
      <Sheet open={isMobileOpen} onOpenChange={setIsMobileOpen}>
        <SheetContent
          side="left"
          className="w-full sm:max-w-md p-0 flex flex-col h-full bg-white z-[100]"
        >
          {/* Mobile Sheet Header */}
          <SheetHeader className="p-4 border-b border-slate-200 flex-row items-center justify-between bg-slate-50/50 space-y-0">
            <SheetTitle className="flex items-center gap-2 font-bold text-slate-900 text-base">
              <SlidersHorizontal className="w-4 h-4 text-amber-500" />
              <span>Filters</span>
              {activeFiltersCount > 0 && (
                <Badge className="bg-amber-500 text-white text-[11px] px-2 py-0.5 rounded-full font-bold">
                  {activeFiltersCount} active
                </Badge>
              )}
            </SheetTitle>
          </SheetHeader>

          {/* Mobile Sheet Body */}
          <div className="flex-1 overflow-y-auto p-4">
            {FilterContent}
          </div>

          {/* Mobile Sheet Sticky Footer */}
          <div className="p-4 border-t border-slate-200 bg-white flex items-center gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onClearAll();
                setIsMobileOpen(false);
              }}
              className="flex-1 h-11 text-xs font-semibold rounded-xl border-slate-200 text-slate-600 hover:bg-slate-50"
            >
              Clear All
            </Button>
            <Button
              type="button"
              onClick={() => setIsMobileOpen(false)}
              className="flex-1 h-11 bg-amber-500 hover:bg-amber-600 text-white text-xs font-semibold rounded-xl shadow-xs"
            >
              Show {totalFilteredCount} Items
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
