"use client";

import { useCallback, useState } from "react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { FieldDescription } from "@/components/ui/field";
import { RequestOtpForm } from "./RequestOtpForm";
import { VerifyOtpForm } from "./VerifyOtpForm";

type AuthStep = "identifier" | "code";

export function SignInForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const t = useTranslations("auth");
  const [step, setStep] = useState<AuthStep>("identifier");
  const [identifier, setIdentifier] = useState("");

  const onCodeStep = step === "code";

  const handleSent = useCallback((value: string) => {
    setIdentifier(value);
    setStep("code");
  }, []);

  const handleBack = useCallback(() => {
    setStep("identifier");
  }, []);

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

      {onCodeStep ? (
        <VerifyOtpForm identifier={identifier} onBack={handleBack} />
      ) : (
        <RequestOtpForm
          defaultIdentifier={identifier}
          onSent={handleSent}
        />
      )}

      {!onCodeStep && (
        <FieldDescription className="px-6 text-center">
          {t.rich("termsNotice", {
            terms: (chunks) => (
              <a
                href="#"
                className="underline underline-offset-4 hover:text-foreground"
              >
                {chunks}
              </a>
            ),
            privacy: (chunks) => (
              <a
                href="#"
                className="underline underline-offset-4 hover:text-foreground"
              >
                {chunks}
              </a>
            ),
          })}
        </FieldDescription>
      )}
    </div>
  );
}
