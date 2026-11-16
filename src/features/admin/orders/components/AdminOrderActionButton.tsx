"use client";

import { useState } from "react";
import { CreditCard, PackageCheck } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/toast";
import {
  deliverOrder,
  updateOrderToPaidCOD,
} from "@/features/admin/orders/actions/orders.action";
import { useRouter } from "@/i18n/routing";

type Props = {
  orderId: string;
  action: "payment" | "delivery";
};

export default function AdminOrderActionButton({ orderId, action }: Props) {
  const t = useTranslations("admin");
  const router = useRouter();
  const [isPending, setIsPending] = useState(false);

  const isPayment = action === "payment";

  const handleClick = async () => {
    setIsPending(true);

    const result = isPayment
      ? await updateOrderToPaidCOD(orderId)
      : await deliverOrder(orderId);

    setIsPending(false);

    if ("error" in result) {
      toast.add({ type: "error", title: result.error.message });
      return;
    }

    toast.add({
      type: "success",
      title: isPayment ? t("paymentUpdated") : t("deliveryUpdated"),
    });
    router.refresh();
  };

  return (
    <Button
      type="button"
      variant={isPayment ? "default" : "outline"}
      onClick={handleClick}
      disabled={isPending}
      className="w-full sm:w-auto"
    >
      {isPayment ? (
        <CreditCard aria-hidden="true" />
      ) : (
        <PackageCheck aria-hidden="true" />
      )}
      {isPending
        ? t("saving")
        : isPayment
          ? t("markAsPaid")
          : t("markAsDelivered")}
    </Button>
  );
}
