"use client";

import { useForm } from "react-hook-form";
import { useTranslations } from "next-intl";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/toast";
import { updateProfile } from "@/features/user/actions/user.action";
import {
  updateProfileSchema,
  type UpdateProfileValues,
} from "@/features/user/types/user.validator";

type Props = {
  user: {
    name: string;
    email: string | null;
    phone: string | null;
  };
};

export default function ProfileForm({ user }: Props) {
  const t = useTranslations("profile");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<UpdateProfileValues>({
    resolver: zodResolver(updateProfileSchema),
    mode: "onBlur",
    defaultValues: {
      name: user.name === "NO_NAME" ? "" : user.name,
      email: user.email ?? "",
    },
  });

  const onSubmit = handleSubmit(async (values) => {
    const result = await updateProfile(values);

    if ("error" in result) {
      toast.add({ type: "error", title: result.error.message });
      return;
    }

    toast.add({ type: "success", title: t("saved") });
  });

  return (
    <Card>
      <CardHeader>
        <CardTitle>{t("personalInfo")}</CardTitle>
        <CardDescription>{t("personalInfoHint")}</CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={onSubmit} aria-busy={isSubmitting}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="name">{t("name")}</FieldLabel>
              <Input
                id="name"
                autoComplete="name"
                placeholder={t("namePlaceholder")}
                aria-invalid={Boolean(errors.name)}
                aria-describedby={errors.name ? "name-error" : undefined}
                {...register("name")}
              />
              {errors.name && (
                <FieldError id="name-error">{t("fieldRequired")}</FieldError>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="email">{t("email")}</FieldLabel>
              <Input
                id="email"
                type="email"
                dir="ltr"
                autoComplete="email"
                placeholder={t("emailPlaceholder")}
                aria-invalid={Boolean(errors.email)}
                aria-describedby={
                  errors.email ? "email-error" : "email-hint"
                }
                {...register("email")}
              />
              {errors.email ? (
                <FieldError id="email-error">{t("invalidEmail")}</FieldError>
              ) : (
                <FieldDescription id="email-hint">
                  {t("emailHint")}
                </FieldDescription>
              )}
            </Field>

            <Field>
              <FieldLabel htmlFor="phone">{t("phone")}</FieldLabel>
              <Input
                id="phone"
                type="tel"
                dir="ltr"
                value={user.phone ?? ""}
                disabled
                readOnly
                aria-describedby="phone-hint"
              />
              <FieldDescription id="phone-hint">
                {t("phoneHint")}
              </FieldDescription>
            </Field>

            <div className="flex justify-end">
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? t("saving") : t("save")}
              </Button>
            </div>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
  );
}
