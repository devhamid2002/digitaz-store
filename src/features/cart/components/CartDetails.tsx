"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/toast";
import { removeItem, setItems } from "@/context/slices/cartSlice";
import { useAppDispatch } from "@/context/hooks";
import { useRouter } from "@/i18n/routing";
import {
  getMyCart,
  removeItemFromCart,
} from "@/features/cart/actions/cart.action";
import CartPricing from "@/features/cart/components/CartPricing";
import type { cartItem } from "@/features/cart/types/cartType";
import { type Locale } from "@/utils/format";
import OrderItem from "@/components/shared/components/OrderItem";

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
  const router = useRouter();

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
      // refetch the cart instead of duplicating the rule client-side
      const fresh = await getMyCart().catch(() => undefined);

      if (fresh) {
        setLines(fresh.items);
        setTotals({
          itemsPrice: fresh.itemsPrice,
          shippingPrice: fresh.shippingPrice,
          totalPrice: fresh.totalPrice,
        });
      } else {
        if (remaining.length === 0) {
          // Removing the last line deletes the cart row, so there is nothing
          // left to refetch — zero the summary instead of keeping stale totals
          setTotals({ itemsPrice: "0", shippingPrice: "0", totalPrice: "0" });
          // Re-render the server page so it shows the empty-cart state.
          router.refresh();
        }
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
          <OrderItem
            key={lineId(line)}
            line={line}
            locale={locale}
            labels={{
              color: tp("color"),
              size: tp("size"),
              quantity: t("quantity"),
              remove: t("remove"),
            }}
            onRemove={() => handleRemove(line)}
            pending={pending}
          />
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
        nextStep="shipping"
        actionLabel={t("checkoutButton")}
      />
    </div>
  );
}
