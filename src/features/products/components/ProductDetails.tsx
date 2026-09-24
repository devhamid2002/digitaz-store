"use client";

import { useState } from "react";
import {
  ChevronRight,
  Heart,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import StarRating from "@/components/StarRating";
import { formatPrice, type PriceLocale } from "@/utils/format";
import type { Product } from "@/features/products/types/product";

export interface ProductDetailsLabels {
  color: string;
  size: string;
  sizeGuide: string;
  addToCart: string;
  wishlist: string;
  reviews: string;
  off: string;
  freeDelivery: string;
  freeDeliveryHint: string;
  returns: string;
  returnsHint: string;
  securePayment: string;
  securePaymentHint: string;
  details: string;
  brand: string;
  productCode: string;
  inStock: string;
  outOfStock: string;
  colorNames: string[];
}

interface ProductDetailsProps {
  product: Product;
  labels: ProductDetailsLabels;
  locale: PriceLocale;
}

// Mock variants until the backend provides product options
const COLORS = ["#3a3f44", "#d1d5db", "#f3e8d3", "#111111"];
const SIZES = ["S", "M", "L", "XL", "XXL"];

export default function ProductDetails({
  product,
  labels,
  locale,
}: ProductDetailsProps) {
  // Variant and wishlist state stays local until cart and product-option APIs exist
  const [colorIndex, setColorIndex] = useState(0);
  const [size, setSize] = useState("M");
  const [wishlisted, setWishlisted] = useState(false);

  return (
    <div className="flex w-full min-w-0 flex-col">
      <nav className="mb-4 flex items-center gap-1.5 text-xs sm:text-sm">
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

      <div className="flex items-center gap-2">
        {product.stock > 0 ? (
          <span className="rounded-md bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600 dark:bg-green-950 dark:text-green-400">
            {labels.inStock}
          </span>
        ) : (
          <span className="rounded-md bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 dark:bg-red-950 dark:text-red-400">
            {labels.outOfStock}
          </span>
        )}
      </div>

      <h1 className="mt-2 text-xl font-bold leading-8 text-gray-900 sm:text-2xl sm:leading-9 dark:text-gray-100 lg:text-3xl lg:leading-10">
        {product.name}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        <span>
          {labels.brand}:{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {product.brand}
          </span>
        </span>
        <span className="text-gray-300 dark:text-gray-600">|</span>
        <span>
          {labels.productCode}:{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {product.id}
          </span>
        </span>
      </div>

      <div className="mt-3 flex items-center gap-2">
        <StarRating rating={product.rating} size={14} />
        <span className="text-[13px] font-medium text-gray-900 sm:text-sm dark:text-gray-100">
          {product.rating}
        </span>
        <span className="text-[13px] text-gray-500 sm:text-sm dark:text-gray-400">
          ({product.ratingCount} {labels.reviews})
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        {/* Localized price with optional strike-through and discount badge */}
        <span className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-100">
          {formatPrice(product.price, locale)}
        </span>
        {product.originalPrice && (
          <span className="text-base text-gray-400 line-through">
            {formatPrice(product.originalPrice, locale)}
          </span>
        )}
        {product.discount && (
          <span className="rounded-md bg-gray-900 px-2.5 py-1 text-xs font-bold text-white dark:bg-white dark:text-gray-900">
            {product.discount}% {labels.off}
          </span>
        )}
      </div>

      <p className="mt-4 text-[15px] leading-7 text-gray-600 dark:text-gray-400">
        {product.description}
      </p>

      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      <div className="flex items-center gap-3">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          <span className="font-bold">{labels.color}: </span>
          <span className="font-normal text-gray-600 dark:text-gray-400">
            {labels.colorNames[colorIndex] ?? ""}
          </span>
        </p>
      </div>
      <div className="mt-3 flex items-center gap-3">
        {COLORS.map((color, index) => (
          <button
            key={color}
            type="button"
            onClick={() => setColorIndex(index)}
            aria-label={labels.colorNames[index] ?? `color-${index}`}
            aria-pressed={index === colorIndex}
            style={{ backgroundColor: color }}
            className={`h-9 w-9 rounded-full transition-all ${
              index === colorIndex
                ? "ring-2 ring-gray-900 ring-offset-2 dark:ring-white dark:ring-offset-night"
                : "ring-1 ring-gray-300 hover:ring-gray-400 dark:ring-gray-600"
            }`}
          />
        ))}
      </div>

      <div className="mt-6 flex items-center justify-between gap-3">
        <p className="text-sm text-gray-900 dark:text-gray-100">
          <span className="font-bold">{labels.size}: </span>
          <span className="font-normal">{size}</span>
        </p>
        <button
          type="button"
          className="ms-auto flex items-center gap-1.5 text-xs font-medium text-gray-600 underline underline-offset-4 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
        >
          <Ruler size={14} />
          {labels.sizeGuide}
        </button>
      </div>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        {SIZES.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setSize(s)}
            aria-pressed={s === size}
            className={`min-w-12 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
              s === size
                ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                : "border-gray-200 text-gray-700 hover:border-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-white"
            }`}
          >
            {s}
          </button>
        ))}
      </div>

      <div className="mt-6 flex items-center justify-start gap-3">
        {/* Purchase actions; cart submission wires up once checkout state exists */}
        <button
          type="button"
          className="flex h-11 w-auto items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 text-[13px] font-bold whitespace-nowrap text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <ShoppingBag size={18} />
          {labels.addToCart}
        </button>
        <button
          type="button"
          onClick={() => setWishlisted((v) => !v)}
          aria-label={labels.wishlist}
          title={labels.wishlist}
          aria-pressed={wishlisted}
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl border border-gray-200 text-gray-900 transition-colors hover:border-gray-900 dark:border-gray-700 dark:text-white dark:hover:border-white"
        >
          <Heart
            size={20}
            className={wishlisted ? "fill-current" : ""}
          />
        </button>
      </div>

      <div className="mt-8 grid grid-cols-1 gap-4 min-[420px]:grid-cols-3">
        {/* Delivery, returns and payment assurances */}
        <div className="flex items-start gap-3">
          <Truck size={28} strokeWidth={1.6} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {labels.freeDelivery}
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              {labels.freeDeliveryHint}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <RotateCcw size={28} strokeWidth={1.6} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {labels.returns}
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              {labels.returnsHint}
            </p>
          </div>
        </div>
        <div className="flex items-start gap-3">
          <ShieldCheck size={28} strokeWidth={1.6} className="mt-0.5 shrink-0" />
          <div>
            <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
              {labels.securePayment}
            </p>
            <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
              {labels.securePaymentHint}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
