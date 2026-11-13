import { getTranslations } from "next-intl/server";
import { redirect } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import BackLink from "@/components/shared/components/BackLink";
import CheckoutSteps from "@/components/shared/components/CheckoutSteps";
import OrderItem from "@/components/shared/components/OrderItem";
import {
  getMyCart,
  getShippingAddresses,
} from "@/features/cart/actions/cart.action";
import OrderSummary from "@/features/order/components/OrderSummary";
import { isValidPaymentMethod } from "@/features/payment/constants/payment.constants";
import { Link } from "@/i18n/routing";
import { auth } from "@/lib/auth";
import { formatAddress, type Locale } from "@/utils/format";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ paymentMethod?: string | string[] }>;
};

export default async function Page({ params, searchParams }: Props) {
  const { locale } = await params;
  const { paymentMethod: paymentMethodParam } = await searchParams;

  const paymentMethod =
    typeof paymentMethodParam === "string" ? paymentMethodParam : undefined;

  if (!isValidPaymentMethod(paymentMethod)) {
    redirect(`/${locale}/payment-method`);
  }

  const [t, tp, session] = await Promise.all([
    getTranslations("order"),
    getTranslations("product"),
    auth(),
  ]);

  const userId = session?.user?.id;

  if (!userId) redirect(`/${locale}/auth/sign-in`);

  const [cart, addressesResult] = await Promise.all([
    getMyCart(),
    getShippingAddresses(),
  ]);

  if (!cart || cart.items.length === 0) redirect(`/${locale}/cart`);

  const addresses =
    "data" in addressesResult ? addressesResult.data : [];
  const address =
    addresses.find((item) => item.isDefault) ?? addresses[0] ?? null;

  if (!address) redirect(`/${locale}/shipping`);

  return (
    <main className="mx-auto my-4 w-full max-w-7xl">
      <CheckoutSteps currentStep={4} />

      <div className="mx-auto mt-4 rounded-2xl px-4 py-8 shadow dark:bg-neutral-900">
        <div className="flex flex-wrap items-center gap-3">
          <BackLink href="/payment-method" step="payment" />

          <h1 className="text-xl font-bold text-gray-900 sm:text-2xl dark:text-gray-100">
            {t("title")}
          </h1>
        </div>

        <div className="mt-6 grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
          <div className="space-y-4">
            <Card>
              <CardContent className="gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl">{t("shippingAddress")}</h2>
                  <Link
                    href="/shipping"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {t("edit")}
                  </Link>
                </div>

                <p className="font-medium">{address.label}</p>
                <p>{address.fullName}</p>
                <p>
                  {formatAddress(address, locale as Locale)}
                </p>
                <p>{address.postalCode}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="gap-4 p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <h2 className="text-xl">{t("paymentMethod")}</h2>
                  <Link
                    href="/payment-method"
                    className="text-sm font-medium text-primary underline-offset-4 hover:underline"
                  >
                    {t("edit")}
                  </Link>
                </div>
                <p>{paymentMethod}</p>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="gap-4 p-4">
                <h2 className="pb-4 text-xl">{t("items")}</h2>

                <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                  {cart.items.map((item) => (
                    <OrderItem
                      key={`${item.productId}-${item.color ?? ""}-${item.size ?? ""}`}
                      line={item}
                      locale={locale as Locale}
                      labels={{
                        color: tp("color"),
                        size: tp("size"),
                        quantity: t("quantity"),
                        remove: t("remove"),
                      }}
                    />
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          <OrderSummary
            itemsPrice={cart.itemsPrice}
            shippingPrice={cart.shippingPrice}
            totalPrice={cart.totalPrice}
            locale={locale as Locale}
            paymentMethod={paymentMethod}
          />
        </div>
      </div>
    </main>
  );
}
