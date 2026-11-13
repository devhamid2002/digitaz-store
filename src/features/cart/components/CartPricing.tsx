"use client";

import { useId } from "react";
import { useTranslations } from "next-intl";
import { useRouter } from "@/i18n/routing";
import { formatPrice, type Locale } from "@/utils/format";
import { Button } from "@/components/ui/button";

type CartPricingProps = {
  itemsPrice: string;
  shippingPrice: string;
  totalPrice: string;
  locale: Locale;
  showCheckoutButton?: boolean;
  hasItems?: boolean;
  nextStep?: string;
  // Optional custom action (e.g. placing the final order). When omitted the
  // component navigates to `nextStep`.
  onAction?: () => void;
  actionLabel?: string;
  actionPendingLabel?: string;
  pending?: boolean;
  disabled?: boolean;
  disabledReason?: string;
};

export default function CartPricing({
  itemsPrice,
  shippingPrice,
  totalPrice,
  locale,
  showCheckoutButton = false,
  hasItems = true,
  nextStep,
  onAction,
  actionLabel,
  actionPendingLabel,
  pending = false,
  disabled = false,
  disabledReason,
}: CartPricingProps) {
  const t = useTranslations("cart");
  const router = useRouter();
  const disabledReasonId = useId();
  const hasAction = Boolean(onAction || nextStep);
  const isDisabled = disabled || !hasItems || pending || !hasAction;

  function handleNextStep() {
    if (isDisabled) return;

    if (onAction) {
      onAction();
      return;
    }

    if (nextStep) {
      router.push(nextStep.startsWith("/") ? nextStep : `/${nextStep}`);
    }
  }

  return (
    <aside className="relative overflow-hidden rounded-2xl border border-gray-200/80 bg-linear-to-b from-white to-gray-50/80 shadow-[0_18px_40px_-24px_rgba(15,23,42,0.35)] dark:border-white/10 dark:from-neutral-800/70 dark:to-neutral-900 dark:shadow-[0_18px_40px_-24px_rgba(0,0,0,0.85)] lg:sticky lg:top-6">
      <div
        aria-hidden="true"
        className="h-1 w-full bg-linear-to-r from-brand via-brand-vivid to-brand-ink"
      />

      <div className="p-5">
        <h2 className="mb-4 text-base font-bold text-gray-900 dark:text-gray-100">
          {t("orderSummary")}
        </h2>

        <dl className="space-y-3.5 text-sm">
          <div className="flex items-center justify-between gap-3">
            <dt className="text-gray-500 dark:text-gray-400">
              {t("subtotal")}
            </dt>
            <dd className="font-semibold text-gray-900 tabular-nums dark:text-gray-100">
              {formatPrice(Number(itemsPrice), locale)}
            </dd>
          </div>

          <div className="flex items-center justify-between gap-3">
            <dt className="text-gray-500 dark:text-gray-400">
              {t("shipping")}
            </dt>
            <dd className="font-semibold tabular-nums">
              {Number(shippingPrice) === 0 ? (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
                  <span
                    aria-hidden="true"
                    className="size-1.5 rounded-full bg-current"
                  />
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

        <div
          aria-hidden="true"
          className="my-4 h-px bg-linear-to-r from-transparent via-gray-200 to-transparent dark:via-white/10"
        />

        <div className="flex items-end justify-between gap-3">
          <span className="text-sm font-semibold text-gray-600 dark:text-gray-300">
            {t("total")}
          </span>
          <span className="text-2xl font-extrabold tracking-tight text-brand tabular-nums dark:text-brand-ink">
            {formatPrice(Number(totalPrice), locale)}
          </span>
        </div>

        {/* Hidden once the last line is removed client-side: nothing to check out */}
        {hasItems && showCheckoutButton && (
          <div className="mt-5 space-y-2.5">
            <Button
              type="button"
              onClick={handleNextStep}
              disabled={isDisabled}
              aria-busy={pending || undefined}
              aria-describedby={
                disabled && disabledReason ? disabledReasonId : undefined
              }
              className="flex h-11 w-full items-center justify-center rounded-xl bg-linear-to-r from-brand to-brand-strong px-8 text-[13px] font-bold text-white shadow-lg shadow-brand/25 transition-all hover:from-brand-hover hover:to-brand-strong-hover hover:shadow-xl hover:shadow-brand/30 focus-visible:border-transparent focus-visible:ring-brand/30 disabled:cursor-not-allowed disabled:opacity-50 disabled:shadow-none"
            >
              {pending
                ? (actionPendingLabel ?? t("checkoutPending"))
                : (actionLabel ?? t("checkoutButton"))}
            </Button>

            {disabled && disabledReason && (
              <p
                id={disabledReasonId}
                aria-live="polite"
                className="flex items-start gap-1.5 text-xs leading-5 text-amber-700 dark:text-amber-400"
              >
                <span
                  aria-hidden="true"
                  className="mt-2 size-1.5 shrink-0 rounded-full bg-current"
                />
                {disabledReason}
              </p>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}
