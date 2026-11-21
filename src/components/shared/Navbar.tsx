"use client";

import React, { useEffect, useState, useRef, useMemo, Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useSelector } from "react-redux";
import { RootState } from "@/redux/store";
import { useAppDispatch } from "@/redux/hooks";
import { logout } from "@/redux/features/authSlice";
import { logoutFromCookie } from "@/services/Auth";
import { getAllProducts } from "@/services/Product";
import { getAllBlogs } from "@/services/Blog";
import { TBlog, TProduct } from "@/types";
import { cn } from "@/lib/utils";

// Assets
import logo from "@/assets/Logo.png";
import usaFlag from "@/assets/united-states.png";
import property from "@/assets/property.png";
import home from "@/assets/home.png";
import vehicles from "@/assets/car.png";
import electronics from "@/assets/electronics.png";
import mobile from "@/assets/mobile.png";
import pets from "@/assets/pets.png";
import sports from "@/assets/sports.png";
import clothes from "@/assets/clothes.png";

// UI Components
import Container from "./Container";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Badge } from "../ui/badge";
import { Avatar, AvatarFallback } from "../ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "../ui/sheet";

// Lucide Icons
import {
  ArrowRight,
  BookOpen,
  Building2,
  ChevronDown,
  Heart,
  HelpCircle,
  Home as HomeIcon,
  LayoutDashboard,
  LogInIcon,
  LogOutIcon,
  Mail,
  Menu,
  Phone,
  PlusCircle,
  Search,
  ShieldCheck,
  ShoppingBag,
  Tag,
  User,
  UserPlus,
  X,
} from "lucide-react";

// Categories metadata
export const CATEGORIES = [
  { name: "property", label: "Property", image: property },
  { name: "home", label: "Home & Living", image: home },
  { name: "vehicles", label: "Vehicles", image: vehicles },
  { name: "electronics", label: "Electronics", image: electronics },
  { name: "mobile", label: "Mobiles", image: mobile },
  { name: "pets", label: "Pets & Animals", image: pets },
  { name: "sports", label: "Sports & Hobbies", image: sports },
  { name: "clothes", label: "Fashion & Cloths", image: clothes },
];

