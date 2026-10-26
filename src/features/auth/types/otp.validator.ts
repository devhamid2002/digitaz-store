import { z } from "zod";
import type { OtpRequestResponse } from "./otp";

// Mirrors the server-side check in `src/lib/otp.ts`, which cannot run in the
// browser because it imports Prisma and node:crypto.
const IDENTIFIER_PATTERN = /^\+?\d{7,15}$/;

function normalizeIdentifier(value: string): string {
  return value.trim().replace(/[\s\-()]/g, "");
}

export const otpIdentifierSchema = z.object({
  identifier: z
    .string()
    .refine((value) => IDENTIFIER_PATTERN.test(normalizeIdentifier(value))),
});

export type OtpIdentifierValues = z.infer<typeof otpIdentifierSchema>;

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
