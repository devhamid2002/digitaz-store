"use client";

import { Controller, useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { toast } from "@/components/ui/toast";
import { updateUser } from "@/features/admin/users/actions/user.action";
import type { userType } from "@/features/admin/users/types/userRow";
import {
  adminUserFormSchema,
  type AdminUserFormValues,
} from "@/features/admin/users/types/userForm.validator";

type Props = {
  user: userType;
  onSaved: () => void;
  onCancel: () => void;
};

export default function EditUserForm({ user, onSaved, onCancel }: Props) {
  const t = useTranslations("admin");

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isSubmitting },
  } = useForm<AdminUserFormValues>({
    resolver: zodResolver(adminUserFormSchema),
    mode: "onBlur",
    defaultValues: {
      name: user.name === "NO_NAME" ? "" : user.name,
      email: user.email ?? "",
      phone: user.phone ?? "",
      role: user.role === "admin" ? "admin" : "user",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await updateUser({ id: user.id, ...values });

    if ("error" in result) {
      toast.add({ type: "error", title: result.error.message });
      return;
    }

    toast.add({ type: "success", title: t("userUpdated") });
    onSaved();
  });

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      aria-busy={isSubmitting}
      className="grid gap-4"
    >
      <DialogHeader>
        <DialogTitle>{t("editUserTitle")}</DialogTitle>
        <DialogDescription>{t("editUserSubtitle")}</DialogDescription>
      </DialogHeader>

      <FieldGroup>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field data-invalid={Boolean(errors.name)}>
            <FieldLabel htmlFor="edit-user-name">{t("name")}</FieldLabel>
            <Input
              id="edit-user-name"
              autoComplete="name"
              aria-invalid={Boolean(errors.name)}
              {...register("name")}
            />
            {errors.name && <FieldError>{t("fieldInvalid")}</FieldError>}
          </Field>

          <Field data-invalid={Boolean(errors.phone)}>
            <FieldLabel htmlFor="edit-user-phone">{t("phone")}</FieldLabel>
            <Input
              id="edit-user-phone"
              type="tel"
              dir="ltr"
              autoComplete="tel"
              aria-invalid={Boolean(errors.phone)}
              {...register("phone")}
            />
            {errors.phone && <FieldError>{t("phoneInvalid")}</FieldError>}
          </Field>
        </div>

        <Field data-invalid={Boolean(errors.email)}>
          <FieldLabel htmlFor="edit-user-email">
            {t("email")}
            <span className="text-xs font-normal text-muted-foreground">
              ({t("optional")})
            </span>
          </FieldLabel>
          <Input
            id="edit-user-email"
            type="email"
            dir="ltr"
            autoComplete="email"
            aria-invalid={Boolean(errors.email)}
            {...register("email")}
          />
          {errors.email && <FieldError>{t("emailInvalid")}</FieldError>}
        </Field>

        <Field data-invalid={Boolean(errors.role)}>
          <FieldLabel>{t("role")}</FieldLabel>
          <Controller
            control={control}
            name="role"
            render={({ field }) => (
              <RadioGroup
                value={field.value}
                onValueChange={field.onChange}
                aria-label={t("role")}
                className="flex flex-wrap gap-3"
              >
                {(["user", "admin"] as const).map((role) => (
                  <label
                    key={role}
                    className="flex cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-sm transition-colors has-data-checked:border-primary has-data-checked:bg-primary/5"
                  >
                    <RadioGroupItem value={role} />
                    {role === "admin" ? t("roleAdmin") : t("roleUser")}
                  </label>
                ))}
              </RadioGroup>
            )}
          />
          {errors.role && <FieldError>{t("fieldInvalid")}</FieldError>}
        </Field>
      </FieldGroup>

      <DialogFooter>
        <Button
          type="button"
          variant="outline"
          disabled={isSubmitting}
          onClick={onCancel}
        >
          {t("cancel")}
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? t("saving") : t("save")}
        </Button>
      </DialogFooter>
    </form>
  );
}
