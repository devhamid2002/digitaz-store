"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { formatPrice, type Locale } from "@/utils/format";

type CartPricingProps = {
  itemsPrice: string;
  shippingPrice: string;
  totalPrice: string;
  locale: Locale;
  showCheckoutButton?: boolean;
  hasItems?: boolean;
};

export default function CartPricing({
  itemsPrice,
  shippingPrice,
  totalPrice,
  locale,
  showCheckoutButton = false,
  hasItems = true,
}: CartPricingProps) {
  const t = useTranslations("cart");

  return (
    <aside className="rounded-xl border border-gray-200 p-5 dark:border-gray-700 lg:sticky lg:top-6">
      <dl className="space-y-3 text-sm">
        <div className="flex items-center justify-between gap-3">
          <dt className="text-gray-500 dark:text-gray-400">
            {t("subtotal")}
          </dt>
          <dd className="font-medium text-gray-900 tabular-nums dark:text-gray-100">
            {formatPrice(Number(itemsPrice), locale)}
          </dd>
        </div>

        <div className="flex items-center justify-between gap-3">
          <dt className="text-gray-500 dark:text-gray-400">
            {t("shipping")}
          </dt>
          <dd className="font-medium tabular-nums">
            {Number(shippingPrice) === 0 ? (
              <span className="text-green-600 dark:text-green-400">
                {t("free")}
              </span>
            ) : (
              <span className="text-gray-900 dark:text-gray-100">
                {formatPrice(Number(shippingPrice), locale)}
              </span>
            )}
          </dd>
        </div>
      </dl>

      <hr className="my-4 border-gray-200 dark:border-gray-700" />

      <div className="flex items-center justify-between gap-3">
        <span className="text-sm font-bold text-gray-900 dark:text-gray-100">
          {t("total")}
        </span>
        <span className="text-xl font-bold text-brand tabular-nums dark:text-brand-ink">
          {formatPrice(Number(totalPrice), locale)}
        </span>
      </div>

      {/* Hidden once the last line is removed client-side: nothing to check out */}
      {hasItems && showCheckoutButton && (
        <Link
          href="/shipping"
          className="mt-4 flex h-11 items-center justify-center rounded-xl bg-gray-900 px-8 text-[13px] font-bold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
        >
          {t("checkoutButton")}
        </Link>
      )}
    </aside>
  );
}
