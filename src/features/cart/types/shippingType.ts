import { z } from "zod";
import {
  addressFormSchema,
  savedAddressSchema,
  shippingAddressSchema,
} from "./shipping.validator";

// Lowercase payload naming, matching cartItem / cartLineKey in cartType.ts
export type shippingAddress = z.infer<typeof shippingAddressSchema>;
export type addressForm = z.infer<typeof addressFormSchema>;
export type savedAddress = z.infer<typeof savedAddressSchema>;
