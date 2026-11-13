import { Check } from "lucide-react";
import { getTranslations } from "next-intl/server";

type CheckoutStep = 1 | 2 | 3 | 4;

type Props = {
  currentStep: CheckoutStep;
};

const STEPS = [
  { step: 1, key: "cart" },
  { step: 2, key: "shipping" },
  { step: 3, key: "payment" },
  { step: 4, key: "review" },
] as const;

export default async function CheckoutSteps({ currentStep }: Props) {
  const t = await getTranslations("checkout");

  return (
    <nav
      aria-label={t("stepsLabel")}
      className="rounded-2xl border border-gray-200/80 bg-white/70 p-3.5 shadow-[0_10px_30px_-24px_rgba(15,23,42,0.4)] sm:p-5 dark:border-white/10 dark:bg-white/[0.03]"
    >
      <ol className="flex items-center">
        {STEPS.map(({ step, key }, index) => {
          const isDone = step < currentStep;
          const isCurrent = step === currentStep;
          const isLast = index === STEPS.length - 1;

          return (
            <li
              key={step}
              aria-current={isCurrent ? "step" : undefined}
              className={`flex items-center ${isLast ? "" : "flex-1"}`}
            >
              <div className="flex items-center gap-2 sm:gap-2.5">
                <span
                  aria-hidden="true"
                  className={`flex size-7 shrink-0 items-center justify-center rounded-full text-xs font-bold transition-colors sm:size-9 sm:text-sm ${
                    isCurrent
                      ? "bg-linear-to-br from-brand to-brand-strong text-white shadow-lg shadow-brand/25 ring-4 ring-brand/10"
                      : isDone
                        ? "bg-brand-soft text-brand dark:bg-brand/15 dark:text-brand-ink"
                        : "border border-gray-200 bg-white text-gray-400 dark:border-white/10 dark:bg-white/5 dark:text-gray-500"
                  }`}
                >
                  {isDone ? (
                    <Check className="size-4" strokeWidth={3} />
                  ) : (
                    step
                  )}
                </span>

                <span
                  className={`whitespace-nowrap text-[11px] font-semibold sm:text-sm ${
                    isCurrent
                      ? "text-brand dark:text-brand-ink"
                      : isDone
                        ? "text-gray-600 dark:text-gray-300"
                        : "text-gray-400 dark:text-gray-500"
                  } ${isCurrent ? "" : "sr-only sm:not-sr-only"}`}
                >
                  {t(`steps.${key}`)}
                </span>
              </div>

              {!isLast && (
                <span
                  aria-hidden="true"
                  className={`mx-1.5 h-px flex-1 rounded-full sm:mx-3 ${
                    isDone ? "bg-brand/40" : "bg-gray-200 dark:bg-white/10"
                  }`}
                />
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
