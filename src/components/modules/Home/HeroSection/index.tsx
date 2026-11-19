"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Container from "@/components/shared/Container";
import { Button } from "@/components/ui/button";

// Assets
import heroWarehouseBg from "@/assets/hero-warehouse-boxes.jpg";
import consultantAvatar from "@/assets/consultant-avatar.jpg";

// Icons
import { Check, Phone, Search } from "lucide-react";

export default function HeroSection() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [category, setCategory] = useState("all");
  const [location, setLocation] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    } else if (category !== "all") {
      router.push(`/category/${category}`);
    } else {
      router.push("/products");
    }
  };

  return (
    <section className="relative w-full overflow-hidden text-white">
      {/* Background Image with Dark Overlay */}
      <div className="absolute inset-0 -z-10">
        <Image
          src={heroWarehouseBg}
          alt="ReSellBD Marketplace Warehouse"
          fill
          priority
          className="object-cover"
        />
        {/* Dark overlay for high contrast and readability */}
        <div className="absolute inset-0 bg-slate-950/65 backdrop-blur-[0.5px]" />
      </div>

      {/* Main Hero Container */}
      <Container className="relative z-10 pt-12 sm:pt-16 lg:pt-20 pb-20 sm:pb-24 lg:pb-28">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Left Column: Headline, Subtitle, Checkmarks */}
          <div className="lg:col-span-7 space-y-5 text-left">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.16]">
              We Are An All-In-One Second-Hand Solution Provider
            </h1>

            <p className="text-sm sm:text-base lg:text-lg text-slate-200 max-w-xl leading-relaxed">
              Introducing our hassle-free reselling marketplace, revolutionizing
              the way you buy and sell pre-loved goods across Bangladesh with
              zero listing fees.
            </p>

            {/* Checkmark Bullets */}
            <div className="pt-2 flex flex-wrap items-center gap-x-6 gap-y-2 text-xs sm:text-sm font-semibold text-white">
              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                </div>
                <span>7/24 Customer Support</span>
              </div>

              <div className="flex items-center gap-2">
                <div className="w-5 h-5 rounded-full bg-[#F59E0B] flex items-center justify-center shrink-0">
                  <Check className="w-3.5 h-3.5 text-slate-950 stroke-[3]" />
                </div>
                <span>Verified Community Listings</span>
              </div>
            </div>
          </div>

          {/* Right Column: Floating White Form Card */}
          <div className="lg:col-span-5 flex justify-center lg:justify-end">
            <div className="w-full max-w-[390px] bg-white rounded-2xl shadow-2xl p-6 sm:p-7 border border-slate-100 text-center relative z-20">
              {/* Consultant Avatar */}
              <div className="relative w-16 h-16 mx-auto rounded-full overflow-hidden border-2 border-white shadow-md">
                <Image
                  src={consultantAvatar}
                  alt="Marketplace Consultant"
                  fill
                  className="object-cover"
                />
              </div>

              {/* Consultant Details */}
              <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-2.5">
                Tanvir Ahmed
              </h3>
              <p className="text-xs text-slate-400 font-medium">
                Expert Marketplace Consultant
              </p>

              {/* Phone Hotline Link */}
              <a
                href="tel:+8801315773424"
                className="inline-flex items-center justify-center gap-1.5 text-xs sm:text-sm font-bold text-[#F59E0B] hover:text-[#D97706] mt-1 transition-colors"
              >
                <Phone className="w-3.5 h-3.5 fill-[#F59E0B]" />
                <span>+880 131 577 3424</span>
              </a>

              {/* Inquiry / Search Form */}
              <form onSubmit={handleSubmit} className="mt-5 space-y-3">
                <div>
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Your Item Name (e.g. iPhone, Bike)"
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#F59E0B] bg-slate-50/60 transition-all"
                  />
                </div>

                <div>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="w-full h-10 px-3 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-700 focus:outline-hidden focus:border-[#F59E0B] bg-slate-50/60 cursor-pointer transition-all"
                  >
                    <option value="all">All Categories</option>
                    <option value="mobile">Mobiles</option>
                    <option value="electronics">Electronics</option>
                    <option value="vehicles">Vehicles</option>
                    <option value="clothes">Fashion &amp; Cloths</option>
                    <option value="home">Home &amp; Living</option>
                    <option value="sports">Sports &amp; Hobbies</option>
                    <option value="property">Property</option>
                    <option value="pets">Pets &amp; Animals</option>
                  </select>
                </div>

                <div>
                  <input
                    type="text"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Your Location (e.g. Dhaka)"
                    className="w-full h-10 px-3.5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-hidden focus:border-[#F59E0B] bg-slate-50/60 transition-all"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-11 bg-[#F59E0B] hover:bg-[#D97706] text-white font-bold rounded-lg text-sm shadow-md shadow-amber-500/20 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                >
                  <Search className="w-4 h-4" />
                  <span>Find Deals Now</span>
                </Button>
              </form>
            </div>
          </div>
        </div>
      </Container>

      {/* Gentle Bottom Diagonal / Angled Cut transition into the next section */}
      <div className="absolute bottom-0 left-0 right-0 overflow-hidden leading-none z-10 pointer-events-none">
        <svg
          viewBox="0 0 1440 48"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="relative block w-full h-8 sm:h-12"
          preserveAspectRatio="none"
        >
          <path d="M0 48L1440 0V48H0Z" fill="#ffffff" />
        </svg>
      </div>
    </section>
  );
}
