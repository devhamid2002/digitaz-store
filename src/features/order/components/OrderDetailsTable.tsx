import Image from "next/image";
import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Link } from "@/i18n/routing";
import {
  formatAddress,
  formatDateTime,
  formatPrice,
  type Locale,
} from "@/utils/format";

import type { Order } from "../types/orderType";

type Props = {
  order: Order;
  locale: Locale;
};

export default async function OrderDetailsTable({ order, locale }: Props) {
  const t = await getTranslations("order");

  const {
    id,
    shippingAddress,
    orderitems,
    itemsPrice,
    shippingPrice,
    totalPrice,
    paymentMethod,
    isDelivered,
    isPaid,
    paidAt,
    deliveredAt,
  } = order;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
          {t("detailsTitle")}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("orderNumber")}: <span className="font-medium">{id}</span>
          <span className="mx-2 text-gray-300 dark:text-gray-600">|</span>
          {t("placedOn")}:{" "}
          <span className="font-medium">
            {formatDateTime(order.createdAt, locale)}
          </span>
        </p>
      </div>

      <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="space-y-4">
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold">{t("paymentMethod")}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    isPaid
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {isPaid ? t("paid") : t("unpaid")}
                </span>
              </div>
              <p className="mt-2">{paymentMethod}</p>
              {isPaid && paidAt && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t("paidAt")}: {formatDateTime(paidAt, locale)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-lg font-bold">{t("shippingAddress")}</h2>
                <span
                  className={`rounded-full px-3 py-1 text-xs font-medium ${
                    isDelivered
                      ? "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300"
                      : "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300"
                  }`}
                >
                  {isDelivered ? t("delivered") : t("notDelivered")}
                </span>
              </div>

              {shippingAddress.label && (
                <p className="mt-2 font-medium">{shippingAddress.label}</p>
              )}
              <p className="mt-2">{shippingAddress.fullName}</p>
              <p>
                {formatAddress(shippingAddress, locale)}
              </p>
              <p>{shippingAddress.postalCode}</p>

              {isDelivered && deliveredAt && (
                <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                  {t("deliveredAt")}: {formatDateTime(deliveredAt, locale)}
                </p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4">
              <h2 className="pb-4 text-lg font-bold">{t("items")}</h2>

              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>{t("product")}</TableHead>
                    <TableHead className="text-center">
                      {t("quantity")}
                    </TableHead>
                    <TableHead className="text-end">
                      {t("unitPrice")}
                    </TableHead>
                    <TableHead className="text-end">{t("lineTotal")}</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderitems.map((item) => (
                    <TableRow key={item.productId}>
                      <TableCell>
                        <Link
                          href={`/product/${item.slug}`}
                          className="flex items-center gap-3"
                        >
                          <Image
                            src={item.image}
                            alt={item.name}
                            width={48}
                            height={48}
                            className="h-12 w-12 rounded-md bg-gray-50 object-contain dark:bg-neutral-800"
                          />
                          <span className="font-medium">{item.name}</span>
                        </Link>
                      </TableCell>
                      <TableCell className="text-center tabular-nums">
                        {item.qty}
                      </TableCell>
                      <TableCell className="text-end tabular-nums">
                        {formatPrice(Number(item.price), locale)}
                      </TableCell>
                      <TableCell className="text-end font-medium tabular-nums">
                        {formatPrice(Number(item.price) * item.qty, locale)}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardContent className="space-y-3 p-4 text-sm">
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-500 dark:text-gray-400">
                {t("subtotal")}
              </span>
              <span className="font-medium tabular-nums">
                {formatPrice(itemsPrice, locale)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3">
              <span className="text-gray-500 dark:text-gray-400">
                {t("shipping")}
              </span>
              <span className="font-medium tabular-nums">
                {formatPrice(shippingPrice, locale)}
              </span>
            </div>
            <div className="flex items-center justify-between gap-3 border-t pt-3 font-bold">
              <span>{t("total")}</span>
              <span className="tabular-nums">
                {formatPrice(totalPrice, locale)}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
