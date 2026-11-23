export const dynamic = "force-dynamic";

import Container from "@/components/shared/Container";
import ProductCardVariant from "@/components/ui/core/ProductCardVariant";
import { getProductsByCategory } from "@/services/Product";
import { TProduct } from "@/types";
import Link from "next/link";
import { ArrowLeft, PackageOpen } from "lucide-react";

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const decodedCategory = decodeURIComponent(category || "");
  const res = await getProductsByCategory(decodedCategory);
  const products: TProduct[] = Array.isArray(res?.data) ? res.data : [];

  const displayTitle =
    decodedCategory.charAt(0).toUpperCase() + decodedCategory.slice(1);

  if (products.length === 0) {
    return (
      <Container className="py-16">
        <div className="max-w-md mx-auto text-center space-y-4">
          <div className="w-16 h-16 bg-amber-50 rounded-2xl flex items-center justify-center mx-auto text-amber-500">
            <PackageOpen className="w-8 h-8" />
          </div>
          <h2 className="text-xl font-bold text-slate-800">
            No products found in &quot;{displayTitle}&quot;
          </h2>
          <p className="text-sm text-slate-500">
            We couldn&apos;t find any active listings in this category right now.
          </p>
          <div className="pt-2">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-[#F59E0B] hover:bg-[#D97706] text-white font-medium text-sm transition-colors shadow-xs"
            >
              <ArrowLeft className="w-4 h-4" />
              Browse All Products
            </Link>
          </div>
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-8">
      {/* Category Header */}
      <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Link href="/" className="hover:text-amber-600 transition-colors">
              Home
            </Link>
            <span>/</span>
            <Link
              href="/products"
              className="hover:text-amber-600 transition-colors"
            >
              Products
            </Link>
            <span>/</span>
            <span className="text-slate-600 font-medium">{displayTitle}</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {displayTitle}{" "}
            <span className="text-sm font-normal text-slate-500">
              ({products.length} {products.length === 1 ? "item" : "items"}{" "}
              available)
            </span>
          </h1>
        </div>
        <Link
          href="/products"
          className="text-xs font-semibold text-amber-600 hover:text-amber-700 transition-colors self-start sm:self-auto"
        >
          View All Marketplace Items &rarr;
        </Link>
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
        {products.map((product) => (
          <ProductCardVariant key={product._id} product={product} />
        ))}
      </div>
    </Container>
  );
}
