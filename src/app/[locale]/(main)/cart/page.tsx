import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import Link from "next/link";
import { ShoppingBag } from "lucide-react";
import { getMyCart } from "@/features/cart/actions/cart.action";
import CartDetails from "@/features/cart/components/CartDetails";
import type { Locale } from "@/utils/format";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("cart");

  return { title: t("title") };
}

export default async function CartPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("cart");

  const cart = await getMyCart()

  if (!cart || cart.items.length === 0) {
    return (
      <main className="mx-auto my-4 w-full max-w-[1200px]">
        <div className="mx-auto flex flex-col items-center gap-4 px-4 py-20 text-center rounded-2xl shadow dark:bg-neutral-900">
          <ShoppingBag
            size={40}
            strokeWidth={1.5}
            className="text-gray-300 dark:text-gray-600"
          />
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-100">
            {t("title")}
          </h1>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {t("empty")}
          </p>
          <Link
            href={`/${locale}`}
            className="mt-2 flex h-11 items-center justify-center rounded-xl bg-gray-900 px-8 text-[13px] font-bold text-white transition-colors hover:bg-gray-800 dark:bg-white dark:text-gray-900 dark:hover:bg-gray-100"
          >
            {t("continueShopping")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto my-4 w-full max-w-[1200px]">
      <div className="mx-auto px-4 py-8 rounded-2xl shadow dark:bg-neutral-900">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
          {t("title")}
        </h1>

        <div className="mt-6">
          <CartDetails cart={cart} locale={locale as Locale} />
        </div>
      </div>
    </main>
  );
}
