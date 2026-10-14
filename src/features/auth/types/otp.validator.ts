import { z } from "zod";
import type { OtpRequestResponse } from "./otp";

// Runtime shape check for the OTP request payload; the action rejects unknown
// shapes so the form only relies on a validated response.
export const otpRequestResponseSchema: z.ZodType<OtpRequestResponse> = z.object({
  expiresAt: z.string(),
});

export function isOtpRequestResponse(
  value: unknown,
): value is OtpRequestResponse {
  return otpRequestResponseSchema.safeParse(value).success;
}
