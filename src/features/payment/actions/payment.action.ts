"use server";

import { getOrderById } from "@/features/order/action/order.action";
import { prisma } from "@/lib/prisma";
import { zarinpal } from "@/lib/zarinpal";
import { toActionError } from "@/utils/actionError";
import type { ActionResult } from "@/utils/actionResult";
import { fetchInstance } from "@/utils/fetchInstance";
import type { Locale } from "@/utils/format";

import { isPaymentMethods, type PaymentMethods } from "../types/paymentType";

// The gateway callback is opened by the buyer's browser, so it must use the
// public production domain rather than the (possibly protected) deployment host.
const VERCEL_PUBLIC_URL = process.env.VERCEL_PROJECT_PRODUCTION_URL
  ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
  : process.env.VERCEL_URL
  ? `https://${process.env.VERCEL_URL}`
  : "http://localhost:3000";

const ZARINPAL_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXTAUTH_URL ||
  VERCEL_PUBLIC_URL;

export async function requestZarinpalPayment(
  orderId: string,
  locale: Locale,
): Promise<ActionResult<{ url: string }>> {
  try {
    const order = await getOrderById(orderId);

    if (!order) return toActionError(null, "ORDER_NOT_FOUND");

    // Never start a second gateway session for a settled order or for an
    // order that was not placed with Zarinpal.
    if (order.isPaid) {
      return toActionError(null, "PAYMENT_REQUEST_FAILED");
    }

    if (order.paymentMethod !== "Zarinpal") {
      return toActionError(null, "PAYMENT_REQUEST_FAILED");
    }

    const callbackUrl = new URL("/api/payment/verify", ZARINPAL_BASE_URL);
    callbackUrl.searchParams.set("orderId", order.id);
    callbackUrl.searchParams.set("locale", locale);

    const response = await zarinpal.PaymentRequest({
      Amount: order.totalPrice,
      CallbackURL: callbackUrl.toString(),
      Description: `Order ${order.id}`,
      Email: order.user?.email ?? undefined,
    });

    if (response.status !== 100 || !response.url || !response.authority) {
      return toActionError(null, "PAYMENT_REQUEST_FAILED");
    }

    // Persist the authority issued for this order. Verification only accepts
    // a callback whose Authority matches this stored value.
    await prisma.order.update({
      where: { id: order.id },
      data: {
        paymentResult: {
          authority: response.authority,
          status: "PENDING",
        },
      },
    });

    return { data: { url: response.url } };
  } catch (error) {
    console.error("Failed to request Zarinpal payment:", error);
    return toActionError(error, "PAYMENT_REQUEST_FAILED");
  }
}

export async function getPayment(): Promise<ActionResult<PaymentMethods>> {
  try {
    const response = await fetchInstance<PaymentMethods>("/api/payment");

    if (!isPaymentMethods(response)) {
      return toActionError(null, "PAYMENT_FETCH_FAILED");
    }

    return { data: response };
  } catch (error) {
    console.error("Failed to fetch payment:", error);
    return toActionError(error, "PAYMENT_FETCH_FAILED");
  }
}
