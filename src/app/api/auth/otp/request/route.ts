import { OtpError, requestOtp } from "@/lib/otp";
import { jsonData, jsonError } from "@/lib/apiResponse";

export async function POST(req: Request) {
  let body: { identifier?: string };
  try {
    body = (await req.json()) as { identifier?: string };
  } catch {
    return jsonError("OTP_INVALID", "Invalid JSON body.", 400);
  }

  const identifier = body.identifier?.toString() ?? "";
  if (!identifier.trim()) {
    return jsonError("OTP_MISSING", "Phone number is required.", 422, [
      {
        field: "identifier",
        message: "Phone number is required.",
      },
    ]);
  }

  try {
    const { expiresAt } = await requestOtp(identifier);
    return jsonData({ expiresAt });
  } catch (err) {
    if (err instanceof OtpError) {
      return jsonError(err.code, err.message, err.status);
    }
    console.error("[otp] request failed", err);
    return jsonError("OTP_FAILED", "Could not send verification code.", 500);
  }
}
