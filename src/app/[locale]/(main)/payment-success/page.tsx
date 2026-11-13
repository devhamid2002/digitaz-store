import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { getOrderById } from "@/features/order/action/order.action";
import {
  isPaymentResultStatus,
  type PaymentResultStatus,
} from "@/features/payment/constants/payment.constants";
import { Link } from "@/i18n/routing";
import { formatPrice, type Locale } from "@/utils/format";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{
    status?: string | string[];
    orderId?: string | string[];
  }>;
};

const RESULT_MESSAGE_KEYS: Record<
  PaymentResultStatus,
  { title: string; description: string }
> = {
  ok: {
    title: "successTitle",
    description: "successDescription",
  },
  canceled: {
    title: "canceledTitle",
    description: "canceledDescription",
  },
  failed: {
    title: "failedTitle",
    description: "failedDescription",
  },
  notfound: {
    title: "notFoundTitle",
    description: "notFoundDescription",
  },
  error: {
    title: "errorTitle",
    description: "errorDescription",
  },
};

const PRIMARY_LINK_CLASS =
  "flex h-11 items-center justify-center rounded-xl bg-gray-900 px-8 text-[13px] font-bold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100";

const SECONDARY_LINK_CLASS =
  "flex h-11 items-center justify-center rounded-xl border border-gray-300 px-8 text-[13px] font-bold text-gray-900 transition-colors hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800";

export default async function PaymentSuccessPage({
  params,
  searchParams,
}: Props) {
  const [{ locale }, query, t, tc, to] = await Promise.all([
    params,
    searchParams,
    getTranslations("paymentSuccess"),
    getTranslations("cart"),
    getTranslations("order"),
  ]);

  const statusParam =
    typeof query.status === "string" ? query.status : undefined;
  const status: PaymentResultStatus = isPaymentResultStatus(statusParam)
    ? statusParam
    : "error";

  const orderId =
    typeof query.orderId === "string" ? query.orderId : undefined;
  const order = orderId ? await getOrderById(orderId) : null;

  const result = RESULT_MESSAGE_KEYS[status];
  const isSuccess = status === "ok";
  const isCanceled = status === "canceled";

  const Icon = isSuccess ? CircleCheck : isCanceled ? TriangleAlert : CircleX;
  const iconClass = isSuccess
    ? "text-green-600 dark:text-green-400"
    : isCanceled
      ? "text-amber-600 dark:text-amber-400"
      : "text-red-600 dark:text-red-400";

  return (
    <main className="mx-auto my-4 w-full max-w-7xl">
      <div className="mx-auto flex max-w-2xl flex-col items-center gap-4 rounded-2xl px-4 py-16 text-center shadow dark:bg-neutral-900 sm:px-6">
        <Icon size={48} strokeWidth={1.5} className={iconClass} />

        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
          {t(result.title)}
        </h1>

        <p className="max-w-xl text-sm text-gray-500 dark:text-gray-400">
          {t(result.description)}
        </p>

        {order && (
          <dl className="mt-2 w-full max-w-md space-y-3 rounded-xl border border-gray-200 p-4 text-start text-sm dark:border-gray-700">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <dt className="text-gray-500 dark:text-gray-400">
                {to("orderNumber")}
              </dt>
              <dd className="max-w-full break-all font-medium">{order.id}</dd>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <dt className="text-gray-500 dark:text-gray-400">
                {to("paymentMethod")}
              </dt>
              <dd className="font-medium">{order.paymentMethod}</dd>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-2">
              <dt className="text-gray-500 dark:text-gray-400">
                {to("total")}
              </dt>
              <dd className="font-medium tabular-nums">
                {formatPrice(order.totalPrice, locale as Locale)}
              </dd>
            </div>
          </dl>
        )}

        <div className="mt-2 flex w-full flex-col items-center justify-center gap-3 sm:w-auto sm:flex-row">
          {order && (
            <Link
              href={`/order/${order.id}`}
              className={PRIMARY_LINK_CLASS}
            >
              {t("viewOrder")}
            </Link>
          )}

          <Link
            href="/"
            className={order ? SECONDARY_LINK_CLASS : PRIMARY_LINK_CLASS}
          >
            {tc("continueShopping")}
          </Link>
        </div>
      </div>
    </main>
  );
}
