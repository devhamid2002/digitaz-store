"use server";

import ZarinpalCheckout from "zarinpal-checkout";

import { getOrderById } from "@/features/order/action/order.action";
import { toActionError } from "@/utils/actionError";
import type { ActionResult } from "@/utils/actionResult";
import { fetchInstance } from "@/utils/fetchInstance";
import type { Locale } from "@/utils/format";

import { isPaymentMethods, type PaymentMethods } from "../types/paymentType";

// zarinpal-checkout v1.1.1 requires a 36-character merchant id; the sandbox
// accepts any valid UUID. Production can override it with ZARINPAL_MERCHANT_ID.
const ZARINPAL_MERCHANT_ID =
  process.env.ZARINPAL_MERCHANT_ID ||
  "00000000-0000-0000-0000-000000000000";

const ZARINPAL_BASE_URL =
  process.env.NEXT_PUBLIC_BASE_URL ||
  process.env.NEXTAUTH_URL ||
  "http://localhost:3000";

const zarinpal = ZarinpalCheckout.create(ZARINPAL_MERCHANT_ID, true);

export async function requestZarinpalPayment(
  orderId: string,
  locale: Locale,
): Promise<ActionResult<{ url: string }>> {
  try {
    const order = await getOrderById(orderId);

    if (!order) return toActionError(null, "ORDER_NOT_FOUND");

    const callbackUrl = new URL("/api/payment/verify", ZARINPAL_BASE_URL);
    callbackUrl.searchParams.set("orderId", order.id);
    callbackUrl.searchParams.set("locale", locale);

    const response = await zarinpal.PaymentRequest({
      Amount: order.totalPrice,
      CallbackURL: callbackUrl.toString(),
      Description: `Order ${order.id}`,
      Email: order.user?.email ?? undefined,
    });

    if (response.status !== 100 || !response.url) {
      return toActionError(null, "PAYMENT_REQUEST_FAILED");
    }

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
