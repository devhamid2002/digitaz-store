import ZarinpalCheckout from "zarinpal-checkout";

// zarinpal-checkout requires a 36-character merchant id; the sandbox accepts
// any valid UUID. Production can override it with ZARINPAL_MERCHANT_ID.
const MERCHANT_ID =
  process.env.ZARINPAL_MERCHANT_ID ||
  "00000000-0000-0000-0000-000000000000";

// Never silently fall back to the sandbox in production unless explicitly
// requested (e.g. a staging deployment with a real build).
const SANDBOX = process.env.ZARINPAL_SANDBOX
  ? process.env.ZARINPAL_SANDBOX === "true"
  : process.env.NODE_ENV !== "production";

export const zarinpal = ZarinpalCheckout.create(MERCHANT_ID, SANDBOX);
