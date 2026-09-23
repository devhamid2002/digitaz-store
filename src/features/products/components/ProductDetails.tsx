"use client";

import { useState } from "react";
import {
  ChevronRight,
  Heart,
  RotateCcw,
  ShoppingCart,
  Star,
  Truck,
} from "lucide-react";
import StarRating from "@/components/StarRating";
import { formatPrice, type PriceLocale } from "@/utils/format";
import type { Product } from "@/features/products/types/product";

export interface ProductDetailsLabels {
  color: string;
  size: string;
  addToCart: string;
  wishlist: string;
  reviews: string;
  off: string;
  freeDelivery: string;
  freeDeliveryHint: string;
  returns: string;
  returnsHint: string;
  details: string;
}

interface ProductDetailsProps {
  product: Product;
  labels: ProductDetailsLabels;
  locale: PriceLocale;
}

// Mock variants until the backend provides product options
const COLORS = ["#111111", "#9ca3af", "#4f46e5", "#16a34a", "#2563eb"];
const SIZES = ["XS", "S", "M", "L", "XL"];

export default function ProductDetails({
  product,
  labels,
  locale,
}: ProductDetailsProps) {
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState("L");
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="flex w-full flex-col">
      <nav className="mb-4 flex items-center gap-1.5 text-sm">
        <span className="text-gray-500 dark:text-gray-400">
          {product.category}
        </span>
        <ChevronRight
          size={14}
          className="shrink-0 text-gray-400 rtl:rotate-180"
        />
        <span className="font-medium text-brand dark:text-brand-ink">
          {product.name}
        </span>
      </nav>

      <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 lg:text-3xl">
        {product.name}
      </h1>

      <div className="mt-4 flex items-center gap-3">
        <div className="flex items-center gap-2 rounded-lg border border-gray-200 px-3 py-1.5 dark:border-gray-700">
          <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
            {product.rating}
          </span>
          <Star size={16} className="fill-amber-400 text-amber-400" />
          <span className="text-xs text-gray-400">|</span>
          <span className="text-xs text-gray-500 dark:text-gray-400">
            {product.ratingCount} {labels.reviews}
          </span>
        </div>
        <StarRating rating={product.rating} size={16} />
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <span className="text-3xl font-bold text-gray-900 dark:text-gray-100">
          {formatPrice(product.price, locale)}
        </span>
        {product.originalPrice && (
          <span className="text-sm text-gray-400 line-through">
            {formatPrice(product.originalPrice, locale)}
          </span>
        )}
        {product.discount && (
          <span className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600 dark:bg-green-950 dark:text-green-400">
            {product.discount}% {labels.off}
          </span>
        )}
      </div>

      <p className="mt-4 text-sm leading-6 text-gray-500 dark:text-gray-400">
        {product.description}
      </p>

      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      <div className="flex items-center gap-3">
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {labels.color} :
        </span>
        <div className="flex items-center gap-2">
          {COLORS.map((color, index) => (
            <button
              key={color}
              type="button"
              onClick={() => setColorIndex(index)}
              aria-label={`color-${index}`}
              style={{ backgroundColor: color }}
              className={`h-6 w-6 rounded-full transition-all ${
                index === colorIndex
                  ? "ring-2 ring-gray-900 ring-offset-2 dark:ring-white dark:ring-offset-gray-900"
                  : "ring-1 ring-gray-300 dark:ring-gray-600"
              }`}
            />
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center gap-3">
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {labels.size} :
        </span>
        <div className="flex items-center gap-2">
          {SIZES.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => setSize(s)}
              className={`min-w-10 rounded-md border px-2.5 py-1.5 text-sm font-medium transition-colors ${
                s === size
                  ? "border-brand bg-brand text-white"
                  : "border-gray-200 text-gray-700 hover:border-brand dark:border-gray-700 dark:text-gray-300"
              }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="button"
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-brand-hover"
        >
          <ShoppingCart size={18} />
          {labels.addToCart}
        </button>
        <button
          type="button"
          onClick={() => setWishlisted((v) => !v)}
          className="flex flex-1 items-center justify-center gap-2 rounded-lg bg-brand-soft px-6 py-3 text-sm font-bold text-brand transition-colors hover:bg-brand-soft-hover dark:bg-brand-deep dark:text-brand-ink-soft dark:hover:bg-brand-deep-hover"
        >
          <Heart
            size={18}
            className={wishlisted ? "fill-brand dark:fill-brand-ink-soft" : ""}
          />
          {labels.wishlist}
        </button>
      </div>

      <div className="mt-6 divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
        <div className="flex items-start gap-3 p-4">
          <Truck size={26} strokeWidth={1.8} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {labels.freeDelivery}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {labels.freeDeliveryHint}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3 p-4">
          <RotateCcw size={26} strokeWidth={1.8} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {labels.returns}
            </p>
            <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
              {labels.returnsHint}{" "}
              <span className="underline">{labels.details}</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