// MegaMenu Component
export const MegaMenu = ({ onClose }: { onClose?: () => void }) => {
  const [products, setProducts] = useState<TProduct[]>([]);
  const [blogs, setBlogs] = useState<TBlog[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchData() {
      try {
        const [prodRes, blogRes] = await Promise.allSettled([
          getAllProducts(),
          getAllBlogs(),
        ]);

        if (isMounted) {
          if (prodRes.status === "fulfilled" && prodRes.value?.data) {
            setProducts(prodRes.value.data);
          }
          if (blogRes.status === "fulfilled" && blogRes.value?.data) {
            setBlogs(blogRes.value.data);
          }
        }
      } catch (err) {
        console.error("MegaMenu data fetch error:", err);
      } finally {
        if (isMounted) setIsLoading(false);
      }
    }

    fetchData();
    return () => {
      isMounted = false;
    };
  }, []);

  const sortedProducts = [...products]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    )
    .slice(0, 3);

  const featuredBlog =
    blogs.length > 0
      ? [...blogs].sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        )[0]
      : null;

  return (
    <div className="w-[860px] max-w-[92vw] bg-white rounded-2xl shadow-2xl border border-slate-100 p-6 overflow-hidden">
      <div className="grid grid-cols-12 gap-6">
        {/* Left Column: Categories Grid */}
        <div className="col-span-5 pr-4 border-r border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              Browse Categories
            </span>
            <Link
              href="/products"
              onClick={onClose}
              className="text-xs font-semibold text-amber-600 hover:text-amber-700 flex items-center gap-1 transition-colors"
            >
              All Items <ArrowRight className="w-3 h-3" />
            </Link>
          </div>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map((cat) => (
              <Link
                key={cat.name}
                href={`/category/${cat.name}`}
                onClick={onClose}
                className="group/cat flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50/70 border border-transparent hover:border-amber-200/50 transition-all duration-150"
              >
                <div className="w-7 h-7 relative shrink-0">
                  <Image
                    src={cat.image}
                    alt={cat.label}
                    fill
                    className="object-contain transition-transform group-hover/cat:scale-110"
                  />
                </div>
                <span className="text-xs font-medium text-slate-700 group-hover/cat:text-amber-800 truncate">
                  {cat.label}
                </span>
              </Link>
            ))}
          </div>
        </div>

        {/* Middle Column: New Arrivals */}
        <div className="col-span-4 pr-4 border-r border-slate-100">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">
              New Arrivals
            </span>
            <Link
              href="/products"
              onClick={onClose}
              className="text-xs text-amber-600 hover:underline"
            >
              Explore
            </Link>
          </div>

          <div className="space-y-2.5">
            {isLoading ? (
              [1, 2, 3].map((n) => (
                <div
                  key={n}
                  className="h-16 rounded-xl bg-slate-100 animate-pulse"
                />
              ))
            ) : sortedProducts.length > 0 ? (
              sortedProducts.map((prod) => (
                <Link
                  key={prod._id}
                  href={`/products/${prod._id}`}
                  onClick={onClose}
                  className="group/prod flex items-center gap-3 p-2 rounded-xl hover:bg-slate-50 transition-all"
                >
                  <div className="w-12 h-12 relative rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                    {prod.images?.[0] ? (
                      <Image
                        src={prod.images[0]}
                        alt={prod.title}
                        fill
                        className="object-cover group-hover/prod:scale-105 transition-transform"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                        Item
                      </div>
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-semibold text-slate-800 truncate group-hover/prod:text-amber-600">
                      {prod.title}
                    </p>
                    <div className="flex items-center gap-2 mt-0.5">
                      <span className="text-xs font-bold text-amber-600">
                        ৳{prod.price?.toLocaleString()}
                      </span>
                      {prod.condition && (
                        <span className="text-[10px] text-slate-400 capitalize">
                          • {prod.condition}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              ))
            ) : (
              <p className="text-xs text-slate-400 py-4 text-center">
                No recent arrivals available
              </p>
            )}
          </div>
        </div>

        {/* Right Column: Sell CTA & Blog */}
        <div className="col-span-3 flex flex-col justify-between">
          <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 p-4 rounded-xl shadow-xs">
            <div className="flex items-center gap-1.5 mb-1">
            
              <h4 className="font-bold text-xs">Got something to sell?</h4>
            </div>
            <p className="text-[11px] text-slate-950/80 mb-3 leading-snug">
              Turn your unused items into cash with zero listing fees.
            </p>
            <Link
              href="/user/dashboard/products/add-product"
              onClick={onClose}
              className="inline-flex items-center gap-1 bg-slate-950 hover:bg-slate-900 text-white text-[11px] font-semibold px-3 py-1.5 rounded-full transition-all"
            >
              <PlusCircle className="w-3.5 h-3.5 text-amber-400" />
              Post an Ad
            </Link>
          </div>

          {featuredBlog && (
            <Link
              href={`/blogs/${featuredBlog._id}`}
              onClick={onClose}
              className="group/blog block p-2 rounded-xl hover:bg-slate-50 transition-all border border-slate-100/80 mt-3"
            >
              <span className="text-[10px] font-bold text-amber-600 uppercase tracking-wider block mb-0.5">
                Buying & Selling Guide
              </span>
              <p className="text-xs font-semibold text-slate-800 line-clamp-2 group-hover/blog:text-amber-600 leading-snug">
                {featuredBlog.title}
              </p>
            </Link>
          )}
        </div>
      </div>

      {/* Trust bar footer */}
      <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
        <div className="flex items-center gap-1 text-slate-600">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>100% Verified Community Listings</span>
        </div>
        <div className="flex items-center gap-4">
          <span>Safe Transactions</span>
          <span>•</span>
          <span>Zero Platform Commission</span>
          <span>•</span>
          <Link href="/faq" onClick={onClose} className="hover:text-amber-600 underline">
            FAQ
          </Link>
        </div>
      </div>
    </div>
  );
};

