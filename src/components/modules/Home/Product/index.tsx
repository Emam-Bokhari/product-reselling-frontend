import Container from "@/components/shared/Container";
import SectionTitle from "@/components/shared/SectionTitle";
import { Button } from "@/components/ui/button";
import ProductCard from "@/components/ui/core/ProductCard";
import ProductSkeleton from "@/components/ui/core/skeleton/ProductSkeleton";
import { getAllProducts } from "@/services/Product";
import { TProduct } from "@/types";
import Link from "next/link";

export default async function ProductSection() {
  let products: TProduct[] = [];

  try {
    const res = await getAllProducts();
    products = res?.data || [];
  } catch (error) {
    console.error("Failed to load products in ProductSection:", error);
  }

  // Filter out sold out products so that only available products are shown on the home page
  const availableProducts = products.filter((product) => {
    const status = product?.status?.toLowerCase()?.trim();
    return status !== "sold" && status !== "soldout" && status !== "sold out";
  });

  return (
    <Container className="mt-12">
      <div className="flex justify-between">
        <SectionTitle title="Products" />
        <div>
          <Link href="/products">
            <Button variant="link" className="text-[#F59E0B] cursor-pointer">
              Sell All Products
            </Button>
          </Link>
        </div>
      </div>
      {/* cards */}
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {availableProducts.length === 0
          ? Array.from({ length: 8 }).map((_, index) => (
              <ProductSkeleton key={index} />
            ))
          : availableProducts
              .slice(0, 16)
              .map((product) => (
                <ProductCard key={product?._id} product={product} />
              ))}
      </div>
    </Container>
  );
}
