"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Heart, MapPin, Tag, ShieldCheck, ArrowRight } from "lucide-react";
import { FaHeart } from "react-icons/fa6";
import { Button } from "../button";
import { TProduct } from "@/types";
import { RootState } from "@/redux/store";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/features/wishlist/wishlistSlice";
import { toast } from "sonner";
import { useState } from "react";

interface ProductCardProps {
  product: TProduct;
  viewMode?: "grid" | "list";
}

export default function ProductCard({
  product,
  viewMode = "grid",
}: ProductCardProps) {
  const router = useRouter();
  const dispatch = useDispatch();
  const [imageError, setImageError] = useState(false);

  const {
    _id,
    title,
    category,
    images,
    price,
    status,
    description,
    condition,
    brand,
    location,
    negotiable,
    warranty,
    createdAt,
  } = product || {};

  const user = useSelector((state: RootState) => state.auth?.user);
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);
  const isInWishlist = wishlistItems.some((item) => item._id === _id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      dispatch(removeFromWishlist(_id));
      toast.info(`Removed "${title || "Product"}" from wishlist`);
    } else {
      dispatch(addToWishlist(product));
      toast.success(`Added "${title || "Product"}" to wishlist`);
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (status === "sold") return;
    if (!user) {
      router.push(`/login?redirectPath=/products/${_id}`);
      return;
    }
    router.push(`/checkout?id=${_id}`);
  };

  const fallbackImage =
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop";
  const productImage =
    !imageError && images?.[0] ? images[0] : fallbackImage;

  // Render exact condition from backend data
  const renderConditionBadge = () => {
    if (!condition) return null;

    return (
      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold border tracking-wide bg-amber-50 text-amber-800 border-amber-200/80">
        {condition}
      </span>
    );
  };

  // Capitalize Location
  const formattedLocation = location
    ? location.charAt(0).toUpperCase() + location.slice(1).toLowerCase()
    : "Bangladesh";

  // Formatted Date
  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  /* ============================================================
     LIST VIEW LAYOUT
     ============================================================ */
  if (viewMode === "list") {
    return (
      <div className="group relative w-full bg-white rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md transition-all duration-300 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 items-stretch">
        {/* Left: Product Image */}
        <div className="relative w-full sm:w-60 h-48 sm:h-auto rounded-xl overflow-hidden bg-slate-100 shrink-0">
          <Link
            href={`/products/${_id}`}
            className="block w-full h-full relative cursor-pointer"
          >
            <Image
              src={productImage}
              alt={title || "Product image"}
              fill
              onError={() => setImageError(true)}
              className="object-cover transition-transform duration-500 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 240px"
            />
          </Link>

          {/* Sold Badge */}
          {status === "sold" && (
            <div className="absolute top-2.5 left-2.5 z-20 bg-rose-600 text-white text-[10px] font-bold px-2.5 py-1 rounded-md uppercase tracking-wider shadow-sm">
              Sold Out
            </div>
          )}

          {/* Wishlist Button */}
          <button
            onClick={handleToggleWishlist}
            aria-label="Toggle Wishlist"
            className="absolute top-2.5 right-2.5 z-20 w-8 h-8 rounded-full flex items-center justify-center bg-white/90 hover:bg-white backdrop-blur-md border border-white/60 text-slate-700 hover:text-rose-500 transition-all duration-200 active:scale-90 cursor-pointer shadow-xs"
          >
            {isInWishlist ? (
              <FaHeart className="w-4 h-4 text-rose-500 drop-shadow-xs" />
            ) : (
              <Heart className="w-4 h-4 text-slate-600 hover:text-rose-500 stroke-[2]" />
            )}
          </button>
        </div>

        {/* Center: Details */}
        <div className="flex-1 flex flex-col justify-between min-w-0">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              {renderConditionBadge()}
              {category && (
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded capitalize">
                  {category}
                </span>
              )}
              {brand && (
                <span className="text-[11px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded">
                  {brand}
                </span>
              )}
              {negotiable === "yes" && (
                <span className="inline-flex items-center gap-1 text-[11px] font-medium text-emerald-700 bg-emerald-50 border border-emerald-200/60 px-2 py-0.5 rounded">
                  <Tag className="w-3 h-3" /> Negotiable
                </span>
              )}
            </div>

            <Link href={`/products/${_id}`} className="block group-hover:text-amber-600">
              <h3 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight transition-colors line-clamp-1">
                {title}
              </h3>
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 mt-1.5 line-clamp-2 leading-relaxed">
              {description || "Authentic pre-loved product in verified condition."}
            </p>

            {/* Meta info */}
            <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500 mt-3 pt-3 border-t border-slate-100">
              <span className="inline-flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-amber-500" />
                {formattedLocation}
              </span>
              {warranty && (
                <span className="inline-flex items-center gap-1.5 text-slate-600">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                  {warranty}
                </span>
              )}
              {formattedDate && (
                <span className="text-slate-400">Listed {formattedDate}</span>
              )}
            </div>
          </div>

          {/* Right Bottom: Price & Button */}
          <div className="flex items-center justify-between sm:justify-end gap-4 mt-4 pt-3 sm:pt-0 sm:mt-2">
            <div className="sm:text-right">
              <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                Price
              </span>
              <span className="text-lg sm:text-xl font-extrabold text-amber-600">
                BDT {price?.toLocaleString()}
              </span>
            </div>

            <Button
              onClick={handleBuyNow}
              disabled={status === "sold"}
              className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs sm:text-sm px-5 py-2.5 h-9 sm:h-10 rounded-xl transition-all shadow-xs hover:shadow-md cursor-pointer disabled:opacity-50"
            >
              {status === "sold" ? "Sold Out" : "Buy Now"}
            </Button>
          </div>
        </div>
      </div>
    );
  }

  /* ============================================================
     GRID VIEW LAYOUT (Default)
     ============================================================ */
  return (
    <div className="group relative w-full rounded-2xl overflow-hidden bg-white shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between border border-slate-200/80 hover:-translate-y-1">
      {/* Top Image Section */}
      <div className="relative w-full h-56 sm:h-60 bg-slate-100 overflow-hidden">
        {/* Top Badges */}
        <div className="absolute top-3 left-3 z-20 flex flex-col gap-1.5">
          {status === "sold" && (
            <span className="bg-rose-600 text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              Sold Out
            </span>
          )}
          {renderConditionBadge()}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Wishlist"
          className="absolute top-3 right-3 z-20 w-9 h-9 rounded-full flex items-center justify-center bg-white/90 hover:bg-white backdrop-blur-md border border-white/60 text-slate-700 hover:text-rose-500 transition-all duration-200 active:scale-90 cursor-pointer shadow-xs"
        >
          {isInWishlist ? (
            <FaHeart className="w-4 h-4 text-rose-500 drop-shadow-xs" />
          ) : (
            <Heart className="w-4 h-4 text-slate-600 hover:text-rose-500 stroke-[2] transition-colors" />
          )}
        </button>

        {/* Negotiable pill */}
        {negotiable === "yes" && (
          <span className="absolute bottom-3 left-3 z-20 inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-white/95 backdrop-blur-sm px-2 py-0.5 rounded-md shadow-xs border border-emerald-200/60">
            <Tag className="w-2.5 h-2.5 text-emerald-600" />
            Negotiable
          </span>
        )}

        {/* Product Image */}
        <Link
          href={`/products/${_id}`}
          className="relative w-full h-full block cursor-pointer"
        >
          <Image
            src={productImage}
            alt={title || "Product image"}
            fill
            onError={() => setImageError(true)}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      </div>

      {/* Card Content Area */}
      <div className="p-4 sm:p-5 flex flex-col justify-between flex-grow">
        <div>
          {/* Category & Brand row */}
          <div className="flex items-center justify-between gap-2 mb-1.5 text-xs">
            <span className="text-[11px] font-semibold text-amber-700 uppercase tracking-wider">
              {category || "General"}
            </span>
            {brand && (
              <span className="text-[11px] font-medium text-slate-400 capitalize">
                {brand}
              </span>
            )}
          </div>

          {/* Product Title */}
          <Link href={`/products/${_id}`} className="block">
            <h3 className="text-base font-bold text-slate-900 tracking-tight group-hover:text-amber-600 transition-colors capitalize line-clamp-1">
              {title}
            </h3>
          </Link>

          {/* Location & Time */}
          <div className="flex items-center gap-2 text-xs text-slate-500 mt-2">
            <span className="inline-flex items-center gap-1 text-slate-600 font-medium">
              <MapPin className="w-3.5 h-3.5 text-amber-500 shrink-0" />
              {formattedLocation}
            </span>
            {formattedDate && (
              <>
                <span className="text-slate-300">•</span>
                <span className="text-slate-400">{formattedDate}</span>
              </>
            )}
          </div>

          {/* Description */}
          <p className="text-xs text-slate-500 leading-relaxed mt-2.5 line-clamp-2 min-h-[2rem]">
            {description || "Authentic pre-owned product in verified condition."}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-100">
          <div>
            <span className="block text-[10px] font-bold text-slate-400 uppercase tracking-wider">
              Price
            </span>
            <span className="text-lg sm:text-xl font-extrabold text-amber-600 tracking-tight">
              BDT {price?.toLocaleString()}
            </span>
          </div>

          <Button
            onClick={handleBuyNow}
            disabled={status === "sold"}
            size="sm"
            className="bg-amber-500 hover:bg-amber-600 text-white font-semibold text-xs px-4 h-9 rounded-xl transition-all duration-200 cursor-pointer shadow-xs hover:shadow-md active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-1"
          >
            {status === "sold" ? (
              "Sold Out"
            ) : (
              <>
                <span>Buy Now</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
}
