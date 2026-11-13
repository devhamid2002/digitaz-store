import { getTranslations, setRequestLocale } from "next-intl/server";
import type { Metadata } from "next";
import { redirect } from "next/navigation";

import ShippingAddressManager from "@/features/cart/components/ShippingAddressManager";
import BackLink from "@/components/shared/components/BackLink";
import CheckoutSteps from "@/components/shared/components/CheckoutSteps";
import {
  getMyCart,
  getShippingAddresses,
} from "@/features/cart/actions/cart.action";
import { auth } from "@/lib/auth";
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

  const [t, session] = await Promise.all([
    getTranslations("shipping"),
    auth(),
  ]);

  if (!session?.user?.id) redirect(`/${locale}/auth/sign-in`);

  const [cart, addressesResult] = await Promise.all([
    getMyCart(),
    getShippingAddresses(),
  ]);

  if (!cart || cart.items.length === 0) redirect(`/${locale}/cart`);

  const addresses = "data" in addressesResult ? addressesResult.data : [];
  const selectedAddressId =
    addresses.find((address) => address.isDefault)?.id ??
    addresses[0]?.id ??
    null;

  return (
    <main className="mx-auto my-4 w-full max-w-[1200px]">
      <CheckoutSteps currentStep={2} />

      <div className="mx-auto mt-4 rounded-2xl px-4 py-8 shadow dark:bg-neutral-900">
        <div className="flex flex-wrap items-center gap-3">
          <BackLink href="/cart" step="cart" />

          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
            {t("shippingTitle")}
          </h1>
        </div>

        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {t("shippingSubtitle")}
        </p>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <ShippingAddressManager
            addresses={addresses}
            selectedAddressId={selectedAddressId}
            itemsPrice={cart.itemsPrice}
            shippingPrice={cart.shippingPrice}
            totalPrice={cart.totalPrice}
            locale={locale as Locale}
          />
        </div>
      </div>
    </main>
  );
}
