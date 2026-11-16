import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { notFound } from "next/navigation";

import { getOrderById } from "@/features/admin/orders/actions/orders.action";
import AdminOrderActionButton from "@/features/admin/orders/components/AdminOrderActionButton";
import OrderDetailsTable from "@/features/order/components/OrderDetailsTable";
import { Link } from "@/i18n/routing";
import type { Locale } from "@/utils/format";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function AdminOrderDetailsPage({ params }: Props) {
  const [{ locale, id }, t] = await Promise.all([
    params,
    getTranslations("admin"),
  ]);

  const order = await getOrderById(id);

  if (!order) notFound();

  const typedLocale = locale as Locale;

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6">
      <Link
        href="/admin/orders"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft aria-hidden="true" className="size-4 rtl:rotate-180" />
        {t("backToOrders")}
      </Link>

      <OrderDetailsTable
        order={order}
        locale={typedLocale}
        paymentAction={
          order.isPaid ? null : (
            <AdminOrderActionButton orderId={order.id} action="payment" />
          )
        }
        deliveryAction={
          order.isDelivered ? null : (
            <AdminOrderActionButton orderId={order.id} action="delivery" />
          )
        }
      />
    </main>
  );
}
