import z from "zod";
import { PaymentMethodsSchema } from "./payment.validator";

export type PaymentMethods = z.infer<typeof PaymentMethodsSchema>;

export function isPaymentMethods(value: unknown): value is PaymentMethods {
  return PaymentMethodsSchema.safeParse(value).success;
}
