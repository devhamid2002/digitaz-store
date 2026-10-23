"use server";

import { fetchInstance } from "@/utils/fetchInstance";
import { toActionError } from "@/utils/actionError";
import type { ActionResult } from "@/utils/actionResult";
import { isValidIdentifier } from "@/lib/otp";
import type { OtpRequestResponse } from "../types/otp";
import { isOtpRequestResponse } from "../types/otp.validator";



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
