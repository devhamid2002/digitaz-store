"use client";

import { useQuery } from "@tanstack/react-query";
import { getProducts } from "@/features/products/services/productService";
import ProductCard from "./ProductCard";
import FeaturedProductCard from "./FeaturedProductCard";
import type { Product } from "@/features/products/types/product";

export default function ProductShowcase() {
  const { data: products = [], isLoading } = useQuery({
    queryKey: ["products"],
    queryFn: getProducts,
  });

  if (isLoading) {
    return (
      <div className="w-full bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div
                key={i}
                className="bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 animate-pulse"
              >
                <div className="h-36 bg-gray-200 dark:bg-gray-700 rounded mb-3" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2" />
                <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  const featured = products.find((p: Product) => p.isFeatured);
  const regular = products.filter((p: Product) => !p.isFeatured);

  const leftTop = regular.slice(0, 2);
  const leftBottom = regular.slice(2, 4);
  const rightTop = regular.slice(4, 6);
  const rightBottom = regular.slice(6, 8);

  return (
    <div className="w-full bg-gray-50 dark:bg-gray-900 py-12">
      <div className="max-w-7xl mx-auto px-4">
        {/* Desktop (lg+): 5-column centered grid */}
        <div className="hidden lg:grid grid-cols-5 gap-4 auto-rows-fr">
          {/* Row 1 */}
          {leftTop[0] && (
            <div className="col-start-1 row-start-1">
              <ProductCard product={leftTop[0]} />
            </div>
          )}
          {leftTop[1] && (
            <div className="col-start-2 row-start-1">
              <ProductCard product={leftTop[1]} />
            </div>
          )}
          {featured && (
            <div className="col-start-3 row-start-1 row-span-2">
              <FeaturedProductCard product={featured} />
            </div>
          )}
          {rightTop[0] && (
            <div className="col-start-4 row-start-1">
              <ProductCard product={rightTop[0]} />
            </div>
          )}
          {rightTop[1] && (
            <div className="col-start-5 row-start-1">
              <ProductCard product={rightTop[1]} />
            </div>
          )}

          {/* Row 2 */}
          {leftBottom[0] && (
            <div className="col-start-1 row-start-2">
              <ProductCard product={leftBottom[0]} />
            </div>
          )}
          {leftBottom[1] && (
            <div className="col-start-2 row-start-2">
              <ProductCard product={leftBottom[1]} />
            </div>
          )}
          {rightBottom[0] && (
            <div className="col-start-4 row-start-2">
              <ProductCard product={rightBottom[0]} />
            </div>
          )}
          {rightBottom[1] && (
            <div className="col-start-5 row-start-2">
              <ProductCard product={rightBottom[1]} />
            </div>
          )}
        </div>

        {/* Tablet (md): 2-column grid with featured spanning full width */}
        <div className="hidden md:grid lg:hidden grid-cols-2 gap-4">
          {featured && (
            <div className="col-span-2">
              <FeaturedProductCard product={featured} />
            </div>
          )}
          {regular.map((product: Product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Mobile: single column */}
        <div className="grid md:hidden grid-cols-1 gap-4">
          {featured && <FeaturedProductCard product={featured} />}
          {regular.map((product: Product) => (
            <div key={product.id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
