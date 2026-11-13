"use client";

import { useTransition } from "react";
import { useTranslations } from "next-intl";
import { toast } from "@/components/ui/toast";
import CartPricing from "@/features/cart/components/CartPricing";
import { requestZarinpalPayment } from "@/features/payment/actions/payment.action";
import type { PaymentMethod } from "@/features/payment/constants/payment.constants";
import { setItems } from "@/context/slices/cartSlice";
import { useAppDispatch } from "@/context/hooks";
import { useRouter } from "@/i18n/routing";
import type { Locale } from "@/utils/format";

import { createOrder } from "../action/order.action";

type Props = {
  itemsPrice: string;
  shippingPrice: string;
  totalPrice: string;
  locale: Locale;
  paymentMethod: PaymentMethod;
};

export default function OrderSummary({
  itemsPrice,
  shippingPrice,
  totalPrice,
  locale,
  paymentMethod,
}: Props) {
  const t = useTranslations("order");
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [isPending, startTransition] = useTransition();

  const handlePlaceOrder = () => {
    if (isPending) return;

    startTransition(async () => {
      const result = await createOrder(paymentMethod);

      if ("error" in result) {
        toast.add({ type: "error", title: result.error.message });
        return;
      }

      const { orderId } = result.data;

      // The server cart was consumed by the order.
      dispatch(setItems([]));

      if (paymentMethod !== "Zarinpal") {
        toast.add({ type: "success", title: t("placed") });
        router.push(`/order/${orderId}`);
        return;
      }

      const payment = await requestZarinpalPayment(orderId, locale);

      if ("error" in payment) {
        toast.add({ type: "error", title: payment.error.message });
        router.push(`/order/${orderId}`);
        return;
      }

      window.location.assign(payment.data.url);
    });
  };

  return (
    <CartPricing
      itemsPrice={itemsPrice}
      shippingPrice={shippingPrice}
      totalPrice={totalPrice}
      locale={locale}
      showCheckoutButton
      onAction={handlePlaceOrder}
      pending={isPending}
      actionLabel={t("placeOrder")}
      actionPendingLabel={t("placingOrder")}
    />
  );
}
