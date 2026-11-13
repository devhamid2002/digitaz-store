"use server";

import { cookies } from "next/headers";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toActionError } from "@/utils/actionError";
import type { ActionResult } from "@/utils/actionResult";
import type { CartItem, cartItem, cartLineKey } from "../types/cartType";
import { cartItemSchema, cartLineKeySchema } from "../types/cart.validator";
import { addressFormSchema } from "../types/shipping.validator";
import type { addressForm, savedAddress } from "../types/shippingType";
import { calculateCartTotals } from "../utils/cartPricing";

function sameLine(
  a: { productId: string; color?: string | null; size?: string | null },
  b: { productId: string; color?: string | null; size?: string | null },
) {
  return (
    a.productId === b.productId &&
    (a.color ?? null) === (b.color ?? null) &&
    (a.size ?? null) === (b.size ?? null)
  );
}

function calcPrice(items: CartItem[]) {
  return calculateCartTotals(items);
}

export async function addItemToCart(item: cartItem) {
  try {
    const sessionCartId = (await cookies()).get("sessionCartId")?.value;

    if (!sessionCartId) throw new Error("Session not found");

    const session = await auth();
    const userId = session?.user?.id ? (session.user.id as string) : undefined;

    // Runtime-validate the payload; the caller's type is only a compile-time claim
    const parsed = cartItemSchema.parse(item);
    const requestedQty = Number(parsed.qty);

    if (!Number.isInteger(requestedQty) || requestedQty < 1) {
      return toActionError(null, "INVALID_CART_ITEM");
    }

    // Price and product copy always come from the database, never from the
    // client payload, so a tampered request cannot change what is charged.
    const product = await prisma.product.findUnique({
      where: { id: parsed.productId },
    });

    if (!product) {
      return toActionError(null, "PRODUCT_NOT_FOUND");
    }

    const cart = await getMyCart();
    const line: CartItem = {
      ...parsed,
      name: product.name,
      slug: product.slug,
      image: product.image,
      price: product.price,
      qty: String(requestedQty),
    };

    if (!cart) {
      if (product.stock < requestedQty) {
        return toActionError(null, "PRODUCT_OUT_OF_STOCK");
      }

      const created = await prisma.cart.create({
        data: {
          userId: userId ?? null,
          items: [line],
          sessionCartId,
          ...calcPrice([line]),
        },
      });

      return { data: { items: created.items as CartItem[] } };
    }

    const items = cart.items.map((cartLine) => ({ ...cartLine }));
    const existing = items.find((cartLine) => sameLine(cartLine, line));

    if (existing) {
      const nextQty = Number(existing.qty) + requestedQty;

      if (product.stock < nextQty) {
        return toActionError(null, "PRODUCT_OUT_OF_STOCK");
      }

      existing.qty = String(nextQty);
    } else {
      if (product.stock < requestedQty) {
        return toActionError(null, "PRODUCT_OUT_OF_STOCK");
      }

      items.push(line);
    }

    const updated = await prisma.cart.update({
      where: { id: cart.id },
      data: { items, ...calcPrice(items) },
    });

    return { data: { items: updated.items as CartItem[] } };
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
    const items = cart.items.filter((line) => !sameLine(line, parsed.data));

    if (items.length === cart.items.length) {
      return { data: { items: cart.items } };
    }

    if (items.length === 0) {
      // Empty cart: drop the row — totals should not charge shipping on it
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
  const session = await auth();
  const userId = session?.user?.id ? (session.user.id as string) : undefined;
  const sessionCartId = (await cookies()).get("sessionCartId")?.value;

  if (!userId && !sessionCartId) throw new Error("Session not found");

  const cart = await prisma.cart.findFirst({
    where: userId ? { userId } : { sessionCartId, userId: null },
    orderBy: { createdAt: "desc" },
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

// Delivery addresses of the signed-in user. The session decides whose rows
// are read, so a caller cannot ask for somebody else's address book.
export async function getShippingAddresses(): Promise<ActionResult<savedAddress[]>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return toActionError(null, "AUTH_REQUIRED");

    const addresses = await prisma.address.findMany({
      where: { userId },
      orderBy: [{ isDefault: "desc" }, { createdAt: "desc" }],
    });

    return { data: addresses };
  } catch (error) {
    return toActionError(error, "USER_FETCH_FAILED");
  }
}

export async function createShippingAddress(
  data: addressForm,
  setAsDefault = true,
): Promise<ActionResult<savedAddress>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return toActionError(null, "AUTH_REQUIRED");

    const address = addressFormSchema.parse(data);
    const existingCount = await prisma.address.count({ where: { userId } });
    const makeDefault = setAsDefault || existingCount === 0;

    const created = await prisma.$transaction(async (tx) => {
      if (makeDefault) {
        await tx.address.updateMany({
          where: { userId },
          data: { isDefault: false },
        });
      }

      return tx.address.create({
        data: {
          userId,
          ...address,
          isDefault: makeDefault,
        },
      });
    });

    return { data: created };
  } catch (error) {
    return toActionError(error, "ADDRESS_SAVE_FAILED");
  }
}

export async function updateShippingAddress(
  addressId: string,
  data: addressForm,
): Promise<ActionResult<savedAddress>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return toActionError(null, "AUTH_REQUIRED");

    const address = addressFormSchema.parse(data);
    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) return toActionError(null, "ADDRESS_NOT_FOUND");

    const updated = await prisma.address.update({
      where: { id: existing.id },
      data: address,
    });

    return { data: updated };
  } catch (error) {
    return toActionError(error, "ADDRESS_SAVE_FAILED");
  }
}

export async function selectShippingAddress(
  addressId: string,
): Promise<ActionResult<{ id: string }>> {
  try {
    const session = await auth();
    const userId = session?.user?.id;

    if (!userId) return toActionError(null, "AUTH_REQUIRED");

    const existing = await prisma.address.findFirst({
      where: { id: addressId, userId },
    });

    if (!existing) return toActionError(null, "ADDRESS_NOT_FOUND");

    await prisma.$transaction([
      prisma.address.updateMany({
        where: { userId },
        data: { isDefault: false },
      }),
      prisma.address.update({
        where: { id: existing.id },
        data: { isDefault: true },
      }),
    ]);

    return { data: { id: existing.id } };
  } catch (error) {
    return toActionError(error, "ADDRESS_SAVE_FAILED");
  }
}
