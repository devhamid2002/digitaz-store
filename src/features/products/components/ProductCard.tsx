import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import StarRating from "../../../components/StarRating";
import { formatPrice } from "@/utils/format";
import type { Product } from "@/features/products/types/product";

interface ProductCardProps {
  product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
  const locale = useLocale() as "fa" | "en";
  return (
    <Link
      href={`/product/${product.slug}`}
      className="group flex flex-col bg-white dark:bg-gray-800 rounded-xl border border-gray-100 dark:border-gray-700 p-4 transition-all duration-300 hover:shadow-md h-full"
    >
      <div className="relative w-full h-36 mb-3">
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </div>

      <div className="w-full text-right flex flex-col flex-1">
        <p className="text-gray-400 dark:text-gray-500 text-xs mb-1">
          {product.category}
        </p>
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-5 mb-2 line-clamp-2 min-h-10">
          {product.name}
        </h3>

        <div className="mt-auto pt-2">
          <div className="flex items-center justify-between mb-1">
            <span className="text-[11px] text-gray-400 dark:text-gray-500">
              ({product.viewCount} دیدکاه)
            </span>
          </div>
          <div className="flex items-center justify-between">
            <StarRating rating={product.rating} />
            <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {formatPrice(product.price, locale)}
            </span>
          </div>
        </div>
      </div>
    </Link>
  );
}
