"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
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

// next-auth / OTP API failure codes -> errors-namespace message keys
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

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations("auth");
  const tErr = useTranslations("errors");
  const router = useRouter();
  const searchParams = useSearchParams();

  const [step, setStep] = useState<"identifier" | "code">("identifier");
  const [identifier, setIdentifier] = useState("");
  const [code, setCode] = useState("");
  const [pending, setPending] = useState(false);

  const callbackUrl = searchParams.get("callbackUrl") ?? "/";

  // Surface next-auth redirect errors (e.g. expired session) as localized text
  const [errorKey, setErrorKey] = useState<string | null>(() => {
    const urlError = searchParams.get("error");
    return isOtpErrorCode(urlError) ? ERROR_KEYS[urlError] : null;
  });
  const [codeSent, setCodeSent] = useState(false);

  async function requestCode(currentIdentifier = identifier) {
    setPending(true);
    setErrorKey(null);
    try {
      const res = await fetch("/api/auth/otp/request", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ identifier: currentIdentifier }),
      });
      const data = (await res.json()) as {
        ok: boolean;
        error?: string;
      };
      if (!data.ok) {
        setErrorKey(
          isOtpErrorCode(data.error) ? ERROR_KEYS[data.error] : "otpFailed"
        );
        return false;
      }
      setCodeSent(true);
      setStep("code");
      return true;
    } catch {
      setErrorKey("otpFailed");
      return false;
    } finally {
      setPending(false);
    }
  }

  async function verifyCode(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setErrorKey(null);
    try {
      // First successful verification auto-creates the account: login and
      // signup share this single step.
      const res = await signIn("otp", {
        identifier,
        code,
        redirect: false,
        callbackUrl,
      });
      if (res?.error) {
        setErrorKey(
          isOtpErrorCode(res.error) ? ERROR_KEYS[res.error] : "signInFailed"
        );
        return;
      }
      if (res?.ok) {
        router.push(res.url ?? callbackUrl);
        router.refresh();
      }
    } catch {
      setErrorKey("signInFailed");
    } finally {
      setPending(false);
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form
        onSubmit={
          step === "identifier"
            ? (event) => {
                event.preventDefault();
                void requestCode();
              }
            : verifyCode
        }
      >
        <FieldGroup>
          <div className="flex flex-col items-center gap-2 text-center">
            <span className="text-[29px] font-black tracking-tight italic">
              digitaz
            </span>
            <h1 className="text-xl font-bold">{t("loginTitle")}</h1>
            <FieldDescription>
              {step === "identifier" ? t("loginSubtitle") : t("codeSubtitle")}
            </FieldDescription>
          </div>

          {step === "identifier" ? (
            <Field>
              <FieldLabel htmlFor="identifier">
                {t("identifierLabel")}
              </FieldLabel>
              <Input
                id="identifier"
                type="text"
                dir="ltr"
                autoComplete="username"
                placeholder={t("identifierPlaceholder")}
                value={identifier}
                onChange={(event) => setIdentifier(event.target.value)}
                required
              />
            </Field>
          ) : (
            <>
              <Field>
                <FieldLabel htmlFor="code">{t("codeLabel")}</FieldLabel>
                <Input
                  id="code"
                  type="text"
                  dir="ltr"
                  inputMode="numeric"
                  autoComplete="one-time-code"
                  maxLength={6}
                  placeholder={t("codePlaceholder")}
                  value={code}
                  onChange={(event) => setCode(event.target.value)}
                  required
                />
                <FieldDescription>{identifier}</FieldDescription>
              </Field>
              {codeSent && (
                <p className="text-center text-sm text-emerald-600 dark:text-emerald-400">
                  {t("codeSent")}
                </p>
              )}
            </>
          )}

          {errorKey && <FieldError>{tErr(errorKey)}</FieldError>}

          <Field>
            <Button type="submit" disabled={pending}>
              {step === "identifier"
                ? pending
                  ? t("sending")
                  : t("sendCode")
                : pending
                  ? t("verifying")
                  : t("verify")}
            </Button>
          </Field>

          {step === "code" && (
            <div className="flex items-center justify-between text-sm">
              <Button
                type="button"
                variant="link"
                className="px-0"
                disabled={pending}
                onClick={() => {
                  setStep("identifier");
                  setCode("");
                  setErrorKey(null);
                }}
              >
                {t("changeIdentifier")}
              </Button>
              <Button
                type="button"
                variant="link"
                className="px-0"
                disabled={pending}
                onClick={() => void requestCode()}
              >
                {t("resendCode")}
              </Button>
            </div>
          )}
        </FieldGroup>
      </form>
    </div>
  );
}
