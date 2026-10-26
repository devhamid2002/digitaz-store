"use client";

import { useForm, type FieldErrors, type Resolver } from "react-hook-form";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { requestOtp } from "@/features/auth/actions/auth.action";
import {
  otpIdentifierSchema,
  type OtpIdentifierValues,
} from "@/features/auth/types/otp.validator";

type RequestOtpFormProps = {
  defaultIdentifier?: string;
  onSent: (identifier: string) => void;
};

// Step 1 (request-code API): collect the phone number and send the OTP.
export function RequestOtpForm({
  defaultIdentifier = "",
  onSent,
}: RequestOtpFormProps) {
  const t = useTranslations("auth");
  const tErr = useTranslations("errors");

  // Same resolver approach as the shipping form: zod owns the shape and its
  // issues are mapped into react-hook-form without a resolver package.
  const resolver: Resolver<OtpIdentifierValues> = async (values) => {
    const result = otpIdentifierSchema.safeParse(values);

    if (result.success) {
      return { values: result.data, errors: {} };
    }

    const errors: FieldErrors<OtpIdentifierValues> = {};

    for (const issue of result.error.issues) {
      const field = issue.path[0] as keyof OtpIdentifierValues | undefined;
      if (!field) continue;

      errors[field] = { type: issue.code, message: tErr("invalidIdentifier") };
    }

    return { values: {}, errors };
  };

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isSubmitting },
  } = useForm<OtpIdentifierValues>({
    resolver,
    mode: "onBlur",
    defaultValues: { identifier: defaultIdentifier },
  });

  const onSubmit = handleSubmit(async ({ identifier }) => {
    clearErrors("root");
    const result = await requestOtp(identifier);

    if ("error" in result) {
      setError("root", { message: result.error.message });
      return;
    }

    onSent(identifier.trim());
  });

  const error = errors.identifier?.message ?? errors.root?.message;

  return (
    <form onSubmit={onSubmit}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="identifier">{t("identifierLabel")}</FieldLabel>
          <Input
            id="identifier"
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder={t("identifierPlaceholder")}
            aria-invalid={Boolean(errors.identifier)}
            {...register("identifier")}
            required
          />
        </Field>

        {error && <FieldError>{error}</FieldError>}

        <Field>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? t("sending") : t("sendCode")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
