import { Package, ShoppingBag, Users, Wallet } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { getOrderSummery } from "@/features/admin/orders/actions/orders.action";
import SalesOverviewChart from "@/features/admin/orders/components/SalesOverviewChart";
import { exportId } from "@/lib/utils";
import { formatDateTime, formatPrice, type Locale } from "@/utils/format";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function AdminOverviewPage({ params }: Props) {
  const [{ locale }, t, tOrder] = await Promise.all([
    params,
    getTranslations("admin"),
    getTranslations("order"),
  ]);

  const typedLocale = locale as Locale;
  const summary = await getOrderSummery();
  const totalSales = summary.totalSales._sum.totalPrice ?? 0;
  const countFormatter = new Intl.NumberFormat(
    typedLocale === "fa" ? "fa-IR" : "en-US",
  );

  const stats = [
    {
      label: t("totalOrders"),
      value: countFormatter.format(summary.ordersCount),
      icon: ShoppingBag,
    },
    {
      label: t("totalProducts"),
      value: countFormatter.format(summary.productsCount),
      icon: Package,
    },
    {
      label: t("totalCustomers"),
      value: countFormatter.format(summary.usersCount),
      icon: Users,
    },
    {
      label: t("totalSales"),
      value: formatPrice(totalSales, typedLocale),
      icon: Wallet,
    },
  ];

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("overviewTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("overviewSubtitle")}
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} size="sm">
            <CardContent className="flex items-center justify-between gap-4">
              <div className="min-w-0">
                <p className="text-sm text-muted-foreground">{stat.label}</p>
                <p className="mt-1 truncate text-xl font-semibold tabular-nums">
                  {stat.value}
                </p>
              </div>
              <div className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <stat.icon aria-hidden="true" className="size-5" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>{t("salesChartTitle")}</CardTitle>
          <CardDescription>{t("salesChartDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          <SalesOverviewChart
            data={summary.SalesData}
            locale={typedLocale}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t("latestOrdersTitle")}</CardTitle>
          <CardDescription>{t("latestOrdersDescription")}</CardDescription>
        </CardHeader>
        <CardContent>
          {summary.latesSales.length === 0 ? (
            <p className="py-8 text-center text-sm text-muted-foreground">
              {t("noOrders")}
            </p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>{tOrder("orderNumber")}</TableHead>
                  <TableHead>{t("customer")}</TableHead>
                  <TableHead>{tOrder("placedOn")}</TableHead>
                  <TableHead className="text-end">{tOrder("total")}</TableHead>
                  <TableHead className="text-center">
                    {tOrder("status")}
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {summary.latesSales.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell className="font-mono" title={order.id}>
                      {exportId(order.id)}
                    </TableCell>
                    <TableCell>{order.user?.name ?? "—"}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {formatDateTime(order.createdAt, typedLocale)}
                    </TableCell>
                    <TableCell className="text-end font-medium tabular-nums">
                      {formatPrice(order.totalPrice, typedLocale)}
                    </TableCell>
                    <TableCell className="text-center">
                      <Badge variant={order.isPaid ? "default" : "secondary"}>
                        {order.isPaid ? tOrder("paid") : tOrder("unpaid")}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </main>
  );
}
