"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { toast } from "@/components/ui/toast";
import { removeItem, setItems } from "@/context/slices/cartSlice";
import { useAppDispatch } from "@/context/hooks";
import {
  getMyCart,
  removeItemFromCart,
} from "@/features/cart/actions/cart.action";
import CartPricing from "@/features/cart/components/CartPricing";
import type { cartItem } from "@/features/cart/types/cartType";
import { formatPrice, type Locale } from "@/utils/format";

type CartDetailsProps = {
  cart: {
    items: cartItem[];
    itemsPrice: string;
    shippingPrice: string;
    totalPrice: string;
  };
  locale: Locale;
  showCheckoutButton?: boolean;
};

// Same identity rule as the slice: product + selected variant
const lineKeyOf = (line: cartItem) => ({
  productId: line.productId,
  color: line.color ?? null,
  size: line.size ?? null,
});

const lineId = (line: cartItem) =>
  `${line.productId}-${line.color ?? ""}-${line.size ?? ""}`;

export default function CartDetails({
  cart,
  locale,
  showCheckoutButton = true,
}: CartDetailsProps) {
  const t = useTranslations("cart");
  const tp = useTranslations("product");
  const te = useTranslations("errors");
  const dispatch = useAppDispatch();

  // The server snapshot owns the first paint; removals trim this local copy
  const [items, setLines] = useState(cart.items);
  const [totals, setTotals] = useState({
    itemsPrice: cart.itemsPrice,
    shippingPrice: cart.shippingPrice,
    totalPrice: cart.totalPrice,
  });
  // Blocks double-clicks: every removal is a server round-trip
  const [pending, setPending] = useState(false);

  // Seed the badge from the server cart so a fresh load and Redux agree
  useEffect(() => {
    if (!cart.items.length) return;
    dispatch(
      setItems(
        cart.items.map((line) => ({
          ...line,
          color: line.color ?? null,
          size: line.size ?? null,
          quantity: Number(line.qty) || 1,
        })),
      ),
    );
  }, [cart.items, dispatch]);

  const handleRemove = async (line: cartItem) => {
    if (pending) return;
    setPending(true);

    const lineKey = lineKeyOf(line);

    try {
      const result = await removeItemFromCart(lineKey);

      if ("error" in result) {
        toast.add({ type: "error", title: result.error.message });
        return;
      }

      dispatch(removeItem(lineKey));
      const remaining = items.filter(
        (item) =>
          item.productId !== lineKey.productId ||
          (item.color ?? null) !== lineKey.color ||
          (item.size ?? null) !== lineKey.size,
      );
      setLines(remaining);

      // Totals are server-priced (incl. the free-shipping threshold):
      // refetch instead of duplicating the pricing rule in the client
      const fresh = await getMyCart().catch(() => undefined);
      if (fresh) {
        setTotals({
          itemsPrice: fresh.itemsPrice,
          shippingPrice: fresh.shippingPrice,
          totalPrice: fresh.totalPrice,
        });
      } else if (remaining.length === 0) {
        // Removing the last line deletes the cart row, so there is nothing
        // left to refetch — zero the summary instead of keeping stale totals
        setTotals({ itemsPrice: "0", shippingPrice: "0", totalPrice: "0" });
      }

      toast.add({ type: "success", title: t("removedFromCart") });
    } catch {
      toast.add({ type: "error", title: te("cartRemoveFailed") });
    } finally {
      setPending(false);
    }
  };

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <ul className="divide-y divide-gray-200 rounded-xl border border-gray-200 dark:divide-gray-700 dark:border-gray-700">
        {items.map((line) => (
          <li key={lineId(line)} className="flex gap-4 p-4 sm:p-5">
            <Image
              src={line.image}
              alt={line.name}
              width={80}
              height={80}
              className="h-20 w-20 shrink-0 rounded-lg bg-gray-50 object-contain dark:bg-neutral-800"
            />

            <div className="flex min-w-0 flex-1 flex-col gap-1">
              <Link
                href={`/product/${line.slug}`}
                className="text-sm font-bold text-gray-900 hover:text-brand dark:text-gray-100 dark:hover:text-brand-ink"
              >
                {line.name}
              </Link>

              {(line.color || line.size) && (
                <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
                  {line.color && (
                    <span>
                      {tp("color")}:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {line.color}
                      </span>
                    </span>
                  )}

                  {line.color && line.size && (
                    <span className="text-gray-300 dark:text-gray-600">|</span>
                  )}

                  {line.size && (
                    <span>
                      {tp("size")}:{" "}
                      <span className="font-medium text-gray-700 dark:text-gray-300">
                        {line.size}
                      </span>
                    </span>
                  )}
                </p>
              )}

              <p className="mt-1 text-sm text-gray-600 tabular-nums dark:text-gray-400">
                {formatPrice(line.price, locale)}
                <span className="mx-1.5 text-gray-300 dark:text-gray-600">
                  ×
                </span>
                <span className="sr-only">{t("quantity")}: </span>
                {Number(line.qty) || 1}
              </p>
            </div>

            <div className="flex shrink-0 flex-col items-end justify-between">
              <button
                type="button"
                onClick={() => handleRemove(line)}
                disabled={pending}
                aria-label={t("remove")}
                title={t("remove")}
                className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950"
              >
                <Trash2 size={16} />
              </button>

              <span className="text-sm font-bold text-gray-900 tabular-nums dark:text-gray-100">
                {formatPrice(line.price * (Number(line.qty) || 1), locale)}
              </span>
            </div>
          </li>
        ))}
      </ul>

      {/* Inline-end column: second grid cell, so the writing direction puts it
          on the right in LTR and on the left in RTL — no dir-specific code */}
      <CartPricing
        itemsPrice={totals.itemsPrice}
        shippingPrice={totals.shippingPrice}
        totalPrice={totals.totalPrice}
        locale={locale}
        showCheckoutButton={showCheckoutButton}
        hasItems={items.length > 0}
      />
    </div>
  );
}