function NavbarSearchSync({ onSync }: { onSync: (query: string) => void }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();

  useEffect(() => {
    if (pathname === "/products") {
      const q = searchParams.get("search");
      if (q !== null) {
        onSync(q);
      }
    }
  }, [searchParams, pathname, onSync]);

  return null;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();

  const user = useSelector((state: RootState) => state.auth?.user);
  const wishlistItems = useSelector(
    (state: RootState) => state.wishlist?.items || []
  );
  const wishlistCount = wishlistItems.length;

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [allProducts, setAllProducts] = useState<TProduct[]>([]);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let isMounted = true;
    getAllProducts()
      .then((res) => {
        if (isMounted && res?.data) {
          setAllProducts(res.data);
        }
      })
      .catch((err) => {
        console.error("Navbar products fetch error:", err);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        searchContainerRef.current &&
        !searchContainerRef.current.contains(event.target as Node)
      ) {
        setIsSearchDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const searchResults = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q || allProducts.length === 0) return [];
    return allProducts
      .filter((p) =>
        [p.title, p.category, p.location, p.brand, p.description].some((field) =>
          field?.toLowerCase().includes(q)
        )
      )
      .slice(0, 5);
  }, [searchQuery, allProducts]);

  const handleLogout = async () => {
    dispatch(logout());
    await logoutFromCookie();
    router.push("/");
  };

  const handleSearch = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (query) {
      router.push(`/products?search=${encodeURIComponent(query)}`);
    } else {
      router.push("/products");
    }
    setMobileOpen(false);
    setIsMobileSearchOpen(false);
    setIsSearchDropdownOpen(false);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 25) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "Discover", href: "#", isMega: true },
    { name: "Blogs", href: "/blogs" },
    { name: "About Us", href: "/aboutUs" },
    { name: "Contact", href: "/contactUs" },
  ];

  return (
    <>
      <Suspense fallback={null}>
        <NavbarSearchSync onSync={setSearchQuery} />
      </Suspense>

      {/* Top Utility Bar (Desktop only) */}
      <div className="hidden md:block bg-slate-900 text-slate-300 text-xs py-2 border-b border-slate-800">
        <Container>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-6">
              <a
                href="tel:+8801315773424"
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 text-amber-500" />
                <span>+880 131 577 3424</span>
              </a>
              <a
                href="mailto:support@resellbd.com"
                className="flex items-center gap-1.5 hover:text-amber-400 transition-colors"
              >
                <Mail className="w-3.5 h-3.5 text-amber-500" />
                <span>support@resellbd.com</span>
              </a>
              <div className="hidden lg:flex items-center gap-1.5 text-slate-400">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                <span>Bangladesh&apos;s Trusted Second-Hand Marketplace</span>
              </div>
            </div>

            <div className="flex items-center gap-4 text-slate-400">
              <Link href="/faq" className="hover:text-amber-400 transition-colors">
                Help & FAQs
              </Link>
              <span className="text-slate-700">|</span>
              <div className="flex items-center gap-1.5 text-slate-300">
                <Image
                  src={usaFlag}
                  width={16}
                  height={16}
                  alt="English"
                  className="rounded-xs"
                />
                <span>English</span>
              </div>
              <span className="text-slate-700">|</span>
              <span className="font-semibold text-amber-400">BDT (৳)</span>
            </div>
          </div>
        </Container>
      </div>

      {/* Main Sticky Header */}
      <header
        className={cn(
          "sticky top-0 z-50 w-full transition-all duration-300 bg-white/95 backdrop-blur-md border-b border-slate-200/80",
          isScrolled ? "shadow-md py-2.5" : "py-3.5"
        )}
      >
        <Container className="px-3 sm:px-4">
          <div className="flex items-center justify-between gap-2 sm:gap-4">
            {/* Left: Brand Logo */}
            <div className="flex items-center gap-6 shrink-0">
              <Link href="/" className="flex items-center gap-2 sm:gap-2.5 group shrink-0">
                <div className="relative w-8 h-8 sm:w-10 sm:h-10 transition-transform duration-300 group-hover:scale-105 shrink-0">
                  <Image
                    src={logo}
                    alt="ReSellBD Logo"
                    fill
                    className="object-contain"
                    priority
                  />
                </div>
                <div className="flex flex-col">
                  <span className="text-lg sm:text-2xl font-black tracking-tight text-slate-900 leading-none">
                    ReSell<span className="text-amber-500">BD</span>
                  </span>
                  <span className="text-[10px] font-semibold text-slate-400 tracking-wider uppercase mt-0.5 hidden sm:block">
                    Smart Deals
                  </span>
                </div>
              </Link>

              {/* Desktop Nav Links */}
              <nav className="hidden lg:flex items-center gap-1">
                {navLinks.map((link) => {
                  if (link.isMega) {
                    const isDiscoverActive = pathname.startsWith("/category");
                    return (
                      <div key={link.name} className="relative group">
                        <button
                          type="button"
                          className={cn(
                            "flex items-center gap-1 px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150 cursor-pointer outline-hidden",
                            isDiscoverActive
                              ? "text-amber-600 font-semibold bg-amber-50/80"
                              : "text-slate-700 hover:text-amber-600 hover:bg-slate-100/70"
                          )}
                        >
                          <span>{link.name}</span>
                          <ChevronDown className="w-3.5 h-3.5 transition-transform duration-200 group-hover:rotate-180" />
                        </button>

                        {/* Mega Menu Dropdown */}
                        <div className="absolute left-1/2 -translate-x-1/2 top-full pt-2 opacity-0 translate-y-2 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-200 z-50">
                          <MegaMenu />
                        </div>
                      </div>
                    );
                  }

                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.name}
                      href={link.href}
                      className={cn(
                        "px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-150",
                        isActive
                          ? "text-amber-600 font-semibold bg-amber-50/80 shadow-xs"
                          : "text-slate-700 hover:text-amber-600 hover:bg-slate-100/70"
                      )}
                    >
                      {link.name}
                    </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right: Search, Wishlist, Post Ad CTA & User Profile */}
            <div className="flex items-center gap-1.5 sm:gap-2.5 md:gap-3 shrink-0">
              {/* Search Bar - Desktop & Tablet */}
              <div ref={searchContainerRef} className="hidden md:flex items-center relative">
                <form
                  onSubmit={handleSearch}
                  className="relative flex items-center"
                >
                  <button
                    type="submit"
                    className="absolute left-3 text-slate-400 hover:text-amber-600 transition-colors cursor-pointer p-0.5"
                    aria-label="Submit search"
                  >
                    <Search className="w-4 h-4" />
                  </button>
                  <Input
                    type="text"
                    placeholder="Search products..."
                    value={searchQuery}
                    onFocus={() => {
                      if (searchQuery.trim().length > 0) {
                        setIsSearchDropdownOpen(true);
                      }
                    }}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setIsSearchDropdownOpen(e.target.value.trim().length > 0);
                    }}
                    className="w-40 sm:w-48 lg:w-48 xl:w-64 h-9 pl-9 pr-8 text-xs bg-slate-100/80 hover:bg-slate-100 focus:bg-white rounded-full border border-slate-200/80 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/20 transition-all placeholder:text-slate-400 shadow-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery("");
                        setIsSearchDropdownOpen(false);
                      }}
                      className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                      aria-label="Clear search input"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </form>

                {/* Instant Search Results Dropdown */}
                {isSearchDropdownOpen && searchQuery.trim().length > 0 && (
                  <div className="absolute top-full mt-2 right-0 sm:left-0 sm:right-auto w-72 sm:w-80 md:w-96 bg-white rounded-2xl shadow-2xl border border-slate-100 p-3 z-50 animate-in fade-in-50 zoom-in-95 duration-150">
                    <div className="flex items-center justify-between px-2 py-1 mb-1 border-b border-slate-100 text-[11px] text-slate-400 font-semibold uppercase tracking-wider">
                      <span>Matching Products</span>
                      <span>
                        {searchResults.length > 0
                          ? `${searchResults.length} preview`
                          : "0 found"}
                      </span>
                    </div>

                    {searchResults.length > 0 ? (
                      <div className="space-y-1">
                        {searchResults.map((prod) => (
                          <Link
                            key={prod._id}
                            href={`/products/${prod._id}`}
                            onClick={() => {
                              setIsSearchDropdownOpen(false);
                            }}
                            className="flex items-center gap-2.5 p-2 rounded-xl hover:bg-amber-50/70 transition-colors group"
                          >
                            <div className="w-10 h-10 relative rounded-lg overflow-hidden bg-slate-100 shrink-0 border border-slate-200/60">
                              {prod.images?.[0] ? (
                                <Image
                                  src={prod.images[0]}
                                  alt={prod.title}
                                  fill
                                  className="object-cover group-hover:scale-105 transition-transform"
                                />
                              ) : (
                                <div className="w-full h-full flex items-center justify-center text-slate-400 text-[10px]">
                                  Item
                                </div>
                              )}
                            </div>
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-semibold text-slate-800 truncate group-hover:text-amber-600">
                                {prod.title}
                              </p>
                              <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-0.5">
                                <span className="font-bold text-amber-600">
                                  ৳{prod.price?.toLocaleString()}
                                </span>
                                <span className="capitalize">• {prod.category}</span>
                                {prod.location && (
                                  <span className="capitalize text-[10px] text-slate-400 truncate">
                                    • {prod.location}
                                  </span>
                                )}
                              </div>
                            </div>
                          </Link>
                        ))}

                        <button
                          type="button"
                          onClick={() => handleSearch()}
                          className="w-full mt-2 pt-2 border-t border-slate-100 text-center text-xs font-semibold text-amber-600 hover:text-amber-700 py-1 hover:underline flex items-center justify-center gap-1 cursor-pointer"
                        >
                          <span>View all results for &ldquo;{searchQuery}&rdquo;</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    ) : (
                      <div className="py-4 text-center">
                        <p className="text-xs text-slate-500">
                          No matching preview found for &ldquo;{searchQuery}&rdquo;
                        </p>
                        <button
                          type="button"
                          onClick={() => handleSearch()}
                          className="mt-2 text-xs font-semibold text-amber-600 hover:underline inline-flex items-center gap-1 cursor-pointer"
                        >
                          <span>Search across all products</span>
                          <ArrowRight className="w-3 h-3" />
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Mobile Search Toggle Button */}
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsMobileSearchOpen((prev) => !prev)}
                className="md:hidden rounded-full hover:bg-slate-100 text-slate-700 h-8 w-8 sm:h-9 sm:w-9 p-0 shrink-0 cursor-pointer"
                aria-label="Toggle mobile search"
              >
                <Search className="w-4 h-4" />
              </Button>

              {/* Wishlist Button */}
              <Link
                href="/wishlist"
                className="relative p-1.5 sm:p-2 rounded-full text-slate-700 hover:text-amber-600 hover:bg-amber-50/80 transition-colors group shrink-0"
                title="View Wishlist"
                aria-label="Wishlist"
              >
                <Heart className="w-4 h-4 sm:w-5 sm:h-5 transition-transform group-hover:scale-110" />
                {wishlistCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 bg-amber-500 text-slate-950 font-bold text-[10px] min-w-3.5 h-3.5 sm:min-w-4 sm:h-4 px-1 rounded-full flex items-center justify-center border-2 border-white shadow-xs">
                    {wishlistCount > 9 ? "9+" : wishlistCount}
                  </span>
                )}
              </Link>

              {/* Post Ad / Sell Item Button */}
              <Link href={user ? "/user/dashboard/products/add-product" : "/login"} className="shrink-0">
                <Button
                  size="sm"
                  className="bg-amber-500 hover:bg-amber-600 text-slate-950 font-semibold text-xs md:text-sm px-2.5 sm:px-4 py-1.5 sm:py-2 h-8 sm:h-9 rounded-full shadow-xs hover:shadow-md transition-all flex items-center gap-1 sm:gap-1.5 cursor-pointer border border-amber-400/50"
                >
                  <PlusCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
                  <span className="hidden sm:inline">Post Ad</span>
                  <span className="sm:hidden text-xs">Sell</span>
                </Button>
              </Link>

              {/* User Profile Dropdown or Auth Buttons */}
              {user ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <button className="flex items-center gap-1 sm:gap-2 p-1 pl-1 sm:pl-1.5 pr-1.5 sm:pr-2.5 rounded-full border border-slate-200 hover:border-amber-400 hover:bg-amber-50/40 transition-all outline-hidden cursor-pointer group shrink-0">
                      <Avatar className="w-7 h-7 sm:w-8 sm:h-8 border border-amber-400/60 shadow-2xs">
                        <AvatarFallback className="bg-gradient-to-br from-amber-500 to-amber-600 text-slate-950 font-bold text-xs">
                          {user.identifier
                            ? user.identifier.slice(0, 2).toUpperCase()
                            : "U"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="hidden xl:flex flex-col text-left">
                        <span className="text-xs font-semibold text-slate-800 truncate max-w-[100px]">
                          {user.identifier?.split("@")[0] || "Account"}
                        </span>
                        <span className="text-[10px] text-amber-600 capitalize font-medium leading-none">
                          {user.role || "Member"}
                        </span>
                      </div>
                      <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-600 transition-transform duration-200" />
                    </button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align="end"
                    className="w-60 p-2 rounded-2xl shadow-xl border border-slate-100 bg-white z-50"
                  >
                    <div className="px-3 py-2.5 bg-slate-50/80 rounded-xl mb-1 border border-slate-100">
                      <p className="text-[11px] text-slate-500 font-medium">
                        Signed in as
                      </p>
                      <p className="text-xs font-semibold text-slate-900 truncate">
                        {user.identifier}
                      </p>
                      <div className="mt-1">
                        <Badge
                          variant={user.role === "admin" ? "default" : "secondary"}
                          className="text-[10px] py-0 px-2 h-4 uppercase font-semibold"
                        >
                          {user.role === "admin" ? "Admin" : "Verified Member"}
                        </Badge>
                      </div>
                    </div>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem asChild>
                      <Link
                        href={
                          user.role === "admin"
                            ? "/admin/dashboard"
                            : "/user/dashboard"
                        }
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-amber-50 cursor-pointer"
                      >
                        <LayoutDashboard className="w-4 h-4 text-amber-500" />
                        <span className="font-medium text-slate-700">
                          Dashboard
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/user/dashboard/user-profile"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-amber-50 cursor-pointer"
                      >
                        <User className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-700">
                          My Profile
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/user/dashboard/orders/purchase-history"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-amber-50 cursor-pointer"
                      >
                        <ShoppingBag className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-700">
                          Purchase History
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/user/dashboard/products"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-amber-50 cursor-pointer"
                      >
                        <Tag className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-700">
                          My Listings
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link
                        href="/wishlist"
                        className="flex items-center gap-2.5 px-3 py-2 text-sm rounded-lg hover:bg-amber-50 cursor-pointer"
                      >
                        <Heart className="w-4 h-4 text-slate-600" />
                        <span className="font-medium text-slate-700">
                          Wishlist
                        </span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuSeparator className="my-1" />
                    <DropdownMenuItem
                      onClick={handleLogout}
                      className="flex items-center gap-2.5 px-3 py-2 text-sm text-red-600 rounded-lg hover:bg-red-50 hover:text-red-700 cursor-pointer"
                    >
                      <LogOutIcon className="w-4 h-4 text-red-500" />
                      <span className="font-medium">Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <div className="flex items-center gap-1 sm:gap-2 shrink-0">
                  <Link href="/login" className="shrink-0">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="font-medium text-slate-700 hover:text-amber-600 hover:bg-amber-50 rounded-full px-2 sm:px-3 text-xs md:text-sm h-8 sm:h-9 flex items-center gap-1 cursor-pointer"
                      aria-label="Sign In"
                      title="Sign In"
                    >
                      <LogInIcon className="w-4 h-4 sm:mr-1 text-slate-500 shrink-0" />
                      <span className="hidden sm:inline">Sign In</span>
                    </Button>
                  </Link>
                  <Link href="/register" className="hidden sm:inline-block shrink-0">
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-slate-300 hover:border-amber-500 hover:text-amber-600 font-medium rounded-full px-3.5 text-xs md:text-sm h-8 sm:h-9 cursor-pointer"
                    >
                      <UserPlus className="w-4 h-4 mr-1 shrink-0" />
                      Register
                    </Button>
                  </Link>
                </div>
              )}

              {/* Mobile Drawer Hamburger Trigger */}
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="lg:hidden rounded-full hover:bg-slate-100 text-slate-700 h-8 w-8 sm:h-9 sm:w-9 p-0 shrink-0 cursor-pointer"
                    aria-label="Open navigation menu"
                  >
                    <Menu className="w-5 h-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[360px] max-w-[85vw] p-0 flex flex-col bg-white"
                >
                  {/* Sheet Header */}
                  <SheetHeader className="p-4 border-b border-slate-100 flex flex-row items-center justify-between text-left">
                    <Link
                      href="/"
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center gap-2.5"
                    >
                      <Image
                        src={logo}
                        alt="ReSellBD Logo"
                        width={32}
                        height={32}
                        className="object-contain"
                      />
                      <span className="font-bold text-lg tracking-tight text-slate-900">
                        ReSell<span className="text-amber-500">BD</span>
                      </span>
                    </Link>
                    <SheetTitle className="sr-only">
                      Mobile Navigation Menu
                    </SheetTitle>
                    <SheetDescription className="sr-only">
                      Explore products, categories and manage account
                    </SheetDescription>
                  </SheetHeader>

                  {/* Scrollable Body */}
                  <div className="flex-1 overflow-y-auto px-4 py-4 space-y-5">
                    {/* Search Input in Mobile Drawer */}
                    <form onSubmit={handleSearch} className="relative">
                      <button
                        type="submit"
                        className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-amber-600 cursor-pointer p-0.5"
                        aria-label="Search"
                      >
                        <Search className="w-4 h-4" />
                      </button>
                      <Input
                        type="text"
                        placeholder="Search products..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="pl-9 pr-8 h-9 text-xs rounded-xl bg-slate-50 border-slate-200"
                      />
                      {searchQuery && (
                        <button
                          type="button"
                          onClick={() => setSearchQuery("")}
                          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                          aria-label="Clear search"
                        >
                          <X className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </form>

                    {/* User Status Card */}
                    {user ? (
                      <div className="p-3 bg-gradient-to-r from-amber-50 to-orange-50 rounded-2xl border border-amber-200/60 space-y-2.5">
                        <div className="flex items-center gap-3">
                          <Avatar className="w-10 h-10 border border-amber-400">
                            <AvatarFallback className="bg-amber-500 text-slate-950 font-bold text-sm">
                              {user.identifier
                                ? user.identifier.slice(0, 2).toUpperCase()
                                : "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <p className="text-xs font-semibold text-slate-900 truncate">
                              {user.identifier}
                            </p>
                            <Badge
                              variant={
                                user.role === "admin" ? "default" : "secondary"
                              }
                              className="text-[10px] py-0 px-2 h-4 uppercase mt-0.5"
                            >
                              {user.role === "admin"
                                ? "Admin"
                                : "Verified Member"}
                            </Badge>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 pt-1">
                          <Link
                            href={
                              user.role === "admin"
                                ? "/admin/dashboard"
                                : "/user/dashboard"
                            }
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white text-slate-800 rounded-lg text-xs font-semibold border border-amber-200 shadow-2xs hover:bg-amber-100/50"
                          >
                            <LayoutDashboard className="w-3.5 h-3.5 text-amber-600" />
                            Dashboard
                          </Link>
                          <Link
                            href="/user/dashboard/user-profile"
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center justify-center gap-1.5 py-1.5 px-2 bg-white text-slate-800 rounded-lg text-xs font-semibold border border-amber-200 shadow-2xs hover:bg-amber-100/50"
                          >
                            <User className="w-3.5 h-3.5 text-amber-600" />
                            Profile
                          </Link>
                        </div>
                      </div>
                    ) : (
                      <div className="grid grid-cols-2 gap-2">
                        <Link href="/login" onClick={() => setMobileOpen(false)}>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full rounded-xl text-xs font-semibold border-slate-300"
                          >
                            <LogInIcon className="w-3.5 h-3.5 mr-1" />
                            Sign In
                          </Button>
                        </Link>
                        <Link
                          href="/register"
                          onClick={() => setMobileOpen(false)}
                        >
                          <Button
                            size="sm"
                            className="w-full rounded-xl text-xs font-semibold bg-slate-900 hover:bg-slate-800 text-white"
                          >
                            <UserPlus className="w-3.5 h-3.5 mr-1" />
                            Register
                          </Button>
                        </Link>
                      </div>
                    )}

                    {/* Post Ad Button Mobile */}
                    <Link
                      href={
                        user ? "/user/dashboard/products/add-product" : "/login"
                      }
                      onClick={() => setMobileOpen(false)}
                      className="block"
                    >
                      <Button
                        size="sm"
                        className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-slate-950 font-bold rounded-xl py-2.5 shadow-sm flex items-center justify-center gap-2 cursor-pointer"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Post an Ad (Sell Item)</span>
                      </Button>
                    </Link>

                    {/* Navigation Links */}
                    <div className="space-y-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider px-2 mb-1">
                        Navigation
                      </p>
                      {[
                        { name: "Home", href: "/", icon: HomeIcon },
                        {
                          name: "All Products",
                          href: "/products",
                          icon: ShoppingBag,
                        },
                        {
                          name: "Wishlist",
                          href: "/wishlist",
                          icon: Heart,
                          badge: wishlistCount,
                        },
                        { name: "Blogs & News", href: "/blogs", icon: BookOpen },
                        { name: "About Us", href: "/aboutUs", icon: Building2 },
                        { name: "Contact Us", href: "/contactUs", icon: Mail },
                        { name: "Help & FAQs", href: "/faq", icon: HelpCircle },
                      ].map((item) => {
                        const Icon = item.icon;
                        const isActive = pathname === item.href;
                        return (
                          <Link
                            key={item.name}
                            href={item.href}
                            onClick={() => setMobileOpen(false)}
                            className={cn(
                              "flex items-center justify-between px-3 py-2 rounded-xl text-sm font-medium transition-colors",
                              isActive
                                ? "bg-amber-50 text-amber-700 font-semibold"
                                : "text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <Icon
                                className={cn(
                                  "w-4 h-4",
                                  isActive
                                    ? "text-amber-600"
                                    : "text-slate-500"
                                )}
                              />
                              <span>{item.name}</span>
                            </div>
                            {item.badge !== undefined && item.badge > 0 && (
                              <span className="bg-amber-500 text-slate-950 text-[10px] font-bold px-1.5 py-0.5 rounded-full">
                                {item.badge}
                              </span>
                            )}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Categories Grid on Mobile */}
                    <div className="space-y-2 pt-2 border-t border-slate-100">
                      <div className="flex items-center justify-between px-2">
                        <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                          Categories
                        </p>
                        <Link
                          href="/products"
                          onClick={() => setMobileOpen(false)}
                          className="text-[11px] text-amber-600 font-semibold hover:underline"
                        >
                          All Items
                        </Link>
                      </div>
                      <div className="grid grid-cols-2 gap-2">
                        {CATEGORIES.map((cat) => (
                          <Link
                            key={cat.name}
                            href={`/category/${cat.name}`}
                            onClick={() => setMobileOpen(false)}
                            className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 hover:bg-amber-50 transition-colors border border-slate-100 hover:border-amber-200"
                          >
                            <div className="w-5 h-5 relative shrink-0">
                              <Image
                                src={cat.image}
                                alt={cat.label}
                                fill
                                className="object-contain"
                              />
                            </div>
                            <span className="text-xs font-medium text-slate-800 truncate">
                              {cat.label}
                            </span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Sheet Footer */}
                  <div className="p-4 border-t border-slate-100 bg-slate-50/50 space-y-3">
                    {user && (
                      <Button
                        onClick={() => {
                          setMobileOpen(false);
                          handleLogout();
                        }}
                        variant="outline"
                        size="sm"
                        className="w-full text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 rounded-xl text-xs font-semibold cursor-pointer"
                      >
                        <LogOutIcon className="w-3.5 h-3.5 mr-1.5" />
                        Sign Out
                      </Button>
                    )}
                    <div className="text-[11px] text-slate-500 space-y-1 text-center">
                      <p>Support Hotline: +880 131 577 3424</p>
                      <p>support@resellbd.com • Dhaka, Bangladesh</p>
                    </div>
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </Container>

        {/* Mobile Search Bar Collapsible Panel */}
        {isMobileSearchOpen && (
          <div className="md:hidden px-3 sm:px-4 py-2.5 bg-slate-50 border-t border-slate-200/80 animate-in slide-in-from-top-2 duration-150">
            <form onSubmit={handleSearch} className="relative flex items-center">
              <button
                type="submit"
                className="absolute left-3 text-slate-400 hover:text-amber-600 p-0.5 cursor-pointer"
                aria-label="Submit search"
              >
                <Search className="w-4 h-4" />
              </button>
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                className="w-full h-9 pl-9 pr-9 text-xs bg-white rounded-full border border-slate-200 focus:border-amber-500 shadow-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="absolute right-3 text-slate-400 hover:text-slate-600 cursor-pointer"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </form>
          </div>
        )}
      </header>
    </>
  );
}
