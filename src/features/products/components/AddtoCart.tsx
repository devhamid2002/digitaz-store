"use client";

import { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { ShoppingBag, Minus, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  addItem,
  decrementItem,
  removeItem,
  selectCartItems,
  setItems,
} from "@/context/slices/cartSlice";
import { useAppDispatch, useAppSelector } from "@/context/hooks";
import {
  addItemToCart,
  removeItemFromCart,
} from "@/features/cart/actions/cart.action";
import type { cartItem, cartSnapshot } from "@/features/cart/types/cartType";

type AddtoCartProps = {
  cartItem: cartItem;
  // product.stock: 0 disables the button and caps the "+" stepper
  stock: number;
  // Server-cart snapshot from the page: seeds the badge and the first paint
  cart?: cartSnapshot;
};

export default function AddtoCart({ cartItem, stock, cart }: AddtoCartProps) {
  const t = useTranslations("product");
  const dispatch = useAppDispatch();
  const cartItems = useAppSelector(selectCartItems);
  // Blocks double-clicks: every click is a server round-trip
  const [pending, setPending] = useState(false);

  const outOfStock = stock === 0;
  const lineKey = {
    productId: cartItem.productId,
    color: cartItem.color ?? null,
    size: cartItem.size ?? null,
  };
  // Same identity rule as the slice: product + selected variant
  const isCurrentLine = (line: {
    productId: string;
    color?: string | null;
    size?: string | null;
  }) =>
    line.productId === lineKey.productId &&
    (line.color ?? null) === lineKey.color &&
    (line.size ?? null) === lineKey.size;

  // The live Redux line wins right after a click; the server snapshot covers
  // the first paint (a reload starts with an empty Redux store)
  const existItem =
    cartItems.find(isCurrentLine) ?? cart?.items.find(isCurrentLine);
  const existQty = existItem
    ? "quantity" in existItem
      ? existItem.quantity
      : Number(existItem.qty) || 1
    : 0;

  // Seed the badge from the server cart so a fresh page load and Redux agree
  useEffect(() => {
    if (!cart?.items.length) return;
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
  }, [cart, dispatch]);

  const dispatchItem = () =>
    dispatch(
      addItem({
        productId: cartItem.productId,
        slug: cartItem.slug,
        name: cartItem.name,
        image: cartItem.image,
        price: cartItem.price,
        color: cartItem.color ?? null,
        size: cartItem.size ?? null,
      }),
    );

  const handleAddToCart = async () => {
    if (outOfStock) {
      toast.add({ type: "error", title: t("addToCartError") });
      return;
    }
    if (pending) return;
    setPending(true);

    try {
      // Persist first so the badge only reflects saved items
      const result = await addItemToCart({ ...cartItem, qty: "1" });

      if ("error" in result) {
        toast.add({ type: "error", title: result.error.message });
        return;
      }

      dispatchItem();
      toast.add({ type: "success", title: t("addedToCart") });
    } catch {
      toast.add({ type: "error", title: t("addToCartError") });
    } finally {
      setPending(false);
    }
  };

  const handleIncrease = async () => {
    if (pending || existQty === 0 || existQty >= stock) return;
    setPending(true);

    try {
      // The server merges qty into the line (+1 per call) and the slice's
      // addItem also does +1, so both counts stay in step
      const result = await addItemToCart({ ...cartItem, qty: "1" });

      if ("error" in result) {
        toast.add({ type: "error", title: result.error.message });
        return;
      }

      dispatchItem();
    } catch {
      toast.add({ type: "error", title: t("addToCartError") });
    } finally {
      setPending(false);
    }
  };

  const handleDecrease = async () => {
    if (pending || existQty === 0) return;
    setPending(true);

    try {
      if (existQty <= 1) {
        // Last unit: removing it empties the line entirely
        const result = await removeItemFromCart(lineKey);

        if ("error" in result) {
          toast.add({ type: "error", title: result.error.message });
          return;
        }

        dispatch(removeItem(lineKey));
        return;
      }

      // There is no decrement endpoint: drop the line, re-save it one lower
      const nextQty = existQty - 1;
      const removed = await removeItemFromCart(lineKey);

      if ("error" in removed) {
        toast.add({ type: "error", title: removed.error.message });
        return;
      }

      const readded = await addItemToCart({ ...cartItem, qty: String(nextQty) });

      if ("error" in readded) {
        // The line is gone server-side; keep the badge honest
        dispatch(removeItem(lineKey));
        toast.add({ type: "error", title: readded.error.message });
        return;
      }

      dispatch(decrementItem(lineKey));
    } catch {
      toast.add({ type: "error", title: t("addToCartError") });
    } finally {
      setPending(false);
    }
  };

  if (existItem) {
    return (
      <div className="flex h-11 items-center rounded-xl border border-gray-200 dark:border-gray-700">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-xl"
          onClick={handleDecrease}
          disabled={pending}
          aria-label={t("decreaseQuantity")}
        >
          <Minus size={16} />
        </Button>
        <span className="w-8 text-center text-sm font-bold tabular-nums">
          {existQty}
        </span>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="h-11 w-11 rounded-xl"
          onClick={handleIncrease}
          disabled={pending || existQty >= stock}
          aria-label={t("increaseQuantity")}
        >
          <Plus size={16} />
        </Button>
      </div>
    );
  }

  return (
    <Button
      type="button"
      onClick={handleAddToCart}
      disabled={outOfStock || pending}
      className="flex h-11 w-auto items-center justify-center gap-2 rounded-xl bg-gray-900 px-8 text-[13px] font-bold whitespace-nowrap text-white transition-colors hover:bg-gray-800 disabled:cursor-not-allowed disabled:opacity-50 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
    >
      <ShoppingBag size={18} />
      {t("addToCart")}
    </Button>
  );
}
