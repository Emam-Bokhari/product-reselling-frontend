import AllProducts from "@/components/modules/Products";
import { getAllProducts } from "@/services/Product";
import { TProduct } from "@/types";
import { Fragment, Suspense } from "react";

export default async function ProductsPage() {
  const res = await getAllProducts();
  const products: TProduct[] = res?.data || [];

  return (
    <Fragment>
      <Suspense
        fallback={
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500" />
          </div>
        }
      >
        <AllProducts products={products} />
      </Suspense>
    </Fragment>
  );
}
