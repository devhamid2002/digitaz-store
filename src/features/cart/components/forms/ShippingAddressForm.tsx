"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import {
  createShippingAddress,
  updateShippingAddress,
} from "@/features/cart/actions/cart.action";
import { addressFormSchema } from "@/features/cart/types/shipping.validator";
import type {
  addressForm,
  savedAddress,
} from "@/features/cart/types/shippingType";

const FIELDS = [
  {
    name: "label",
    label: "addressLabel",
    autoComplete: "off",
    placeholder: "addressLabelPlaceholder",
  },
  { name: "fullName", label: "fullName", autoComplete: "name" },
  {
    name: "city",
    label: "city",
    autoComplete: "address-level2",
  },
  {
    name: "streetAddress",
    label: "streetAddress",
    autoComplete: "street-address",
  },
  {
    name: "postalCode",
    label: "postalCode",
    autoComplete: "postal-code",
  },
  {
    name: "country",
    label: "country",
    autoComplete: "country-name",
  },
] as const;

type ShippingAddressFormProps = {
  address?: savedAddress | null;
  defaultLabel?: string;
  onSaved: (address: savedAddress) => void;
  onCancel?: () => void;
};

export default function ShippingAddressForm({
  address = null,
  defaultLabel = "",
  onSaved,
  onCancel,
}: ShippingAddressFormProps) {
  const t = useTranslations("shipping");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<addressForm>({
    resolver: zodResolver(addressFormSchema),
    mode: "onBlur",
    defaultValues: {
      label: address?.label ?? defaultLabel,
      fullName: address?.fullName ?? "",
      city: address?.city ?? "",
      streetAddress: address?.streetAddress ?? "",
      postalCode: address?.postalCode ?? "",
      country: address?.country ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = address
      ? await updateShippingAddress(address.id, values)
      : await createShippingAddress(values, true);

    if ("error" in result) {
      toast.add({ type: "error", title: result.error.message });
      return;
    }

    toast.add({ type: "success", title: t("saved") });
    onSaved(result.data);
  });

  return (
    <form onSubmit={onSubmit} className="w-full" aria-busy={isSubmitting}>
      <FieldGroup>
        {FIELDS.map((field) => {
          const errorId = `${field.name}-error`;

          return (
            <Field key={field.name}>
              <FieldLabel htmlFor={field.name}>{t(field.label)}</FieldLabel>
              <Input
                id={field.name}
                autoComplete={field.autoComplete}
                placeholder={
                  "placeholder" in field && field.placeholder
                    ? t(field.placeholder)
                    : undefined
                }
                aria-invalid={Boolean(errors[field.name])}
                aria-describedby={
                  errors[field.name] ? errorId : undefined
                }
                {...register(field.name)}
              />
              {errors[field.name] && (
                <FieldError id={errorId}>{t("fieldRequired")}</FieldError>
              )}
            </Field>
          );
        })}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting
              ? t("saving")
              : address
                ? t("saveChanges")
                : t("save")}
          </Button>

          {onCancel && (
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              {t("cancel")}
            </Button>
          )}
        </div>
      </FieldGroup>
    </form>
  );
}
