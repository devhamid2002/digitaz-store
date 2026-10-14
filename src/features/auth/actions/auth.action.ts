"use server";

import { fetchInstance } from "@/utils/fetchInstance";
import { toActionError } from "@/utils/actionError";
import type { ActionResult } from "@/utils/actionResult";
import { isValidIdentifier } from "@/lib/otp";
import type { OtpRequestResponse } from "../types/otp";
import { isOtpRequestResponse } from "../types/otp.validator";

// State consumed by useActionState in RequestOtpForm.
export type RequestOtpState = {
  identifier: string;
  codeSent: boolean;
  error: string | null;
};

export const INITIAL_REQUEST_OTP_STATE: RequestOtpState = {
  identifier: "",
  codeSent: false,
  error: null,
};

// Plain API action: validation, shape check, and failures normalized into the
// shared `{ data }` / `{ error }` envelope. Reused by the form action below and
// by the verify form's resend button.
export async function requestOtp(
  identifier: string,
): Promise<ActionResult<OtpRequestResponse>> {
  if (!identifier.trim()) {
    return toActionError(null, "OTP_MISSING");
  }

  if (!isValidIdentifier(identifier)) {
    return toActionError(null, "INVALID_IDENTIFIER");
  }

  try {
    const data = await fetchInstance<OtpRequestResponse>(
      "/api/auth/otp/request",
      { method: "POST", body: { identifier } },
    );

    if (!isOtpRequestResponse(data)) {
      return toActionError(null, "OTP_FAILED");
    }

    return { data };
  } catch (error) {
    console.error("Failed to request OTP:", error);
    return toActionError(error, "OTP_FAILED");
  }
}

// useActionState wrapper for the request-code form.
export async function requestOtpAction(
  prevState: RequestOtpState,
  formData: FormData,
): Promise<RequestOtpState> {
  const identifier =
    formData.get("identifier")?.toString() ?? prevState.identifier;

  const result = await requestOtp(identifier);

  if ("error" in result) {
    return { identifier, codeSent: false, error: result.error.message };
  }

  return { identifier: identifier.trim(), codeSent: true, error: null };
}
