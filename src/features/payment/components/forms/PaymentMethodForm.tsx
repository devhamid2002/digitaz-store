"use client";

import Image from "next/image";
import { useId, useState } from "react";
import { useTranslations } from "next-intl";
import CartPricing from "@/features/cart/components/CartPricing";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { useRouter } from "@/i18n/routing";
import type { Locale } from "@/utils/format";

import type { PaymentMethod } from "../../constants/payment.constants";
import type { PaymentMethods } from "../../types/paymentType";

type Props = {
  paymentMethods: PaymentMethods;
  itemsPrice: string;
  shippingPrice: string;
  totalPrice: string;
  locale: Locale;
};

export default function PaymentMethodForm({
  paymentMethods,
  itemsPrice,
  shippingPrice,
  totalPrice,
  locale,
}: Props) {
  const t = useTranslations("payment");
  const router = useRouter();
  const fieldId = useId();
  const [selectedMethod, setSelectedMethod] = useState<PaymentMethod | "">("");

  const handleSelect = (value: string) => {
    const paymentMethod = paymentMethods.find(
      (item) => item.method === value,
    );

    if (paymentMethod) setSelectedMethod(paymentMethod.method);
  };

  const handleContinue = () => {
    if (!selectedMethod) return;

    router.push(
      `/order?paymentMethod=${encodeURIComponent(selectedMethod)}`,
    );
  };

  const isDisabled = !selectedMethod;
  const continueDisabledReason = isDisabled
    ? t("selectToContinue")
    : undefined;

  return (
    <div className="grid grid-cols-1 items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
      <RadioGroup
        value={selectedMethod}
        aria-label={t("methodsLabel")}
        onValueChange={handleSelect}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2"
      >
        {paymentMethods.map((item) => {
          const inputId = `${fieldId}-${item.method}`;
          const isSelected = selectedMethod === item.method;

          return (
            <label
              key={item.id}
              htmlFor={inputId}
              className={`
                relative flex cursor-pointer flex-col items-center
                rounded-xl border p-5 text-center transition-all
                hover:border-primary/60
                ${
                  isSelected
                    ? "border-primary bg-primary/5"
                    : "border-border"
                }
              `}
            >
              <RadioGroupItem
                id={inputId}
                value={item.method}
                className="absolute end-4 top-4"
              />

              <div className="relative mb-4 h-16 w-24">
                <Image
                  src={item.img}
                  alt={item.name}
                  fill
                  sizes="96px"
                  className="object-contain"
                />
              </div>

              <h3 className="font-semibold">{item.name}</h3>

              <p className="mt-2 text-sm text-muted-foreground">
                {item.description}
              </p>
            </label>
          );
        })}
      </RadioGroup>

      <CartPricing
        itemsPrice={itemsPrice}
        shippingPrice={shippingPrice}
        totalPrice={totalPrice}
        locale={locale}
        showCheckoutButton
        onAction={handleContinue}
        disabled={isDisabled}
        disabledReason={continueDisabledReason}
        actionLabel={t("reviewOrder")}
      />
    </div>
  );
}
