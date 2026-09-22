"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/services/productService";
import ProductCard from "./ProductCard";
import FeaturedProductCard from "./FeaturedProductCard";
import ProductGridSkeleton from "./ProductGridSkeleton";

export default function ProductGrid() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 py-12 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4">
          <ProductGridSkeleton />
        </div>
      </div>
    );
  }

  const featured = products.find((product) => product.isFeatured);
  const regular = products.filter((product) => !product.isFeatured);

  return (
    <div className="w-full bg-gray-50 py-12 dark:bg-gray-900">
      <div className="mx-auto max-w-7xl px-4">
        {/* Desktop */}
        <div className="hidden auto-rows-fr grid-cols-5 gap-4 lg:grid">
          {regular.slice(0, 8).map((product, index) => (
            <div
              key={product.id}
              className={
                index < 4
                  ? "col-start-1"
                  : "col-start-4"
              }
              style={{
                gridColumnStart: index % 4 < 2 ? 1 + (index % 4) : 4 + (index % 4 - 2),
                gridRowStart: Math.floor(index / 4) + 1,
              }}
            >
              <ProductCard product={product} />
            </div>
          ))}

          {featured && (
            <div className="col-start-3 row-start-1 row-span-2">
              <FeaturedProductCard product={featured} />
            </div>
          )}
        </div>

        {/* Tablet */}
        <div className="hidden grid-cols-2 gap-4 md:grid lg:hidden">
          {featured && (
            <div className="col-span-2">
              <FeaturedProductCard product={featured} />
            </div>
          )}

          {regular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Mobile */}
        <div className="grid grid-cols-1 gap-4 md:hidden">
          {featured && <FeaturedProductCard product={featured} />}

          {regular.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
