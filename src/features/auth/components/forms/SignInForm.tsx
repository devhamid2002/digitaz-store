"use client";

import { useActionState, useRef, useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { REGEXP_ONLY_DIGITS } from "input-otp";
import { useRouter } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import {
  INITIAL_AUTH_REQUEST_STATE,
  authRequestAction,
} from "@/features/auth/actions/auth.action";

// next-auth / OTP failure codes -> errors-namespace message keys
const ERROR_KEYS = {
  OTP_NOT_FOUND: "otpNotFound",
  OTP_EXPIRED: "otpExpired",
  OTP_INVALID: "otpInvalid",
  OTP_MAX_ATTEMPTS: "otpMaxAttempts",
  OTP_RATE_LIMITED: "otpRateLimited",
  OTP_MISSING: "otpMissing",
  OTP_FAILED: "otpFailed",
} as const;

type OtpErrorCode = keyof typeof ERROR_KEYS;

function isOtpErrorCode(value: unknown): value is OtpErrorCode {
  return typeof value === "string" && value in ERROR_KEYS;
}

type VerifyState = {
  errorKey: string | null;
};

const INITIAL_VERIFY_STATE: VerifyState = { errorKey: null };

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations("auth");
  const tErr = useTranslations("errors");
  const router = useRouter();
  const searchParams = useSearchParams();

  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  // Identifier step runs through the server action (request/resend/back).
  const [requestState, requestFormAction, isRequesting] = useActionState(
    authRequestAction,
    INITIAL_AUTH_REQUEST_STATE,
  );

  // Surface next-auth redirect errors (e.g. expired session) as localized text.
  const urlError = searchParams.get("error");
  const [verifyState, verifyFormAction, isVerifying] = useActionState(
    async (
      _prevState: VerifyState,
      formData: FormData,
    ): Promise<VerifyState> => {
      // First successful verification auto-creates the account: login and
      // signup share this single step.
      const res = await signIn("otp", {
        identifier: formData.get("identifier")?.toString() ?? "",
        code: formData.get("code")?.toString() ?? "",
        redirect: false,
        callbackUrl: formData.get("callbackUrl")?.toString() ?? "/",
      });
      if (res?.error) {
        return {
          errorKey: isOtpErrorCode(res.error)
            ? ERROR_KEYS[res.error]
            : "signInFailed",
        };
      }
      if (res?.ok) {
        router.push(res.url ?? callbackUrl);
        router.refresh();
        return INITIAL_VERIFY_STATE;
      }
      return { errorKey: "signInFailed" };
    },
    {
      errorKey: isOtpErrorCode(urlError) ? ERROR_KEYS[urlError] : null,
    },
  );

  const [code, setCode] = useState("");
  const verifyFormRef = useRef<HTMLFormElement>(null);

  const onCodeStep = requestState.step === "code";

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <div className="flex flex-col items-center gap-2 text-center">
        <span className="text-[29px] font-black tracking-tight italic">
          digitaz
        </span>
        <h1 className="text-xl font-bold">{t("loginTitle")}</h1>
        <FieldDescription>
          {onCodeStep ? t("codeSubtitle") : t("loginSubtitle")}
        </FieldDescription>
      </div>

      {!onCodeStep ? (
        <form action={requestFormAction}>
          <FieldGroup>
            <Field>
              <FieldLabel htmlFor="identifier">
                {t("identifierLabel")}
              </FieldLabel>
              <Input
                id="identifier"
                name="identifier"
                type="tel"
                inputMode="tel"
                dir="ltr"
                autoComplete="tel"
                placeholder={t("identifierPlaceholder")}
                defaultValue={requestState.identifier}
                required
              />
            </Field>

            {requestState.errorKey && (
              <FieldError>{tErr(requestState.errorKey)}</FieldError>
            )}

            <Field>
              <input type="hidden" name="intent" value="request" />
              <Button type="submit" disabled={isRequesting}>
                {isRequesting ? t("sending") : t("sendCode")}
              </Button>
            </Field>
          </FieldGroup>
        </form>
      ) : (
        <div className="grid w-full gap-4">
          <form ref={verifyFormRef} action={verifyFormAction}>
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
                <input
                  type="hidden"
                  name="identifier"
                  value={requestState.identifier}
                />
                <input type="hidden" name="callbackUrl" value={callbackUrl} />
                <FieldDescription className="text-center">
                  {requestState.identifier}
                </FieldDescription>
              </Field>

              {requestState.codeSent && (
                <p className="text-center text-sm text-emerald-600 dark:text-emerald-400">
                  {t("codeSent")}
                </p>
              )}

              {requestState.errorKey && (
                <FieldError className="text-center">
                  {tErr(requestState.errorKey)}
                </FieldError>
              )}
              {verifyState.errorKey && (
                <FieldError className="text-center">
                  {tErr(verifyState.errorKey)}
                </FieldError>
              )}

              <Field>
                <Button
                  type="submit"
                  disabled={isVerifying || isRequesting || code.length !== 6}
                >
                  {isVerifying ? t("verifying") : t("verify")}
                </Button>
              </Field>
            </FieldGroup>
          </form>

          <div className="flex items-center justify-between text-sm">
            <form action={requestFormAction}>
              <input type="hidden" name="intent" value="reset" />
              <Button
                type="submit"
                variant="link"
                className="px-0"
                disabled={isRequesting || isVerifying}
              >
                {t("changeIdentifier")}
              </Button>
            </form>
            <form action={requestFormAction}>
              <input type="hidden" name="intent" value="resend" />
              <input
                type="hidden"
                name="identifier"
                value={requestState.identifier}
              />
              <Button
                type="submit"
                variant="link"
                className="px-0"
                disabled={isRequesting || isVerifying}
              >
                {t("resendCode")}
              </Button>
            </form>
          </div>
        </div>
      )}

      {!onCodeStep && (
        <FieldDescription className="px-6 text-center">
          {t.rich("termsNotice", {
            terms: (chunks) => (
              <a href="#" className="underline underline-offset-4 hover:text-foreground">
                {chunks}
              </a>
            ),
            privacy: (chunks) => (
              <a href="#" className="underline underline-offset-4 hover:text-foreground">
                {chunks}
              </a>
            ),
          })}
        </FieldDescription>
      )}
    </div>
  );
}
