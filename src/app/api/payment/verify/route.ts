
import { prisma } from "@/lib/prisma";
import ZarinpalCheckout from "zarinpal-checkout";
import { NextRequest, NextResponse } from "next/server";

const ZARINPAL_MERCHANT_ID = "TEST";

const zarinpal = ZarinpalCheckout.create(ZARINPAL_MERCHANT_ID, true);

export async function GET(req: NextRequest) {
  try {
    const searchParams = req.nextUrl.searchParams;

    const authority = searchParams.get("Authority");
    const status = searchParams.get("Status");
    const orderId = searchParams.get("OrderId");

    const redirect = (result: string) =>
      NextResponse.redirect(
        new URL(`/payment-success?status=${result}`, req.url)
      );

    if (!authority || !orderId) {
      return redirect("error");
    }

    const order = await prisma.order.findUnique({
      where: { id: orderId },
    });

    if (!order) {
      return redirect("notfound");
    }

    if (order.isPaid) {
      return redirect("ok");
    }

    if (status !== "OK") {
      return redirect("canceled");
    }

    const result = await zarinpal.PaymentVerification({
      Amount: Number(order.totalPrice),
      Authority: authority,
    });

    if (result.status !== 100) {
      return redirect("failed");
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

    return redirect("ok");
  } catch (error) {
    console.error("Zarinpal verification error:", error);

    return NextResponse.redirect(
      new URL("/payment-success?status=error", req.url)
    );
  }
}
