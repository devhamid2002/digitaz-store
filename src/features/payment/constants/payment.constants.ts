export const PAYMENT_METHODS = process.env.PAYMENT_METHODS
  ? process.env.PAYMENT_METHODS.split(", ")
  : ["Zarinpal", "CashOnDelivery"];

export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_RESULT_STATUSES = [
  "ok",
  "canceled",
  "failed",
  "notfound",
  "error",
] as const;

export type PaymentResultStatus = (typeof PAYMENT_RESULT_STATUSES)[number];

// A method is usable only while it is still configured on the server.
export function isValidPaymentMethod(
  method: string | null | undefined,
): method is PaymentMethod {
  return typeof method === "string" && PAYMENT_METHODS.includes(method);
}

export function isPaymentResultStatus(
  status: string | null | undefined,
): status is PaymentResultStatus {
  return (
    typeof status === "string" &&
    PAYMENT_RESULT_STATUSES.includes(status as PaymentResultStatus)
  );
}
