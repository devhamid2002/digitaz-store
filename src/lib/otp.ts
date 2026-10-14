import { createHash, randomInt, timingSafeEqual } from "node:crypto";
import { prisma } from "./prisma";

export const OTP_LENGTH = 6;
export const OTP_TTL_SECONDS = 120;
export const OTP_MAX_ATTEMPTS = 5;
export const OTP_RESEND_COOLDOWN_SECONDS = 60;

// Beta-only fixed code: there is no SMS/backend yet, so this code always signs
// in. Remove once real OTP delivery is wired up.
export const BETA_OTP_CODE = "123456";

export class OtpError extends Error {
  code:
    | "OTP_NOT_FOUND"
    | "OTP_EXPIRED"
    | "OTP_INVALID"
    | "OTP_MAX_ATTEMPTS"
    | "OTP_RATE_LIMITED";
  status: number;

  constructor(
    code: OtpError["code"],
    message: string,
    status = 400,
  ) {
    super(message);
    this.code = code;
    this.status = status;
  }
}

// Identifier is a phone number: keep digits and a leading +, strip separators.
export function normalizeIdentifier(raw: string): string {
  return raw.trim().replace(/[\s\-()]/g, "");
}

export function isValidIdentifier(raw: string): boolean {
  return /^\+?\d{7,15}$/.test(normalizeIdentifier(raw));
}

function hashCode(identifier: string, code: string): string {
  return createHash("sha256").update(`${identifier}:${code}`).digest("hex");
}

function generateCode(): string {
  return String(randomInt(100_000, 1_000_000));
}

function safeEqual(a: string, b: string): boolean {
  const ba = Buffer.from(a);
  const bb = Buffer.from(b);
  if (ba.length !== bb.length) return false;
  return timingSafeEqual(ba, bb);
}

export async function requestOtp(rawIdentifier: string) {
  const identifier = normalizeIdentifier(rawIdentifier);

  if (!isValidIdentifier(rawIdentifier)) {
    throw new OtpError("OTP_INVALID", "Invalid phone number.", 422);
  }

  const now = new Date();

  // Resend cooldown: reject if a fresh unexpired code was created recently
  const recent = await prisma.otpCode.findFirst({
    where: {
      identifier,
      consumedAt: null,
      expiresAt: { gt: now },
    },
    orderBy: { createdAt: "desc" },
  });

  if (recent) {
    const elapsed = (now.getTime() - recent.createdAt.getTime()) / 1000;
    // Allow a resend only once the existing code is older than the cooldown
    if (elapsed < OTP_RESEND_COOLDOWN_SECONDS) {
      throw new OtpError(
        "OTP_RATE_LIMITED",
        `Please wait ${Math.ceil(OTP_RESEND_COOLDOWN_SECONDS - elapsed)}s before requesting a new code.`,
        429,
      );
    }
  }

  const code = generateCode();
  const expiresAt = new Date(now.getTime() + OTP_TTL_SECONDS * 1000);

  // Invalidate previous pending codes for this identifier
  await prisma.otpCode.updateMany({
    where: { identifier, consumedAt: null, expiresAt: { gt: now } },
    data: { consumedAt: now },
  });

  await prisma.otpCode.create({
    data: {
      identifier,
      codeHash: hashCode(identifier, code),
      expiresAt,
    },
  });

  // TODO: plug in your SMS provider here.
  // Dev-only: log the code so OTP login is testable without a provider.
  if (process.env.NODE_ENV !== "production") {
    console.log(`[otp] code for ${identifier}: ${code} (expires in ${OTP_TTL_SECONDS}s)`);
  }

  return { identifier, expiresAt };
}

export async function verifyOtp(rawIdentifier: string, code: string) {
  const identifier = normalizeIdentifier(rawIdentifier);
  const now = new Date();

  // Beta bypass: accept the fixed code without a stored OTP record.
  if (code.trim() === BETA_OTP_CODE) {
    return { identifier };
  }

  const record = await prisma.otpCode.findFirst({
    where: { identifier, consumedAt: null },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    throw new OtpError("OTP_NOT_FOUND", "No verification code found. Request a new one.", 400);
  }

  if (record.expiresAt <= now) {
    throw new OtpError("OTP_EXPIRED", "Verification code has expired. Request a new one.", 400);
  }

  if (record.attempts >= OTP_MAX_ATTEMPTS) {
    throw new OtpError("OTP_MAX_ATTEMPTS", "Too many attempts. Request a new code.", 429);
  }

  const ok = safeEqual(hashCode(identifier, code.trim()), record.codeHash);

  if (!ok) {
    await prisma.otpCode.update({
      where: { id: record.id },
      data: { attempts: { increment: 1 } },
    });
    throw new OtpError("OTP_INVALID", "Incorrect verification code.", 400);
  }

  await prisma.otpCode.update({
    where: { id: record.id },
    data: { consumedAt: now },
  });

  return { identifier };
}
