"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, useWatch } from "react-hook-form";

import { Button, buttonVariants } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/toast";
import { createProduct } from "@/features/admin/products/actions/product.action";
import ProductImageUpload from "@/features/admin/products/components/ProductImageUpload";
import type { ProductFormValues } from "@/features/admin/products/types/productForm";
import { productFormSchema } from "@/features/admin/products/types/productForm.validator";
import { Link, useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";

export default function ProductForm() {
  const t = useTranslations("admin");
  const router = useRouter();

  const {
    register,
    handleSubmit,
    setValue,
    setError,
    control,
    formState: { errors, isSubmitting },
  } = useForm<ProductFormValues>({
    resolver: zodResolver(productFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: "",
      category: "",
      brand: "",
      description: "",
      image: "",
      price: 0,
      stock: 0,
    },
  });

  const [isUploading, setIsUploading] = useState(false);
  const image = useWatch({ control, name: "image" });

  const onSubmit = handleSubmit(async (values) => {
    const result = await createProduct(values);

    if ("error" in result) {
      setError("root", { message: result.error.message });
      return;
    }

    toast.add({ type: "success", title: t("productCreated") });
    router.push("/admin/products");
    router.refresh();
  });

  const isBusy = isSubmitting || isUploading;

  return (
    <form
      onSubmit={onSubmit}
      className="w-full"
      aria-busy={isBusy}
      noValidate
    >
      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
            <Input
              id="name"
              autoComplete="off"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name && <FieldError>{t("fieldInvalid")}</FieldError>}
          </Field>

          <Field data-invalid={Boolean(errors.category)}>
            <FieldLabel htmlFor="category">{t("category")}</FieldLabel>
            <Input
              id="category"
              autoComplete="off"
              aria-invalid={Boolean(errors.category)}
              {...register("category")}
            />
            {errors.category && <FieldError>{t("fieldInvalid")}</FieldError>}
          </Field>

          <Field data-invalid={Boolean(errors.brand)}>
            <FieldLabel htmlFor="brand">{t("brand")}</FieldLabel>
            <Input
              id="brand"
              autoComplete="off"
              aria-invalid={Boolean(errors.brand)}
              {...register("brand")}
            />
            {errors.brand && <FieldError>{t("fieldInvalid")}</FieldError>}
          </Field>

          <Field data-invalid={Boolean(errors.stock)}>
            <FieldLabel htmlFor="stock">{t("stock")}</FieldLabel>
            <Input
              id="stock"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              aria-invalid={Boolean(errors.stock)}
              {...register("stock", { valueAsNumber: true })}
            />
            {errors.stock && <FieldError>{t("fieldInvalid")}</FieldError>}
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.description)}>
          <FieldLabel htmlFor="description">{t("description")}</FieldLabel>
          <Textarea
            id="description"
            rows={5}
            aria-invalid={Boolean(errors.description)}
            {...register("description")}
          />
          {errors.description && <FieldError>{t("fieldInvalid")}</FieldError>}
        </Field>

        <ProductImageUpload
          value={image}
          onChange={(url) => setValue("image", url, { shouldValidate: true })}
          onUploadingChange={setIsUploading}
          error={errors.image ? t("imageRequired") : undefined}
          disabled={isBusy}
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <Field data-invalid={Boolean(errors.price)}>
            <FieldLabel htmlFor="price">{t("price")}</FieldLabel>
            <Input
              id="price"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              aria-invalid={Boolean(errors.price)}
              {...register("price", { valueAsNumber: true })}
            />
            {errors.price && <FieldError>{t("fieldInvalid")}</FieldError>}
          </Field>

          <Field data-invalid={Boolean(errors.originalPrice)}>
            <FieldLabel htmlFor="originalPrice">
              {t("originalPrice")}
              <span className="text-xs font-normal text-muted-foreground">
                ({t("optional")})
              </span>
            </FieldLabel>
            <Input
              id="originalPrice"
              type="number"
              inputMode="numeric"
              min={0}
              step={1}
              aria-invalid={Boolean(errors.originalPrice)}
              {...register("originalPrice", {
                setValueAs: (value: string) =>
                  value === "" ? undefined : Number(value),
              })}
            />
            {errors.originalPrice && (
              <FieldError>{t("fieldInvalid")}</FieldError>
            )}
          </Field>

          <Field data-invalid={Boolean(errors.discount)}>
            <FieldLabel htmlFor="discount">
              {t("discount")}
              <span className="text-xs font-normal text-muted-foreground">
                ({t("optional")})
              </span>
            </FieldLabel>
            <Input
              id="discount"
              type="number"
              inputMode="numeric"
              min={0}
              max={100}
              step={1}
              aria-invalid={Boolean(errors.discount)}
              {...register("discount", {
                setValueAs: (value: string) =>
                  value === "" ? undefined : Number(value),
              })}
            />
            {errors.discount && <FieldError>{t("fieldInvalid")}</FieldError>}
          </Field>
        </div>

        {errors.root && <FieldError>{errors.root.message}</FieldError>}

        <div className="flex flex-wrap gap-2">
          <Button type="submit" disabled={isBusy}>
            {isSubmitting ? t("creating") : t("createProduct")}
          </Button>
          <Link
            href="/admin/products"
            className={cn(buttonVariants({ variant: "outline" }))}
          >
            {t("cancel")}
          </Link>
        </div>
      </FieldGroup>
    </form>
  );
}
