"use client";

import { useState, type MouseEvent } from "react";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { toast } from "@/components/ui/toast";
import { deleteOrder } from "@/features/admin/orders/actions/orders.action";
import { Link, useRouter } from "@/i18n/routing";
import { exportId } from "@/lib/utils";
import { formatDateTime, formatPrice, type Locale } from "@/utils/format";

type AdminOrderRow = {
  id: string;
  createdAt: Date;
  totalPrice: number;
  isPaid: boolean;
  isDelivered: boolean;
  user: { name: string } | null;
};

type Props = {
  orders: AdminOrderRow[];
  locale: Locale;
};

export default function AdminOrdersTable({ orders, locale }: Props) {
  const t = useTranslations("admin");
  const tOrder = useTranslations("order");
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const handleDelete = async (
    event: MouseEvent<HTMLButtonElement>,
    orderId: string,
  ) => {
    event.stopPropagation();

    if (!window.confirm(t("deleteConfirm"))) return;

    setDeletingId(orderId);
    const result = await deleteOrder(orderId);
    setDeletingId(null);

    if ("error" in result) {
      toast.add({ type: "error", title: result.error.message });
      return;
    }

    toast.add({ type: "success", title: t("orderDeleted") });
    router.refresh();
  };

  return (
    <div className="overflow-hidden rounded-xl border bg-card">
      <Table>
        <TableHeader className="bg-muted/50">
          <TableRow>
            <TableHead>{tOrder("orderNumber")}</TableHead>
            <TableHead>{t("customer")}</TableHead>
            <TableHead>{tOrder("placedOn")}</TableHead>
            <TableHead className="text-end">{tOrder("total")}</TableHead>
            <TableHead>{t("payment")}</TableHead>
            <TableHead>{t("delivery")}</TableHead>
            <TableHead className="text-end">
              <span className="sr-only">{t("actions")}</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => {
            const href = `/admin/orders/${order.id}`;

            return (
              <TableRow
                key={order.id}
                className="cursor-pointer"
                onClick={() => router.push(href)}
              >
                <TableCell className="font-mono font-medium" title={order.id}>
                  <Link
                    href={href}
                    className="hover:underline"
                    onClick={(event) => event.stopPropagation()}
                  >
                    {exportId(order.id)}
                  </Link>
                </TableCell>
                <TableCell>{order.user?.name ?? "—"}</TableCell>
                <TableCell className="text-muted-foreground">
                  {formatDateTime(order.createdAt, locale)}
                </TableCell>
                <TableCell className="text-end font-medium tabular-nums">
                  {formatPrice(order.totalPrice, locale)}
                </TableCell>
                <TableCell>
                  <Badge variant={order.isPaid ? "default" : "secondary"}>
                    {order.isPaid ? tOrder("paid") : tOrder("unpaid")}
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={order.isDelivered ? "default" : "secondary"}>
                    {order.isDelivered
                      ? tOrder("delivered")
                      : tOrder("notDelivered")}
                  </Badge>
                </TableCell>
                <TableCell className="text-end">
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon-sm"
                    className="text-destructive hover:bg-destructive/10 hover:text-destructive"
                    aria-label={t("deleteOrder")}
                    title={t("deleteOrder")}
                    disabled={deletingId === order.id}
                    onClick={(event) => handleDelete(event, order.id)}
                  >
                    <Trash2 aria-hidden="true" />
                  </Button>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}
