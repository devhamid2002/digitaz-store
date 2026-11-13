import { notFound } from "next/navigation";

import OrderDetailsTable from "@/features/order/components/OrderDetailsTable";
import { getOrderById } from "@/features/order/action/order.action";
import type { Locale } from "@/utils/format";

type Props = {
  params: Promise<{ locale: string; id: string }>;
};

export default async function OrderDetailsPage({ params }: Props) {
  const { locale, id } = await params;

  const order = await getOrderById(id);

  if (!order) notFound();

  return (
    <main className="mx-auto my-4 w-full max-w-7xl">
      <div className="mx-auto rounded-2xl px-4 py-8 shadow dark:bg-neutral-900">
        <OrderDetailsTable order={order} locale={locale as Locale} />
      </div>
    </main>
  );
}
