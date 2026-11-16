import { PackageOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import DynamicPagination from "@/components/shared/components/DynamicPagination";
import { getAllOrders } from "@/features/admin/orders/actions/orders.action";
import AdminOrdersTable from "@/features/admin/orders/components/AdminOrdersTable";
import type { Locale } from "@/utils/format";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function AdminOrdersPage({ params, searchParams }: Props) {
  const [{ locale }, query, t, tOrder] = await Promise.all([
    params,
    searchParams,
    getTranslations("admin"),
    getTranslations("order"),
  ]);

  const pageParam = Array.isArray(query.page) ? query.page[0] : query.page;
  const requestedPage = Number(pageParam);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const { data: orders, totalPage } = await getAllOrders({ page });

  if (totalPage > 0 && page > totalPage) {
    redirect(`/${locale}/admin/orders?page=${totalPage}`);
  }

  return (
    <main className="mx-auto w-full max-w-6xl space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">
          {t("ordersTitle")}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          {t("ordersSubtitle")}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-xl border border-dashed px-6 py-16 text-center">
          <PackageOpen
            aria-hidden="true"
            className="size-10 text-muted-foreground"
          />
          <h2 className="text-lg font-semibold">{t("noOrders")}</h2>
          <p className="max-w-md text-sm text-muted-foreground">
            {t("noOrdersHint")}
          </p>
        </div>
      ) : (
        <>
          <AdminOrdersTable
            orders={orders}
            locale={locale as Locale}
          />

          <DynamicPagination
            currentPage={page}
            totalPages={totalPage}
            basePath="/admin/orders"
            query={query}
            labels={{
              pagination: tOrder("paginationLabel"),
              previous: tOrder("previous"),
              next: tOrder("next"),
              more: tOrder("morePages"),
              page: tOrder("pageLabel"),
            }}
          />
        </>
      )}
    </main>
  );
}
