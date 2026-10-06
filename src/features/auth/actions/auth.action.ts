"use server";

import { OtpError, isValidIdentifier, requestOtp } from "@/lib/otp";

// Message keys in the `errors` namespace (src/messages/*.json)
const ERROR_KEYS = {
  OTP_NOT_FOUND: "otpNotFound",
  OTP_EXPIRED: "otpExpired",
  OTP_INVALID: "otpInvalid",
  OTP_MAX_ATTEMPTS: "otpMaxAttempts",
  OTP_RATE_LIMITED: "otpRateLimited",
  OTP_MISSING: "otpMissing",
  OTP_FAILED: "otpFailed",
} as const;

export type AuthStep = "identifier" | "code";

export type AuthRequestState = {
  step: AuthStep;
  identifier: string;
  codeSent: boolean;
  errorKey: string | null;
};

export const INITIAL_AUTH_REQUEST_STATE: AuthRequestState = {
  step: "identifier",
  identifier: "",
  codeSent: false,
  errorKey: null,
};

function toErrorKey(error: unknown): string {
  if (error instanceof OtpError && error.code in ERROR_KEYS) {
    return ERROR_KEYS[error.code];
  }
  return ERROR_KEYS.OTP_FAILED;
}

// Single form action for the identifier step. The `intent` field selects the
// behavior so request, resend, and back all work with progressive enhancement:
//
// - intent=request/resend: validate + send a code, advance to the OTP step
// - intent=reset: go back to the identifier step (change number)
export async function authRequestAction(
  prevState: AuthRequestState,
  formData: FormData,
): Promise<AuthRequestState> {
  const intent = formData.get("intent")?.toString() ?? "request";

  if (intent === "reset") {
    return INITIAL_AUTH_REQUEST_STATE;
  }

  const rawIdentifier =
    formData.get("identifier")?.toString() ?? prevState.identifier;

  if (!rawIdentifier.trim()) {
    return {
      step: "identifier",
      identifier: "",
      codeSent: false,
      errorKey: ERROR_KEYS.OTP_MISSING,
    };
  }

  if (!isValidIdentifier(rawIdentifier)) {
    return {
      step: "identifier",
      identifier: rawIdentifier,
      codeSent: false,
      errorKey: "invalidIdentifier",
    };
  }

  try {
    const { identifier } = await requestOtp(rawIdentifier);
    return { step: "code", identifier, codeSent: true, errorKey: null };
  } catch (error) {
    return {
      step: intent === "resend" ? "code" : "identifier",
      identifier: intent === "resend" ? prevState.identifier : rawIdentifier,
      codeSent: intent === "resend" ? prevState.codeSent : false,
      errorKey: toErrorKey(error),
    };
  }
}
