import { Eye } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { buttonVariants } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { Order } from "@/generated/prisma/client";
import { Link } from "@/i18n/routing";
import { cn, exportId } from "@/lib/utils";
import { formatDateTime, formatPrice, type Locale } from "@/utils/format";

type Props = {
  orders: Order[];
  locale: Locale;
};

export default async function OrdersTable({ orders, locale }: Props) {
  const t = await getTranslations("order");

  return (
    <div className="overflow-hidden rounded-2xl border bg-white shadow-sm dark:border-white/10 dark:bg-neutral-900">
      <Table>
        <TableHeader className="bg-gray-50 dark:bg-white/5">
          <TableRow>
            <TableHead>{t("orderNumber")}</TableHead>
            <TableHead>{t("placedOn")}</TableHead>
            <TableHead>{t("paymentMethod")}</TableHead>
            <TableHead className="text-end">{t("total")}</TableHead>
            <TableHead className="text-center">{t("status")}</TableHead>
            <TableHead className="text-end">{t("action")}</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const status = order.isDelivered
              ? {
                  label: t("delivered"),
                  className:
                    "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300",
                }
              : order.isPaid
                ? {
                    label: t("paid"),
                    className:
                      "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300",
                  }
                : {
                    label: t("unpaid"),
                    className:
                      "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300",
                  };

            return (
              <TableRow key={order.id}>
                <TableCell
                  className="font-mono font-medium text-gray-900 dark:text-gray-100"
                  title={order.id}
                >
                  {exportId(order.id)}
                </TableCell>
                <TableCell className="text-gray-500 dark:text-gray-400">
                  {formatDateTime(order.createdAt, locale)}
                </TableCell>
                <TableCell>{order.paymentMethod}</TableCell>
                <TableCell className="text-end font-medium tabular-nums">
                  {formatPrice(order.totalPrice, locale)}
                </TableCell>
                <TableCell className="text-center">
                  <span
                    className={cn(
                      "inline-flex rounded-full px-3 py-1 text-xs font-medium",
                      status.className
                    )}
                  >
                    {status.label}
                  </span>
                </TableCell>
                <TableCell className="text-end">
                  <Link
                    href={`/order/${order.id}`}
                    className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
                  >
                    <Eye aria-hidden="true" />
                    {t("viewDetails")}
                  </Link>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
