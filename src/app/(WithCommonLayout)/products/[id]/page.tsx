export const dynamic = "force-dynamic";

import { Fragment } from "react";
import Link from "next/link";
import ProductDetails from "@/components/modules/Products/ProductDetails";
import { getProductById } from "@/services/Product";
import { TProduct } from "@/types";

export default async function ProductDetailsPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { data: product }: { data: TProduct } = (await getProductById(id)) || {};

  if (!product) {
    return (
      <div className="min-h-[50vh] flex flex-col items-center justify-center text-center px-4">
        <p className="text-gray-500 text-lg mb-4">
          Product not found
        </p>
        <Link
          href="/products"
          className="inline-flex items-center justify-center px-5 py-2.5 bg-amber-500 text-white rounded-xl text-sm font-semibold hover:bg-amber-600 transition-colors shadow-xs"
        >
          Browse All Products
        </Link>
      </div>
    );
  }

  return (
    <Fragment>
      <ProductDetails product={product} />
    </Fragment>
  );
}
