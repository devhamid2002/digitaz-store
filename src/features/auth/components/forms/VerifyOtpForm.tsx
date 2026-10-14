"use client";

import { useActionState, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { requestOtp } from "@/features/auth/actions/auth.action";
import { ERROR_MESSAGE_KEYS } from "@/utils/actionResult";

type VerifyOtpFormProps = {
  identifier: string;
  onBack: () => void;
};

type VerifyState = { error: string | null };

const INITIAL_VERIFY_STATE: VerifyState = { error: null };

function toErrorKey(code: string | null | undefined): string | null {
  return code && code in ERROR_MESSAGE_KEYS ? ERROR_MESSAGE_KEYS[code] : null;
}

// Step 2 (verify-code API): submit the code through next-auth, which verifies
// it and auto-creates the user on first success. Also handles resend/back.
export function VerifyOtpForm({ identifier, onBack }: VerifyOtpFormProps) {
  const t = useTranslations("auth");
  const tErr = useTranslations("errors");
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  const urlErrorKey = toErrorKey(searchParams.get("error"));

  const [state, formAction, isVerifying] = useActionState(
    async (_prevState: VerifyState, formData: FormData): Promise<VerifyState> => {
      const res = await signIn("otp", {
        identifier,
        code: formData.get("code")?.toString() ?? "",
        redirect: false,
        callbackUrl,
      });

      if (res?.error) {
        const key = toErrorKey(res.error) ?? "signInFailed";
        return { error: tErr(key) };
      }

      if (res?.ok) {
        router.push(res.url ?? callbackUrl);
        router.refresh();
        return INITIAL_VERIFY_STATE;
      }

      return { error: tErr("signInFailed") };
    },
    { error: urlErrorKey ? tErr(urlErrorKey) : null },
  );

  const [code, setCode] = useState("");
  const [codeSent, setCodeSent] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [resendError, setResendError] = useState<string | null>(null);
  const verifyFormRef = useRef<HTMLFormElement>(null);

  async function handleResend() {
    setResendError(null);
    setCodeSent(false);
    setIsResending(true);

    const result = await requestOtp(identifier);
    setIsResending(false);

    if ("error" in result) {
      setResendError(result.error.message);
      return;
    }

    setCodeSent(true);
  }

  const error = state.error ?? resendError;

  return (
    <div className="grid w-full gap-4">
      <form ref={verifyFormRef} action={formAction}>
        <FieldGroup>
          <Field>
            <FieldLabel htmlFor="code">{t("codeLabel")}</FieldLabel>
            <div dir="ltr" className="flex justify-center">
              <InputOTP
                id="code"
                maxLength={6}
                pattern={REGEXP_ONLY_DIGITS}
                autoFocus
                value={code}
                onChange={setCode}
                onComplete={() => verifyFormRef.current?.requestSubmit()}
              >
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                </InputOTPGroup>
                <InputOTPSeparator />
                <InputOTPGroup>
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <input type="hidden" name="code" value={code} />
            <FieldDescription className="text-center">
              {identifier}
            </FieldDescription>
          </Field>

          {codeSent && (
            <p className="text-center text-sm text-emerald-600 dark:text-emerald-400">
              {t("codeSent")}
            </p>
          )}

          {error && <FieldError className="text-center">{error}</FieldError>}

          <Field>
            <Button
              type="submit"
              disabled={isVerifying || isResending || code.length !== 6}
            >
              {isVerifying ? t("verifying") : t("verify")}
            </Button>
          </Field>
        </FieldGroup>
      </form>

      <div className="flex items-center justify-between text-sm">
        <Button
          type="button"
          variant="link"
          className="px-0"
          onClick={onBack}
          disabled={isVerifying || isResending}
        >
          {t("changeIdentifier")}
        </Button>
        <Button
          type="button"
          variant="link"
          className="px-0"
          onClick={handleResend}
          disabled={isVerifying || isResending}
        >
          {t("resendCode")}
        </Button>
      </div>
    </div>
  );
}
