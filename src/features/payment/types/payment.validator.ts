import z from "zod";
import { PAYMENT_METHODS } from "@/features/payment/constants/payment.constants";

export const PaymentMethodSchema = z.object({
  id: z.number(),
  name: z.string(),
  description: z.string(),
  method: z.enum(PAYMENT_METHODS),
  img: z.string(),
});

export const PaymentMethodsSchema = z.array(PaymentMethodSchema);
