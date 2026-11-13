import { ArrowLeft } from "lucide-react";
import { getTranslations } from "next-intl/server";

import { Link } from "@/i18n/routing";

type BackStep = "cart" | "shipping" | "payment";

type Props = {
  href: string;
  step: BackStep;
};

export default async function BackLink({ href, step }: Props) {
  const t = await getTranslations("checkout");
  const label = t("backTo", { step: t(`steps.${step}`) });

  return (
    <Link
      href={href}
      aria-label={label}
      title={label}
      className="group inline-flex size-9 shrink-0 items-center justify-center rounded-full border border-gray-200/80 bg-white text-gray-500 shadow-sm transition-all hover:border-brand/30 hover:bg-brand-soft hover:text-brand hover:shadow-md dark:border-white/10 dark:bg-white/5 dark:text-gray-400 dark:hover:border-brand/40 dark:hover:bg-brand/15 dark:hover:text-brand-ink"
    >
      <ArrowLeft className="size-4 transition-transform duration-200 group-hover:-translate-x-0.5 rtl:rotate-180 rtl:group-hover:translate-x-0.5" />
    </Link>
  );
}
