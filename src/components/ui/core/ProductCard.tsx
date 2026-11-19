"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { Heart } from "lucide-react";
import { FaHeart } from "react-icons/fa6";
import { Button } from "../button";
import { TProduct } from "@/types";
import { RootState } from "@/redux/store";
import {
  addToWishlist,
  removeFromWishlist,
} from "@/redux/features/wishlist/wishlistSlice";

export default function ProductCard({ product }: { product: TProduct }) {
  const router = useRouter();
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
  } = product || {};

  const dispatch = useDispatch();
  const wishlistItems = useSelector((state: RootState) => state.wishlist.items);

  const isInWishlist = wishlistItems.some((item) => item._id === _id);

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (isInWishlist) {
      dispatch(removeFromWishlist(_id));
    } else {
      dispatch(addToWishlist(product));
    }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    router.push(`/checkout?id=${_id}`);
  };

  const productImage =
    images?.[0] ||
    "https://images.unsplash.com/photo-1542291026-7eec264c27ff?q=80&w=600&auto=format&fit=crop";

  return (
    <div className="group relative w-full rounded-[24px] overflow-hidden bg-white shadow-md hover:shadow-xl hover:border-amber-200 transition-all duration-300 flex flex-col justify-between border border-slate-100">
      {/* Top Section with Image */}
      <div className="relative w-full h-64 sm:h-72 bg-gray-100 overflow-hidden">
        {/* Sold Badge */}
        {status === "sold" && (
          <span className="absolute top-4 left-4 z-20 bg-rose-500/90 backdrop-blur-sm text-white text-[11px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-md">
            Sold
          </span>
        )}

        {/* Wishlist Button */}
        <button
          onClick={handleToggleWishlist}
          aria-label="Wishlist"
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center bg-white/80 hover:bg-white backdrop-blur-md border border-white/60 text-slate-700 hover:text-rose-500 transition-all duration-200 active:scale-90 cursor-pointer shadow-md"
        >
          {isInWishlist ? (
            <FaHeart className="w-5 h-5 text-rose-500 drop-shadow" />
          ) : (
            <Heart className="w-5 h-5 text-slate-700 hover:text-rose-500 stroke-[2] transition-colors" />
          )}
        </button>

        {/* Product Image */}
        <Link
          href={`/products/${_id}`}
          className="relative w-full h-full block cursor-pointer"
        >
          <Image
            src={productImage}
            alt={title || "Product image"}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </Link>
      </div>

      {/* Bottom Content Area */}
      <div className="relative -mt-6 z-10 bg-white rounded-t-[24px] p-6 flex flex-col justify-between flex-grow">
        <div>
          {/* Title */}
          <Link href={`/products/${_id}`} className="block">
            <h3 className="text-xl font-bold text-[#1F2937] tracking-tight hover:text-[#F59E0B] transition-colors capitalize line-clamp-1">
              {title}
            </h3>
          </Link>

          {/* Badges / Tags */}
          <div className="flex flex-wrap items-center gap-2 mt-2.5">
            {condition && (
              <span className="px-2.5 py-0.5 text-[11px] font-semibold text-amber-700 bg-amber-50 border border-amber-200 rounded uppercase tracking-wider">
                {condition === "likeNew" ? "Like New" : condition}
              </span>
            )}
            <span className="px-2.5 py-0.5 text-[11px] font-semibold text-slate-600 bg-slate-50 border border-slate-200 rounded uppercase tracking-wider">
              {brand || category || "Authentic"}
            </span>
          </div>

          {/* Description */}
          <p className="text-xs sm:text-[13px] text-slate-500 leading-relaxed mt-3.5 line-clamp-3 min-h-[3.6rem]">
            {description ||
              "Crossing hardwood comfort with off-court flair. '80s-inspired construction, bold details and nothin'-but-net style."}
          </p>
        </div>

        {/* Price & Action Button */}
        <div className="flex items-end justify-between mt-6 pt-1">
          <div>
            <span className="block text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-0.5">
              PRICE
            </span>
            <span className="text-xl sm:text-2xl font-extrabold text-[#F59E0B] tracking-tight">
              BDT {price?.toLocaleString()}
            </span>
          </div>

          <Button
            onClick={handleBuyNow}
            disabled={status === "sold"}
            className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-semibold text-sm px-6 py-2.5 h-auto rounded-lg transition-all duration-200 cursor-pointer shadow-md shadow-amber-500/20 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {status === "sold" ? "Sold Out" : "Add to cart"}
          </Button>
        </div>
      </div>
    </div>
  );
}
