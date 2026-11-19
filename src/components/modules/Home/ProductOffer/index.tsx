"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";
import productOfferBg from "@/assets/product-offer.jpg";
import { Check, ShoppingBag, ArrowRight, Tag } from "lucide-react";

export default function ProductOffer() {
  const quickDeals = [
    { label: "Mobiles & Tech", discount: "Up to 35% OFF", href: "/category/mobile" },
    { label: "Electronics", discount: "Save up to 40%", href: "/category/electronics" },
    { label: "Vehicles", discount: "Verified Deals", href: "/category/vehicles" },
    { label: "Home & Living", discount: "Save up to 30%", href: "/category/home" },
  ];

  // Mathematical SVG wave path (ঢেউ ঢেউ scallop curve)
  const wavePath =
    "M 0,0 L 1200,0 L 1200,3 Q 1188,14 1176,3 Q 1164,14 1152,3 Q 1140,14 1128,3 Q 1116,14 1104,3 Q 1092,14 1080,3 Q 1068,14 1056,3 Q 1044,14 1032,3 Q 1020,14 1008,3 Q 996,14 984,3 Q 972,14 960,3 Q 948,14 936,3 Q 924,14 912,3 Q 900,14 888,3 Q 876,14 864,3 Q 852,14 840,3 Q 828,14 816,3 Q 804,14 792,3 Q 780,14 768,3 Q 756,14 744,3 Q 732,14 720,3 Q 708,14 696,3 Q 684,14 672,3 Q 660,14 648,3 Q 636,14 624,3 Q 612,14 600,3 Q 588,14 576,3 Q 564,14 552,3 Q 540,14 528,3 Q 516,14 504,3 Q 492,14 480,3 Q 468,14 456,3 Q 444,14 432,3 Q 420,14 408,3 Q 396,14 384,3 Q 372,14 360,3 Q 348,14 336,3 Q 324,14 312,3 Q 300,14 288,3 Q 276,14 264,3 Q 252,14 240,3 Q 228,14 216,3 Q 204,14 192,3 Q 180,14 168,3 Q 156,14 144,3 Q 132,14 120,3 Q 108,14 96,3 Q 84,14 72,3 Q 60,14 48,3 Q 36,14 24,3 Q 12,14 0,3 Z";

  return (
    <section className="my-12 sm:my-16 lg:my-20">
      <Container>
        {/* Unique Voucher Card with Scalloped Wavy Edge & Ticket Cutouts */}
        <div className="relative overflow-hidden rounded-3xl bg-[#FFFDF8] border-2 border-amber-200/90 shadow-md">
          {/* Top Scalloped Wavy Header (ঢেউ ঢেউ কাটা Ribbon) */}
          <div className="w-full bg-[#F59E0B] text-white py-1.5 px-4 text-center">

          </div>

          {/* Top Wave Cutout Transition (ঢেউ ঢেউ) */}
          <div className="w-full h-3 sm:h-3.5 overflow-hidden leading-none -mt-px select-none">
            <svg
              viewBox="0 0 1200 14"
              className="w-full h-full text-[#F59E0B] fill-current"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d={wavePath} />
            </svg>
          </div>

          {/* Ticket Punch Cutout Notches on Left & Right Borders (করাত/খাঁজ কাটা Notches) */}
          <div
            className="hidden md:block absolute -left-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-amber-200/90 shadow-inner z-20 pointer-events-none"
            aria-hidden="true"
          />
          <div
            className="hidden md:block absolute -right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-white border-2 border-amber-200/90 shadow-inner z-20 pointer-events-none"
            aria-hidden="true"
          />

          {/* Inner Content Grid */}
          <div className="relative z-10 p-6 sm:p-10 lg:p-12">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* Left Column: Headline, Bullets, Category Grid & Action Buttons */}
              <div className="lg:col-span-7 space-y-5 text-left">
                {/* Main Headline */}
                <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.5rem] font-bold text-[#1F2937] tracking-tight leading-tight">
                  Save Big on Top-Rated <br className="hidden sm:inline" />
                  <span className="text-[#F59E0B]">Pre-Loved Products</span>
                </h2>

                {/* Subtitle */}
                <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-xl">
                  Upgrade your lifestyle without paying full retail price. Explore
                  thoroughly checked gadgets, vehicles, home essentials, and fashion
                  from trusted sellers across Bangladesh.
                </p>

                {/* Bullet Features (Matching Hero & About Us clean checkmark style) */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-1">
                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#F59E0B] stroke-[3]" />
                    </div>
                    <span>Up to 40% Savings</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#F59E0B] stroke-[3]" />
                    </div>
                    <span>Verified Listings</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs sm:text-sm font-medium text-slate-700">
                    <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                      <Check className="w-3.5 h-3.5 text-[#F59E0B] stroke-[3]" />
                    </div>
                    <span>All 64 Districts</span>
                  </div>
                </div>

                {/* Popular Deal Categories (Structured rectangular mini-cards, non-badge design) */}
                <div className="pt-2 space-y-2.5">
                  <div className="flex items-center gap-2">
                    <Tag className="w-3.5 h-3.5 text-[#F59E0B]" />
                    <span className="text-xs font-bold text-slate-600 uppercase tracking-wider block">
                      Popular Deal Categories:
                    </span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                    {quickDeals.map((deal) => (
                      <Link
                        key={deal.label}
                        href={deal.href}
                        className="p-3 rounded-xl bg-white hover:bg-amber-50/50 border border-slate-200 hover:border-[#F59E0B] transition-all group block shadow-2xs"
                      >
                        <div className="text-xs font-semibold text-slate-800 group-hover:text-[#F59E0B] transition-colors truncate">
                          {deal.label}
                        </div>
                        <div className="text-[11px] font-bold text-[#F59E0B] mt-0.5">
                          {deal.discount}
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 pt-3">
                  <Link href="/products">
                    <Button className="w-full sm:w-auto bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold text-sm sm:text-base px-7 py-3.5 h-auto rounded-xl shadow-sm transition-all duration-200 cursor-pointer flex items-center justify-center gap-2 group">
                      <ShoppingBag className="w-4 h-4 group-hover:scale-110 transition-transform duration-200" />
                      <span>Shop Special Deals</span>
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-200" />
                    </Button>
                  </Link>

                  <Link href="/user/dashboard/products/add-product">
                    <Button
                      variant="outline"
                      className="w-full sm:w-auto bg-white hover:bg-slate-100 text-[#1F2937] border border-slate-300 font-semibold text-sm sm:text-base px-6 py-3.5 h-auto rounded-xl transition-all duration-200 cursor-pointer"
                    >
                      Sell Your Pre-Loved Item
                    </Button>
                  </Link>
                </div>
              </div>

              {/* Right Column: Clean Framed Image with Ticket Notch Accent */}
              <div className="lg:col-span-5 relative w-full max-w-md mx-auto lg:max-w-none">
                <div className="relative w-full h-[280px] sm:h-[340px] lg:h-[380px] rounded-2xl overflow-hidden border-2 border-amber-200/90 shadow-md bg-white">
                  <Image
                    src={productOfferBg}
                    alt="ReSellBD Special Product Deals & Offers"
                    fill
                    priority
                    className="object-cover object-center"
                    sizes="(max-width: 768px) 100vw, 500px"
                  />
                  {/* Subtle Stamp Cut Corner Tag */}
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-xs border border-amber-200 text-[#F59E0B] font-extrabold text-[11px] px-3 py-1 rounded-lg shadow-sm">
                    EXCLUSIVE DEALS
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Bottom Wave Cutout Transition (ঢেউ ঢেউ - Inverted) */}
          <div className="w-full h-3 sm:h-3.5 overflow-hidden leading-none -mb-px rotate-180 select-none">
            <svg
              viewBox="0 0 1200 14"
              className="w-full h-full text-[#F59E0B] fill-current"
              preserveAspectRatio="none"
              aria-hidden="true"
            >
              <path d={wavePath} />
            </svg>
          </div>

          {/* Bottom Solid Amber Accent Border Strip */}
          <div className="w-full h-1.5 bg-[#F59E0B]" />
        </div>
      </Container>
    </section>
  );
}
