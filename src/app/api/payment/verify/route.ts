import { NextRequest, NextResponse } from "next/server";

import type { PaymentResultStatus } from "@/features/payment/constants/payment.constants";
import { routing } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { zarinpal } from "@/lib/zarinpal";

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const localeParam = searchParams.get("locale");
  const locale =
    localeParam &&
    (routing.locales as readonly string[]).includes(localeParam)
      ? localeParam
      : routing.defaultLocale;

  const redirectToResult = (
    status: PaymentResultStatus,
    orderId?: string | null,
  ) => {
    const url = new URL(`/${locale}/payment-success`, req.url);
    url.searchParams.set("status", status);

    if (orderId) url.searchParams.set("orderId", orderId);

    return NextResponse.redirect(url);
  };

  try {
    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");
    const orderId = searchParams.get("orderId");

    if (!authority || !orderId) {
      return redirectToResult("error", orderId);
    }

    const session = await auth();

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return redirectToResult("notfound", orderId);
    }

    // The callback is only valid for the signed-in owner of the order.
    if (!session?.user?.id || order.userId !== session.user.id) {
      return redirectToResult("error", orderId);
    }

    if (order.isPaid) {
      return redirectToResult("ok", orderId);
    }

    if (status !== "OK") {
      return redirectToResult("canceled", orderId);
    }

    // Only a Zarinpal order may be settled by this callback.
    if (order.paymentMethod !== "Zarinpal") {
      return redirectToResult("error", orderId);
    }

    // The callback must carry the exact authority issued for this order.
    const paymentResult =
      order.paymentResult &&
      typeof order.paymentResult === "object" &&
      !Array.isArray(order.paymentResult)
        ? (order.paymentResult as { authority?: unknown })
        : null;

    if (paymentResult?.authority !== authority) {
      return redirectToResult("error", orderId);
    }

    const result = await zarinpal.PaymentVerification({
      Amount: Number(order.totalPrice),
      Authority: authority,
    });

    if (result.status !== 100 && result.status !== 101) {
      return redirectToResult("failed", orderId);
    }

    // Atomic transition: a concurrent or replayed callback cannot settle the
    // order twice, and the losing caller still reports success.
    await prisma.order.updateMany({
      where: { id: orderId, isPaid: false },
      data: {
        isPaid: true,
        paidAt: new Date(),
        paymentResult: {
          refId: result.refId,
          authority,
          status: result.status,
        },
      },
    });

    return redirectToResult("ok", orderId);
  } catch (error) {
    console.error("Zarinpal verification error:", error);

    return redirectToResult("error", searchParams.get("orderId"));
  }
}
