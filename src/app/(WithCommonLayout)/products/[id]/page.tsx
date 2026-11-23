export const dynamic = "force-dynamic";

import { Fragment } from "react";
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
      <Fragment>
        <p className="text-center mt-[5%] text-gray-500 text-lg">
          Product not found
        </p>
      </Fragment>
    );
  }

  return (
    <Fragment>
      <ProductDetails product={product} />
    </Fragment>
  );
}
