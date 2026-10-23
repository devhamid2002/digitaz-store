import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import ShippingAddressForm from "@/features/cart/components/forms/ShippingAddressForm";
import CartPricing from "@/features/cart/components/CartPricing";
import {
  getMyCart,
  getShippingAddress,
} from "@/features/cart/actions/cart.action";
import type { Locale } from "@/utils/format";

type Props = {
  params: Promise<{ locale: string }>;
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  setRequestLocale(locale);
  const t = await getTranslations("shipping");

  return { title: t("shippingTitle") };
}

export default async function ShippingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations("shipping");

  // The address already saved on the signed-in user; a guest or a user
  // without one simply gets an empty form
  const result = await getShippingAddress();
  const address = "data" in result ? result.data : null;

  // Missing cookie on a first visit means "no cart yet" — don't fail the page
  const cart = await getMyCart().catch(() => undefined);

  return (
    <main className="mx-auto my-4 w-full max-w-[1200px]">
      <div className="mx-auto px-4 py-8 rounded-2xl shadow dark:bg-neutral-900">
        <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
          {t("shippingTitle")}
        </h1>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("shippingSubtitle")}
        </p>

        {/* Same two-column shape as the cart page: form first, price box as
            the second grid cell so the writing direction places it correctly */}
        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <ShippingAddressForm defaultAddress={address} />

          {cart && cart.items.length > 0 && (
            <CartPricing
              itemsPrice={cart.itemsPrice}
              shippingPrice={cart.shippingPrice}
              totalPrice={cart.totalPrice}
              locale={locale as Locale}
            />
          )}
        </div>
      </div>
    </main>
  );
}
