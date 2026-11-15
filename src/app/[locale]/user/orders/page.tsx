import { PackageOpen } from "lucide-react";
import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";

import DynamicPagination from "@/components/shared/components/DynamicPagination";
import { buttonVariants } from "@/components/ui/button";
import { getMyOrders } from "@/features/user/actions/order.action";
import OrdersTable from "@/features/user/components/OrdersTable";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { cn } from "@/lib/utils";
import type { Locale } from "@/utils/format";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function OrdersPage({ params, searchParams }: Props) {
  const [{ locale }, query, t, session] = await Promise.all([
    params,
    searchParams,
    getTranslations("order"),
    auth(),
  ]);

  if (!session?.user?.id) redirect(`/${locale}/auth/sign-in`);

  const pageParam = Array.isArray(query.page) ? query.page[0] : query.page;
  const requestedPage = Number(pageParam);
  const page =
    Number.isInteger(requestedPage) && requestedPage > 0 ? requestedPage : 1;

  const ordersResult = await getMyOrders({ page });

  if ("error" in ordersResult) {
    return (
      <main className="mx-auto w-full max-w-5xl">
        <div className="mb-6">
          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
            {t("myOrders")}
          </h1>
          <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
            {t("myOrdersSubtitle")}
          </p>
        </div>

        <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-8 text-sm text-destructive">
          {ordersResult.error.message}
        </div>
      </main>
    );
  }

  const { data: orders, totalPages } = ordersResult;

  if (totalPages > 0 && page > totalPages) {
    redirect(`/${locale}/user/orders?page=${totalPages}`);
  }

  return (
    <main className="mx-auto w-full max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
          {t("myOrders")}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("myOrdersSubtitle")}
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-white/10">
          <PackageOpen
            aria-hidden="true"
            className="size-10 text-gray-400 dark:text-gray-500"
          />
          <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            {t("noOrders")}
          </h2>
          <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
            {t("noOrdersHint")}
          </p>
          <Link href="/" className={cn(buttonVariants({ size: "sm" }))}>
            {t("browseProducts")}
          </Link>
        </div>
      ) : (
        <>
          <OrdersTable orders={orders} locale={locale as Locale} />

          <div className="mt-6">
            <DynamicPagination
              currentPage={page}
              totalPages={totalPages}
              basePath="/user/orders"
              query={query}
              labels={{
                pagination: t("paginationLabel"),
                previous: t("previous"),
                next: t("next"),
                more: t("morePages"),
                page: t("pageLabel"),
              }}
            />
          </div>
        </>
      )}
    </main>
  );
}
