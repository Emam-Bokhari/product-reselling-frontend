import AllProducts from "@/components/modules/Products";
import { getAllProducts } from "@/services/Product";
import { TProduct } from "@/types";
import { Suspense } from "react";
import ProductSkeleton from "@/components/ui/core/skeleton/ProductSkeleton";
import Container from "@/components/shared/Container";

function ProductsLoadingSkeleton() {
  return (
    <div className="bg-[#F8FAFC] min-h-screen py-8">
      <Container>
        <div className="h-8 w-48 bg-slate-200 rounded-lg animate-pulse mb-6" />
        <div className="flex gap-6">
          <div className="hidden lg:block w-72 h-[600px] bg-white rounded-2xl border border-slate-200/80 animate-pulse" />
          <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-5">
            {Array.from({ length: 6 }).map((_, i) => (
              <ProductSkeleton key={i} />
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}

export default async function ProductsPage() {
  let products: TProduct[] = [];

  try {
    const res = await getAllProducts();
    products = res?.data || [];
  } catch (error) {
    console.error("Failed to load products on products page:", error);
  }

  return (
    <Suspense fallback={<ProductsLoadingSkeleton />}>
      <AllProducts products={products} />
    </Suspense>
  );
}
