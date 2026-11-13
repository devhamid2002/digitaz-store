import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import BackLink from "@/components/shared/components/BackLink";
import CheckoutSteps from "@/components/shared/components/CheckoutSteps";
import {
  getMyCart,
  getShippingAddresses,
} from "@/features/cart/actions/cart.action";
import { getPayment } from "@/features/payment/actions/payment.action";
import PaymentMethodForm from "@/features/payment/components/forms/PaymentMethodForm";
import { auth } from "@/lib/auth";
import type { Locale } from "@/utils/format";

type Props = {
  params: Promise<{ locale: string }>;
};

export default async function Page({ params }: Props) {
  const { locale } = await params;

  const [t, session] = await Promise.all([
    getTranslations("payment"),
    auth(),
  ]);

  if (!session?.user?.id) redirect(`/${locale}/auth/sign-in`);

  const [paymentResult, cart, addressesResult] = await Promise.all([
    getPayment(),
    getMyCart(),
    getShippingAddresses(),
  ]);

  if (!cart || cart.items.length === 0) redirect(`/${locale}/cart`);

  const addresses =
    "data" in addressesResult ? addressesResult.data : [];

  if (addresses.length === 0) redirect(`/${locale}/shipping`);

  return (
    <main className="mx-auto my-4 w-full max-w-7xl">
      <CheckoutSteps currentStep={3} />

      <div className="mx-auto mt-4 rounded-2xl px-4 py-8 shadow dark:bg-neutral-900">
        <div className="flex flex-wrap items-center gap-3">
          <BackLink href="/shipping" step="shipping" />

          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
            {t("title")}
          </h1>
        </div>

        <div className="mt-6">
          {"error" in paymentResult ? (
            <p className="text-sm text-destructive">
              {paymentResult.error.message}
            </p>
          ) : paymentResult.data.length === 0 ? (
            <p className="text-sm text-muted-foreground">{t("empty")}</p>
          ) : (
            <PaymentMethodForm
              paymentMethods={paymentResult.data}
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
