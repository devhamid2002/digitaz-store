import Image from "next/image";
import Link from "next/link";
import { useLocale } from "next-intl";
import StarRating from "@/components/StarRating";
import CountdownTimer from "@/components/CountdownTimer";
import { formatPrice, getTargetDate } from "@/utils/format";
import type { Product } from "@/features/products/types/product";

interface FeaturedProductCardProps {
  product: Product;
}

export default function FeaturedProductCard({ product }: FeaturedProductCardProps) {
  const locale = useLocale() as "fa" | "en";
  const targetDate = getTargetDate();

  return (
    <div className="relative flex flex-col items-center bg-white dark:bg-gray-800 rounded-xl border-2 border-brand-vivid p-6 h-full">
      {product.discount && (
        <span className="absolute top-4 left-4 bg-red-500 text-white text-xs font-bold px-2.5 py-1 rounded-lg">
          -{product.discount}%
        </span>
      )}

      <h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4 text-center">
        پیشنهادهای ویژه
      </h2>

      <Link
        href={`/product/${product.slug}`}
        className="relative w-full max-w-70 h-50 mb-4"
      >
        <Image
          src={product.image}
          alt={product.name}
          fill
          className="object-contain"
          sizes="(max-width: 768px) 50vw, 25vw"
        />
      </Link>

      <div className="w-full text-center flex-1 flex flex-col justify-center">
        <p className="text-xs text-gray-400 dark:text-gray-500 mb-1">{product.category}</p>
        <h3 className="text-sm font-bold text-gray-900 dark:text-gray-100 leading-6 mb-3 min-h-12">
          {product.name}
        </h3>

        <div className="flex items-center justify-center gap-2 mb-2">
          {product.discount && product.originalPrice && (
            <span className="text-sm text-gray-400 dark:text-gray-500 line-through">
              {formatPrice(product.originalPrice, locale)}
            </span>
          )}
          <span className="text-lg font-bold text-red-500">
            {formatPrice(product.price, locale)}
          </span>
        </div>

        <div className="flex items-center justify-center gap-2 mb-4">
          <StarRating rating={product.rating} ratingCount={product.ratingCount} />
        </div>

        <div className="border-t border-gray-100 dark:border-gray-700 pt-3 mt-2">
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
            عجله کن! زمان باقیمانده پیشنهاد:
          </p>
          <div className="flex justify-center">
            <CountdownTimer targetDate={targetDate} />
          </div>
        </div>

        <p className="text-xs text-gray-400 dark:text-gray-500 mt-3">
          تا پایان پیشنهاد باقی مانده!
        </p>
      </div>
    </div>
  );
}
