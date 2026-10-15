"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { toActionError } from "@/utils/actionError";
import type { CartItem, cartItem, cartLineKey } from "../types/cartType";
import { prisma } from "@/lib/prisma";
import { cartItemSchema, cartLineKeySchema } from "../types/cart.validator";



function calcPrice(items: CartItem[]) {
  const itemsPrice = items.reduce(
    (acc, item) => acc + Number(item.price) * Number(item.qty),
    0,
  );

  const shippingPrice = itemsPrice > 100 ? 0 : 100;

  const totalPrice = itemsPrice + shippingPrice;

  return {
    itemsPrice,
    shippingPrice,
    totalPrice,
  };
}

export async function addItemToCart(item: cartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Session not found");

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    const cart = await getMyCart();

    // Runtime-validate the payload; the caller's type is only a compile-time claim
    const parsed = cartItemSchema.parse(item);

    const product = await prisma.product.findFirst({
      where: { id: parsed.productId },
    });

    if (!product) throw new Error("Product not found");

    if (!cart) {
      const newCart = {
        userId: userId,
        items: [parsed],
        sessionCartId: sessionCartId,
        ...calcPrice([parsed]),
      };

      await prisma.cart.create({ data: newCart });

      return { data: { items: newCart.items } };
    }

    const existItem = (cart.items as CartItem[]).find((p) => p.productId === item.productId);

    if (existItem) {
      // qty is stored as a string: parse before comparing / incrementing
      const nextQty = Number(existItem.qty) + 1;

      if (product.stock < nextQty) throw new Error('محصول موجود نیست');

      // .find returned the object that lives in cart.items, so mutate it in place
      existItem.qty = String(nextQty);
    } else {
      if (product.stock < 1) throw new Error('محصول موجود نیست');
      cart.items.push(parsed);
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: { items: cart.items, ...calcPrice(cart.items) },
    });

    return { data: { items: cart.items } };
  } catch (error) {
    return toActionError(error, "CART_SAVE_FAILED");
  }
}

export async function removeItemFromCart(key: cartLineKey) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Session not found");

    const parsed = cartLineKeySchema.safeParse(key);
    if (!parsed.success) {
      return toActionError(null, "INVALID_CART_ITEM");
    }

    const cart = await getMyCart();

    // Idempotent: nothing to remove (no cart yet, or the line is already gone)
    if (!cart) return { data: { items: [] } };

    // Drop every line matching productId + selected variant (the Redux key)
    const items = cart.items.filter(
      (line) =>
        line.productId !== parsed.data.productId ||
        (line.color ?? null) !== (parsed.data.color ?? null) ||
        (line.size ?? null) !== (parsed.data.size ?? null),
    );

    if (items.length === cart.items.length) {
      return { data: { items: cart.items } };
    }

    if (items.length === 0) {
      // Empty cart: drop the row — calcPrice would still charge shipping on an empty list
      await prisma.cart.delete({ where: { id: cart.id } });
      return { data: { items: [] } };
    }

    await prisma.cart.update({
      where: { id: cart.id },
      data: { items, ...calcPrice(items) },
    });

    return { data: { items } };
  } catch (error) {
    return toActionError(error, "CART_REMOVE_FAILED");
  }
}

export async function getMyCart() {
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!sessionCartId) throw new Error("Session not found");

  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId },
  });

  if (!cart) return undefined;

  return {
    ...cart,
    items: cart.items as CartItem[],
    itemsPrice: cart.itemsPrice.toString(),
    totalPrice: cart.totalPrice.toString(),
    shippingPrice: cart.shippingPrice.toString(),
  };
}
