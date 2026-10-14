import type { ApiErrorBody } from "@/types/api";

// Error codes surfaced by feature actions, mapped to `errors` message keys.
export const ERROR_MESSAGE_KEYS: Record<string, string> = {
  PRODUCTS_FETCH_FAILED: "fetchProducts",
  PRODUCT_FETCH_FAILED: "fetchProducts",
  PRODUCT_NOT_FOUND: "productNotFound",
  CATEGORIES_FETCH_FAILED: "fetchCategories",
  BANNERS_FETCH_FAILED: "fetchBanners",
  OTP_NOT_FOUND: "otpNotFound",
  OTP_EXPIRED: "otpExpired",
  OTP_INVALID: "otpInvalid",
  OTP_MAX_ATTEMPTS: "otpMaxAttempts",
  OTP_RATE_LIMITED: "otpRateLimited",
  OTP_MISSING: "otpMissing",
  OTP_FAILED: "otpFailed",
  INVALID_IDENTIFIER: "invalidIdentifier",
};

// Thrown inside the server layer by fetchInstance so actions can read the
// backend code/message; it never crosses the server-action boundary.
export class ApiError extends Error {
  readonly code: string | null;
  readonly backendMessage: string | null;
  readonly status: number;

  constructor(
    message: string,
    options: {
      code?: string | null;
      backendMessage?: string | null;
      status?: number;
    } = {}
  ) {
    super(message);
    this.name = "ApiError";
    this.code = options.code ?? null;
    this.backendMessage = options.backendMessage ?? null;
    this.status = options.status ?? 500;
  }
}

// Actions return the same `{ data }` / `{ error }` envelope as the API so
// user-facing errors survive the server-action boundary (thrown messages are
// redacted in production).
export type ActionResult<T> =
  | { data: T }
  | { error: ApiErrorBody };
