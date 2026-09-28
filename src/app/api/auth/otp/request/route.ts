import { NextResponse } from "next/server";
import { OtpError, requestOtp } from "@/lib/otp";

export async function POST(req: Request) {
  let body: { identifier?: string };
  try {
    body = (await req.json()) as { identifier?: string };
  } catch {
    return NextResponse.json(
      { ok: false, error: "OTP_INVALID", message: "Invalid JSON body." },
      { status: 400 },
    );
  }

  const identifier = body.identifier?.toString() ?? "";
  if (!identifier.trim()) {
    return NextResponse.json(
      { ok: false, error: "OTP_MISSING", message: "Phone number or email is required." },
      { status: 400 },
    );
  }

  try {
    const { expiresAt } = await requestOtp(identifier);
    return NextResponse.json({ ok: true, expiresAt });
  } catch (err) {
    if (err instanceof OtpError) {
      return NextResponse.json(
        { ok: false, error: err.code, message: err.message },
        { status: err.status },
      );
    }
    console.error("[otp] request failed", err);
    return NextResponse.json(
      { ok: false, error: "OTP_FAILED", message: "Could not send verification code." },
      { status: 500 },
    );
  }
}
