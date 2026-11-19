"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

// assets
import manWorkingImage from "@/assets/man-working.jpg";
import packagingBoxImage from "@/assets/packaging-box.jpg";

// icons
import {
  Check,
  Coins,
  MessageCircle,
  Percent,
  PlusCircle,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

export default function AboutUsSection() {
  const serviceCards = [
    {
      title: "Lower Price",
      description: "Save up to 70% on pre-loved authentic items.",
      icon: <Percent className="w-6 h-6 text-[#F59E0B]" />,
    },
    {
      title: "Verified Sellers",
      description: "Identity verified members ensure reliable deals.",
      icon: <ShieldCheck className="w-6 h-6 text-[#F59E0B]" />,
    },
    {
      title: "Instant Listing",
      description: "Post your ad in under 2 minutes completely free.",
      icon: <PlusCircle className="w-6 h-6 text-[#F59E0B]" />,
    },
    {
      title: "Direct Chat",
      description: "Negotiate and connect directly with local buyers.",
      icon: <MessageCircle className="w-6 h-6 text-[#F59E0B]" />,
    },
    {
      title: "Product Variety",
      description: "Thousands of items across tech, bikes & fashion.",
      icon: <ShoppingBag className="w-6 h-6 text-[#F59E0B]" />,
    },
    {
      title: "Zero Commission",
      description: "Keep 100% of your earnings with zero fee cuts.",
      icon: <Coins className="w-6 h-6 text-[#F59E0B]" />,
    },
  ];

  return (
    <div className="w-full bg-white py-14 sm:py-16 lg:py-20">
      <Container>
        {/* Section 1: About Split (Matching Screenshot 2) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          {/* Left Column: Image Composition with Orange Accents */}
          <div className="lg:col-span-6 relative flex justify-center lg:justify-start">
            <div className="relative w-full max-w-[460px]">
              {/* Orange Geometric Pill Accent Behind Image */}
              <div className="absolute -top-3 right-8 w-16 h-36 bg-[#F59E0B] rounded-2xl -z-10" />

              {/* Dotted Grid Pattern Accent */}
              <div className="absolute -bottom-6 -left-6 grid grid-cols-5 gap-2 -z-10">
                {Array.from({ length: 25 }).map((_, i) => (
                  <span
                    key={i}
                    className="w-2 h-2 rounded-full bg-amber-400/80"
                  />
                ))}
              </div>

              {/* Main Image (Man Working) */}
              <div className="relative w-[85%] h-[280px] sm:h-[340px] rounded-3xl overflow-hidden shadow-lg border-2 border-white">
                <Image
                  src={manWorkingImage}
                  alt="ReSellBD Marketplace Operations"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Secondary Overlapping Image (Packaging Box) */}
              <div className="absolute -bottom-4 right-0 w-[55%] h-[180px] sm:h-[220px] rounded-3xl overflow-hidden border-4 border-white shadow-2xl">
                <Image
                  src={packagingBoxImage}
                  alt="Verified Packaging & Products"
                  fill
                  className="object-cover"
                />
              </div>
            </div>
          </div>

          {/* Right Column: Content, 2-Col Bullets & CTA */}
          <div className="lg:col-span-6 space-y-4 text-left">
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider block">
              ZERO PLATFORM COMMISSIONS
            </span>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-[#1F2937] leading-[1.25]">
              No Setup Fee, No Monthly Fee, No Storage Fee, And No Middleman Cuts
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed pt-1">
              Turn your old or unused products into cash quickly, or find great
              deals on high-quality second-hand items. ReSellBD connects
              genuine buyers and sellers across Bangladesh with zero hidden fees
              and complete transparency.
            </p>

            {/* 2-Column Checkmark Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5 pt-3 text-xs sm:text-sm font-semibold text-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#F59E0B] stroke-[3]" />
                </div>
                <span>Verified Community Sellers</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#F59E0B] stroke-[3]" />
                </div>
                <span>Up to 70% Off Retail Rates</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#F59E0B] stroke-[3]" />
                </div>
                <span>100% Free Ad Posting</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#F59E0B] stroke-[3]" />
                </div>
                <span>All 64 Districts Covered</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#F59E0B] stroke-[3]" />
                </div>
                <span>Direct In-App Buyer Chat</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-amber-100 flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-[#F59E0B] stroke-[3]" />
                </div>
                <span>Safe Local Exchanges</span>
              </div>
            </div>

            {/* Read More / Browse CTA */}
            <div className="pt-4">
              <Link href="/products">
                <Button className="bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold px-7 py-3 rounded-lg shadow-sm text-sm cursor-pointer transition-all">
                  Read More
                </Button>
              </Link>
            </div>
          </div>
        </div>

        {/* Section 2: Services / Expectations (Matching Screenshot 3) */}
        <div className="mt-20 sm:mt-24 pt-12 border-t border-slate-100">
          {/* Header */}
          <div className="text-center max-w-2xl mx-auto space-y-2 mb-10">
            <span className="text-xs font-bold text-[#F59E0B] uppercase tracking-wider block">
              WE SOURCE FOR YOU
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937]">
              Our Service Exceeds Your Expectations
            </h2>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Experience a transparent, seamless second-hand marketplace
              engineered for smart buyers and sellers across Bangladesh.
            </p>
          </div>

          {/* 6-Column Feature Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {serviceCards.map((card, idx) => (
              <div
                key={idx}
                className="bg-white rounded-2xl p-4 sm:p-5 text-center border border-slate-100 shadow-2xs hover:shadow-md transition-all group"
              >
                <div className="w-14 h-14 rounded-full bg-amber-50 border border-amber-100 flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform">
                  {card.icon}
                </div>
                <h4 className="text-xs sm:text-sm font-bold text-slate-900 mb-1">
                  {card.title}
                </h4>
                <p className="text-[11px] text-slate-500 leading-snug line-clamp-2">
                  {card.description}
                </p>
              </div>
            ))}
          </div>

          {/* 3-Item Stats Bar (Matching Screenshot 3) */}
          <div className="mt-12 pt-8 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="flex items-start gap-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 shrink-0">
                99.9%
              </span>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug pt-1">
                Final customers have a safe, trusted, and verified purchasing
                experience.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 shrink-0">
                75K+
              </span>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug pt-1">
                Pre-loved items listed at fair prices without the cost of
                middlemen.
              </p>
            </div>

            <div className="flex items-start gap-4">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 shrink-0">
                100+
              </span>
              <p className="text-xs sm:text-sm text-slate-600 leading-snug pt-1">
                We offer a large variety of verified products across 64
                districts.
              </p>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
