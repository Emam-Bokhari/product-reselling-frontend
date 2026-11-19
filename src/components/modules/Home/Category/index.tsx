"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";
import { ArrowRight, Sparkles } from "lucide-react";

// Assets
import property from "@/assets/property.png";
import home from "@/assets/home.png";
import vehicles from "@/assets/car.png";
import electronics from "@/assets/electronics.png";
import mobile from "@/assets/mobile.png";
import pets from "@/assets/pets.png";
import sports from "@/assets/sports.png";
import clothes from "@/assets/clothes.png";

// Category data with labels matching the app taxonomy
const categories = [
  { name: "property", label: "Property", image: property },
  { name: "home", label: "Home & Living", image: home },
  { name: "vehicles", label: "Vehicles", image: vehicles },
  { name: "electronics", label: "Electronics", image: electronics },
  { name: "mobile", label: "Mobiles", image: mobile },
  { name: "pets", label: "Pets & Animals", image: pets },
  { name: "sports", label: "Sports & Hobbies", image: sports },
  { name: "clothes", label: "Fashion & Cloths", image: clothes },
];

export default function CategorySection() {
  return (
    <section className="mt-10 sm:mt-14">
      <Container>
        {/* Professional Header matching site theme & card grid */}
        <div className="max-w-6xl mx-auto mb-5 sm:mb-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
            <div>
              {/* Brand Accent Pill */}
            

              {/* Section Headline */}
              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#1F2937] dark:text-white tracking-tight leading-tight">
                Shop by <span className="text-[#F59E0B]">Category</span>
              </h2>

              {/* Marketplace Subtitle */}
              <p className="text-xs sm:text-sm text-slate-500 dark:text-neutral-400 mt-1">
                Explore verified pre-loved products by department across Bangladesh
              </p>
            </div>

            {/* Quick Action Link */}
            <Link
              href="/products"
              className="group inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-slate-600 dark:text-neutral-300 hover:text-[#F59E0B] dark:hover:text-[#F59E0B] transition-colors self-start sm:self-end shrink-0 pb-0.5"
            >
              <span>View All Products</span>
              <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1 text-[#F59E0B]" />
            </Link>
          </div>
        </div>

        {/* Categories Card Grid - Compact bordered grid matching reference screenshot */}
        <div className="max-w-6xl mx-auto rounded-xl border border-slate-200 dark:border-neutral-800 bg-slate-200 dark:bg-neutral-800 overflow-hidden shadow-xs">
          <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-px">
            {categories.map((category) => (
              <Link
                key={category.name}
                href={`/category/${category.name}`}
                className="group relative flex flex-col items-center justify-center py-3 sm:py-3.5 px-2 min-h-[82px] sm:min-h-[88px] text-center bg-white dark:bg-neutral-900 hover:bg-slate-50 dark:hover:bg-neutral-850 transition-all duration-150 cursor-pointer select-none"
              >
                {/* Small compact icon centered on top */}
                <div className="relative w-7 h-7 sm:w-8 sm:h-8 mb-1.5 flex items-center justify-center">
                  <Image
                    src={category.image}
                    alt={category.label}
                    fill
                    className="object-contain transition-transform duration-200 group-hover:scale-110"
                    sizes="32px"
                  />
                </div>

                {/* Small compact label centered on bottom */}
                <span className="text-[11px] sm:text-xs font-medium text-slate-700 dark:text-neutral-300 group-hover:text-[#F59E0B] transition-colors leading-tight">
                  {category.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
