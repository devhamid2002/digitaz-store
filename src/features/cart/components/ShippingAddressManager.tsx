"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Pencil, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import { toast } from "@/components/ui/toast";
import CartPricing from "@/features/cart/components/CartPricing";
import ShippingAddressForm from "@/features/cart/components/forms/ShippingAddressForm";
import { selectShippingAddress } from "@/features/cart/actions/cart.action";
import type { savedAddress } from "@/features/cart/types/shippingType";
import { formatAddress, type Locale } from "@/utils/format";

type ShippingAddressManagerProps = {
  addresses: savedAddress[];
  selectedAddressId: string | null;
  itemsPrice: string;
  shippingPrice: string;
  totalPrice: string;
  locale: Locale;
};

export default function ShippingAddressManager({
  addresses: initialAddresses,
  selectedAddressId,
  itemsPrice,
  shippingPrice,
  totalPrice,
  locale,
}: ShippingAddressManagerProps) {
  const t = useTranslations("shipping");

  const [addresses, setAddresses] = useState(initialAddresses);
  const [selectedId, setSelectedId] = useState<string | null>(
    selectedAddressId ??
      initialAddresses.find((address) => address.isDefault)?.id ??
      initialAddresses[0]?.id ??
      null,
  );
  const [mode, setMode] = useState<"list" | "form">(
    initialAddresses.length === 0 ? "form" : "list",
  );
  const [editing, setEditing] = useState<savedAddress | null>(null);
  const [selectingId, setSelectingId] = useState<string | null>(null);

  const handleSelect = async (addressId: string) => {
    if (selectingId || addressId === selectedId) return;

    const previousId = selectedId;
    setSelectedId(addressId);
    setSelectingId(addressId);

    try {
      const result = await selectShippingAddress(addressId);

      if ("error" in result) {
        setSelectedId(previousId);
        toast.add({ type: "error", title: result.error.message });
        return;
      }

      setAddresses((current) =>
        current.map((address) => ({
          ...address,
          isDefault: address.id === addressId,
        })),
      );
    } catch {
      setSelectedId(previousId);
      toast.add({ type: "error", title: t("selectFailed") });
    } finally {
      setSelectingId(null);
    }
  };

  const handleSaved = (address: savedAddress) => {
    const isEdit = Boolean(editing);

    setAddresses((current) => {
      if (isEdit) {
        return current.map((item) => {
          if (item.id === address.id) return address;
          return address.isDefault ? { ...item, isDefault: false } : item;
        });
      }

      // The create action makes the new address the default one.
      return [address, ...current].map((item) => ({
        ...item,
        isDefault: item.id === address.id,
      }));
    });

    if (!isEdit || address.isDefault) {
      setSelectedId(address.id);
    }

    setEditing(null);
    setMode("list");
  };

  const closeForm = () => {
    setEditing(null);
    setMode("list");
  };

  if (mode === "form") {
    return (
      <>
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
              {editing ? t("editAddressTitle") : t("newAddressTitle")}
            </h2>
            <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
              {t("newAddressSubtitle")}
            </p>
          </div>

          <ShippingAddressForm
            key={editing?.id ?? "new"}
            address={editing}
            defaultLabel={addresses.length === 0 ? t("defaultLabel") : ""}
            onSaved={handleSaved}
            onCancel={addresses.length > 0 ? closeForm : undefined}
          />
        </div>

        <CartPricing
          itemsPrice={itemsPrice}
          shippingPrice={shippingPrice}
          totalPrice={totalPrice}
          locale={locale}
          nextStep="payment-method"
          showCheckoutButton
          disabled
          disabledReason={t("saveToContinue")}
          actionLabel={t("continueToPayment")}
        />
      </>
    );
  }

  const noAddress = addresses.length === 0;
  const disabledReason = noAddress
    ? t("selectToContinue")
    : undefined;

  return (
    <>
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">
            {t("savedAddresses")}
          </h2>

          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setEditing(null);
              setMode("form");
            }}
            disabled={Boolean(selectingId)}
          >
            <Plus aria-hidden="true" />
            {t("addNewAddress")}
          </Button>
        </div>

        {noAddress ? (
          <div className="rounded-xl border border-dashed p-6 text-sm text-gray-500 dark:text-gray-400">
            {t("noSavedAddresses")}
          </div>
        ) : (
          <RadioGroup
            value={selectedId ?? ""}
            onValueChange={handleSelect}
            aria-label={t("savedAddresses")}
            aria-busy={Boolean(selectingId)}
            className="flex flex-col gap-3"
          >
            {addresses.map((address) => {
              const isSelected = selectedId === address.id;

              return (
                <div
                  key={address.id}
                  className={`flex items-start gap-3 rounded-xl border p-4 transition-colors ${
                    isSelected
                      ? "border-primary bg-primary/5"
                      : "border-border"
                  }`}
                >
                  <RadioGroupItem
                    id={`shipping-address-${address.id}`}
                    value={address.id}
                    disabled={Boolean(selectingId)}
                    className="mt-1"
                  />

                  <label
                    htmlFor={`shipping-address-${address.id}`}
                    className="min-w-0 flex-1 cursor-pointer"
                  >
                    <span className="flex flex-wrap items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-gray-100">
                        {address.label}
                      </span>
                      {isSelected && (
                        <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs font-medium text-primary">
                          {t("selected")}
                        </span>
                      )}
                    </span>

                    <span className="mt-1 block text-sm font-medium text-gray-700 dark:text-gray-300">
                      {address.fullName}
                    </span>
                    <span className="mt-1 block text-sm text-gray-500 dark:text-gray-400">
                      {formatAddress(address, locale)}
                    </span>
                    <span className="mt-0.5 block text-sm text-gray-500 dark:text-gray-400">
                      {address.postalCode}
                    </span>
                  </label>

                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setEditing(address);
                      setMode("form");
                    }}
                    disabled={Boolean(selectingId)}
                    aria-label={`${t("edit")} ${address.label}`}
                  >
                    <Pencil aria-hidden="true" />
                    {t("edit")}
                  </Button>
                </div>
              );
            })}
          </RadioGroup>
        )}
      </div>

      <CartPricing
        itemsPrice={itemsPrice}
        shippingPrice={shippingPrice}
        totalPrice={totalPrice}
        locale={locale}
        nextStep="payment-method"
        showCheckoutButton
        disabled={!selectedId || Boolean(disabledReason)}
        disabledReason={disabledReason}
        actionLabel={t("continueToPayment")}
      />
    </>
  );
}
