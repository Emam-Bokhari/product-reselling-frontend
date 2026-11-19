"use client";

import Image from "next/image";
import Link from "next/link";
import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";

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
    <section className="mt-8 sm:mt-10">
      <Container>
        <div className="mb-4">
          <SectionTitle title="Shop by Category" />
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
