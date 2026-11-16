"use client";

import { useTranslations } from "next-intl";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { formatPrice, type Locale } from "@/utils/format";
import type { SalesDataType } from "../types/OrdersTypes";

type Props = {
  data: SalesDataType[];
  locale: Locale;
};

// Recharts renders SVG with its own coordinate system, so the chart stays LTR
// even on the RTL (Persian) page.
export default function SalesOverviewChart({ data, locale }: Props) {
  const t = useTranslations("admin");
  const numberLocale = locale === "fa" ? "fa-IR" : "en-US";

  if (data.length === 0) {
    return (
      <div className="flex h-[300px] items-center justify-center text-sm text-muted-foreground">
        {t("noSalesData")}
      </div>
    );
  }

  const formatAxisTick = (value: number) =>
    new Intl.NumberFormat(numberLocale, {
      notation: "compact",
      maximumFractionDigits: 1,
    }).format(value);

  return (
    <div className="h-[300px] w-full" dir="ltr">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 8, right: 8, left: 0, bottom: 0 }}>
          <CartesianGrid
            vertical={false}
            stroke="var(--border)"
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="month"
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
          />
          <YAxis
            width={72}
            tickLine={false}
            axisLine={false}
            tick={{ fill: "var(--muted-foreground)", fontSize: 12 }}
            tickFormatter={formatAxisTick}
          />
          <Tooltip
            cursor={{ fill: "var(--muted)", opacity: 0.4 }}
            contentStyle={{
              backgroundColor: "var(--popover)",
              border: "1px solid var(--border)",
              borderRadius: "var(--radius-md)",
              color: "var(--popover-foreground)",
              fontSize: 12,
            }}
            labelStyle={{ color: "var(--muted-foreground)" }}
            formatter={(value) => [
              formatPrice(Number(value), locale),
              t("sales"),
            ]}
          />
          <Bar
            dataKey="totalSales"
            fill="var(--chart-2)"
            radius={[6, 6, 0, 0]}
            maxBarSize={64}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
