import { NextRequest, NextResponse } from "next/server";
import ZarinpalCheckout from "zarinpal-checkout";

import type { PaymentResultStatus } from "@/features/payment/constants/payment.constants";
import { routing } from "@/i18n/routing";
import { prisma } from "@/lib/prisma";

// zarinpal-checkout v1.1.1 requires a 36-character merchant id; the sandbox
// accepts any valid UUID. Production can override it with ZARINPAL_MERCHANT_ID.
const ZARINPAL_MERCHANT_ID =
  process.env.ZARINPAL_MERCHANT_ID ||
  "00000000-0000-0000-0000-000000000000";

const zarinpal = ZarinpalCheckout.create(ZARINPAL_MERCHANT_ID, true);

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

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return redirectToResult("notfound", orderId);
    }

    if (order.isPaid) {
      return redirectToResult("ok", orderId);
    }

    if (status !== "OK") {
      return redirectToResult("canceled", orderId);
    }

    const result = await zarinpal.PaymentVerification({
      Amount: Number(order.totalPrice),
      Authority: authority,
    });

    if (result.status !== 100 && result.status !== 101) {
      return redirectToResult("failed", orderId);
    }

    await prisma.order.update({
      where: { id: orderId },
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
