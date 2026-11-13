"use server";

import type { CartItem } from "@/features/cart/types/cartType";
import {
  getMyCart,
  getShippingAddresses,
} from "@/features/cart/actions/cart.action";
import { shippingAddressSchema } from "@/features/cart/types/shipping.validator";
import { calculateCartTotals } from "@/features/cart/utils/cartPricing";
import {
  isValidPaymentMethod,
} from "@/features/payment/constants/payment.constants";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { toActionError } from "@/utils/actionError";
import type { Order } from "../types/orderType";

class CheckoutError extends Error {
  constructor(readonly code: string) {
    super(code);
    this.name = "CheckoutError";
  }
}

// The order is the source of truth for what is charged: prices, names and
// stock are re-read inside the transaction instead of trusting the cart
// snapshot or the client.
export async function createOrder(paymentMethod: string) {
  try {
    const session = await auth();

    if (!session?.user?.id) {
      return toActionError(null, "AUTH_REQUIRED");
    }

    if (!isValidPaymentMethod(paymentMethod)) {
      return toActionError(null, "PAYMENT_REQUIRED");
    }

    const cart = await getMyCart().catch(() => undefined);

    if (!cart || cart.items.length === 0) {
      return toActionError(null, "CART_EMPTY");
    }

    const addressesResult = await getShippingAddresses();

    if ("error" in addressesResult) return addressesResult;

    const address =
      addressesResult.data.find((item) => item.isDefault) ??
      addressesResult.data[0];

    if (!address) {
      return toActionError(null, "ADDRESS_REQUIRED");
    }

    const shippingAddress = shippingAddressSchema.safeParse(address);

    if (!shippingAddress.success) {
      return toActionError(null, "ADDRESS_INVALID");
    }

    const insertedOrderId = await prisma.$transaction(async (tx) => {
      const currentCart = await tx.cart.findUnique({
        where: { id: cart.id },
      });

      if (!currentCart) throw new CheckoutError("CART_EMPTY");

      // The cart was loaded through the session, but re-check ownership inside
      // the transaction so a stale id can never order someone else's cart.
      if (currentCart.userId !== session.user.id) {
        throw new CheckoutError("AUTH_REQUIRED");
      }

      const cartItems = Array.isArray(currentCart.items)
        ? (currentCart.items as CartItem[])
        : [];

      if (cartItems.length === 0) throw new CheckoutError("CART_EMPTY");

      // OrderItem is keyed by (orderId, productId), so variant lines of the
      // same product are combined into one ordered quantity.
      const quantities = new Map<string, number>();

      for (const item of cartItems) {
        const qty = Number(item.qty);

        if (!Number.isInteger(qty) || qty <= 0) {
          throw new CheckoutError("CART_INVALID");
        }

        quantities.set(
          item.productId,
          (quantities.get(item.productId) ?? 0) + qty,
        );
      }

      const products = await tx.product.findMany({
        where: { id: { in: [...quantities.keys()] } },
      });
      const productById = new Map(
        products.map((product) => [product.id, product]),
      );
      const orderItems = [];

      for (const [productId, qty] of quantities) {
        const product = productById.get(productId);

        if (!product) throw new CheckoutError("PRODUCT_NOT_FOUND");

        if (product.stock < qty) {
          throw new CheckoutError("PRODUCT_OUT_OF_STOCK");
        }

        orderItems.push({
          productId,
          name: product.name,
          slug: product.slug,
          image: product.image,
          price: product.price,
          qty,
        });
      }

      const totals = calculateCartTotals(orderItems);

      const order = await tx.order.create({
        data: {
          userId: session.user.id,
          shippingAddress: shippingAddress.data,
          paymentMethod,
          ...totals,
        },
      });

      await tx.orderItem.createMany({
        data: orderItems.map((item) => ({
          ...item,
          orderId: order.id,
        })),
      });

      for (const item of orderItems) {
        const updated = await tx.product.updateMany({
          where: {
            id: item.productId,
            stock: { gte: item.qty },
          },
          data: {
            stock: { decrement: item.qty },
          },
        });

        // Another checkout may have taken the stock between our read and
        // write; roll back the whole order instead of overselling.
        if (updated.count !== 1) {
          throw new CheckoutError("PRODUCT_OUT_OF_STOCK");
        }
      }

      // The cart becomes the order: remove the row so the next visit starts empty
      await tx.cart.delete({ where: { id: cart.id } });

      return order.id;
    });

    return { data: { orderId: insertedOrderId } };
  } catch (error) {
    if (error instanceof CheckoutError) {
      return toActionError(null, error.code);
    }

    console.error("Failed to create order:", error);
    return toActionError(error, "CREATE_ORDER_FAILED");
  }
}

export async function getOrderById(orderId: string): Promise<Order | null> {
  const session = await auth();

  if (!session?.user?.id) return null;

  const order = await prisma.order.findFirst({
    where: {
      id: orderId,
      userId: session.user.id,
    },
    include: {
      orderitems: true,
      user: { select: { name: true, email: true } },
    },
  });

  return (order as Order | null) ?? null;
}
