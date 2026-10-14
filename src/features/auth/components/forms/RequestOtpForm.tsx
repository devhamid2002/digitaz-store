"use client";

import { useActionState, useEffect } from "react";
import { useTranslations } from "next-intl";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  INITIAL_REQUEST_OTP_STATE,
  requestOtpAction,
} from "@/features/auth/actions/auth.action";

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
  const [state, formAction, isPending] = useActionState(requestOtpAction, {
    ...INITIAL_REQUEST_OTP_STATE,
    identifier: defaultIdentifier,
  });

  // Advance to the verify step once the action confirms the code was sent.
  useEffect(() => {
    if (state.codeSent) {
      onSent(state.identifier);
    }
  }, [state.codeSent, state.identifier, onSent]);

  return (
    <form action={formAction}>
      <FieldGroup>
        <Field>
          <FieldLabel htmlFor="identifier">{t("identifierLabel")}</FieldLabel>
          <Input
            id="identifier"
            name="identifier"
            type="tel"
            inputMode="tel"
            dir="ltr"
            autoComplete="tel"
            placeholder={t("identifierPlaceholder")}
            defaultValue={state.identifier}
            required
          />
        </Field>

        {state.error && <FieldError>{state.error}</FieldError>}

        <Field>
          <Button type="submit" disabled={isPending}>
            {isPending ? t("sending") : t("sendCode")}
          </Button>
        </Field>
      </FieldGroup>
    </form>
  );
}
