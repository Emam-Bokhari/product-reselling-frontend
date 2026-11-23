export const dynamic = "force-dynamic";

import { Fragment } from "react";
import { getProductById } from "@/services/Product";
import { TProduct } from "@/types";
import CategoryWiseProductDetails from "@/components/modules/Category";

export default async function CategoryWiseProductDetailsPage({
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
      <CategoryWiseProductDetails product={product} />
    </Fragment>
  );
}
