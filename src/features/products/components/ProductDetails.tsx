"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronRight,
  Heart,
  RotateCcw,
  Ruler,
  ShieldCheck,
  ShoppingBag,
  Truck,
} from "lucide-react";
import { toast } from "@/components/ui/toast";

import StarRating from "@/components/StarRating";
import { addItem } from "@/context/slices/cartSlice";
import { useAppDispatch } from "@/context/hooks";
import type {
  Product,
  ProductVariantSelection,
} from "@/features/products/types/product";
import { formatPrice, type Locale } from "@/utils/format";

interface ProductDetailsProps {
  product: Product;
  locale: Locale;
}

export default function ProductDetails({
  product,
  locale,
}: ProductDetailsProps) {
  const t = useTranslations("product");
  const dispatch = useAppDispatch();

  const { colors, sizes } = product.specifications;
  const [wishlisted, setWishlisted] = useState(false);

  const [selection, setSelection] = useState<ProductVariantSelection>({
    colorIndex: 0,
    size: sizes[0] ?? "",
  });

  const outOfStock = product.stock === 0;
  const selectedColor = colors[selection.colorIndex];

  const updateSelection = (patch: Partial<ProductVariantSelection>) => {
    setSelection((current) => ({ ...current, ...patch }));
  };

  const handleAddToCart = () => {
    if (outOfStock) {
      toast.add({ type: "error", title: t("addToCartError") });
      return;
    }

    try {
      dispatch(
        addItem({
          productId: product.id,
          slug: product.slug,
          name: product.name,
          image: product.image,
          price: product.price,
          color: selectedColor?.name ?? null,
          size: selection.size || null,
        })
      );
      toast.add({ type: "success", title: t("addedToCart") });
    } catch {
      toast.add({ type: "error", title: t("addToCartError") });
    }
  };

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
        <span
          className={
            product.stock > 0
              ? "rounded-md bg-green-50 px-2.5 py-1 text-xs font-bold text-green-600 dark:bg-green-950 dark:text-green-400"
              : "rounded-md bg-red-50 px-2.5 py-1 text-xs font-bold text-red-600 dark:bg-red-950 dark:text-red-400"
          }
        >
          {product.stock > 0 ? t("inStock") : t("outOfStock")}
        </span>
      </div>

      <h1 className="mt-2 text-xl font-bold leading-8 text-gray-900 sm:text-2xl sm:leading-9 dark:text-gray-100 lg:text-3xl lg:leading-10">
        {product.name}
      </h1>

      <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
        <span>
          {t("brand")}:{" "}
          <span className="font-medium text-gray-700 dark:text-gray-300">
            {product.brand}
          </span>
        </span>

        <span className="text-gray-300 dark:text-gray-600">|</span>

        <span>
          {t("productCode")}:{" "}
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
          ({product.ratingCount} {t("reviews")})
        </span>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
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
            {product.discount}% {t("off")}
          </span>
        )}
      </div>

      <p className="mt-4 text-[15px] leading-7 text-gray-600 dark:text-gray-400">
        {product.description}
      </p>

      <hr className="my-6 border-gray-200 dark:border-gray-700" />

      {colors.length > 0 && (
        <section>
          <p className="text-sm text-gray-900 dark:text-gray-100">
            <span className="font-bold">{t("color")}: </span>
            <span className="font-normal text-gray-600 dark:text-gray-400">
              {selectedColor?.name ?? ""}
            </span>
          </p>

          <div className="mt-3 flex items-center gap-3">
            {colors.map((color, index) => {
              const isSelected = index === selection.colorIndex;

              return (
                <button
                  key={color.hex}
                  type="button"
                  onClick={() => updateSelection({ colorIndex: index })}
                  aria-label={color.name}
                  aria-pressed={isSelected}
                  style={{ backgroundColor: color.hex }}
                  className={`h-9 w-9 rounded-full transition-all ${
                    isSelected
                      ? "ring-2 ring-gray-900 ring-offset-2 dark:ring-white dark:ring-offset-night"
                      : "ring-1 ring-gray-300 hover:ring-gray-400 dark:ring-gray-600"
                  }`}
                />
              );
            })}
          </div>
        </section>
      )}

      {sizes.length > 0 && (
        <section className="mt-6">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm text-gray-900 dark:text-gray-100">
              <span className="font-bold">{t("size")}: </span>
              <span>{selection.size}</span>
            </p>

            <button
              type="button"
              className="ms-auto flex items-center gap-1.5 text-xs font-medium text-gray-600 underline underline-offset-4 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100"
            >
              <Ruler size={14} />
              {t("sizeGuide")}
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {sizes.map((size) => {
              const isSelected = size === selection.size;

              return (
                <button
                  key={size}
                  type="button"
                  onClick={() => updateSelection({ size })}
                  aria-pressed={isSelected}
                  className={`min-w-12 rounded-lg border px-4 py-2.5 text-sm font-medium transition-colors ${
                    isSelected
                      ? "border-gray-900 bg-gray-900 text-white dark:border-white dark:bg-white dark:text-gray-900"
                      : "border-gray-200 text-gray-700 hover:border-gray-900 dark:border-gray-700 dark:text-gray-300 dark:hover:border-white"
                  }`}
                >
                  {size}
                </button>
              );
            })}
          </div>
        </section>
      )}

      <div className="mt-6 flex items-center justify-start gap-3">
        <button
          type="button"
          onClick={handleAddToCart}
          disabled={outOfStock}
          className="flex h-11 w-auto items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 text-[13px] font-bold whitespace-nowrap text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          <ShoppingBag size={18} />
          {t("addToCart")}
        </button>

        <button
          type="button"
          onClick={() => setWishlisted((current) => !current)}
          aria-label={t("wishlist")}
          title={t("wishlist")}
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
        {[
          {
            icon: Truck,
            title: t("freeDelivery"),
            description: t("freeDeliveryHint"),
          },
          {
            icon: RotateCcw,
            title: t("returns"),
            description: t("returnsHint"),
          },
          {
            icon: ShieldCheck,
            title: t("securePayment"),
            description: t("securePaymentHint"),
          },
        ].map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-3">
            <Icon
              size={28}
              strokeWidth={1.6}
              className="mt-0.5 shrink-0"
            />

            <div>
              <p className="text-sm font-bold text-gray-900 dark:text-gray-100">
                {title}
              </p>

              <p className="mt-1 text-xs leading-5 text-gray-500 dark:text-gray-400">
                {description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
