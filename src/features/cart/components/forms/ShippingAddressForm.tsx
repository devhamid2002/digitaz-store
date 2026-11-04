"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { saveShippingAddress } from "@/features/cart/actions/cart.action";
import { shippingAddressSchema } from "@/features/cart/types/shipping.validator";
import type { shippingAddress } from "@/features/cart/types/shippingType";
import { zodResolver } from "@hookform/resolvers/zod";

const FIELDS = [
  { name: "fullName", label: "fullName" },
  { name: "city", label: "city" },
  { name: "streetAddress", label: "streetAddress" },
  { name: "postalCode", label: "postalCode" },
  { name: "country", label: "country" },
] as const;

type ShippingAddressFormProps = {
  defaultAddress?: shippingAddress | null;
};

export default function ShippingAddressForm({
  defaultAddress = null,
}: ShippingAddressFormProps) {
  const t = useTranslations("shipping");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<shippingAddress>({
    resolver: zodResolver(shippingAddressSchema),
    mode: "onBlur",
    defaultValues: {
      fullName: defaultAddress?.fullName || "",
      city: defaultAddress?.city || "",
      streetAddress: defaultAddress?.streetAddress || "",
      postalCode: defaultAddress?.postalCode || "",
      country: defaultAddress?.country || "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await saveShippingAddress(values);

    if ("error" in result) {
      toast.add({ type: "error", title: result.error.message });
      return;
    }

    toast.add({ type: "success", title: t("saved") });
  });

  return (
    <form onSubmit={onSubmit} className="w-full">
      <FieldGroup>
        {FIELDS.map((field) => (
          <Field key={field.name}>
            <FieldLabel htmlFor={field.name}>{t(field.label)}</FieldLabel>
            <Input
              id={field.name}
              aria-invalid={Boolean(errors[field.name])}
              {...register(field.name)}
            />
            {errors[field.name] && (
              <FieldError>{errors[field.name]?.message}</FieldError>
            )}
          </Field>
        ))}

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("saving") : t("save")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
