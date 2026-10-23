import { z } from "zod";
import { shippingAddressSchema } from "./shipping.validator";

// Lowercase payload naming, matching cartItem / cartLineKey in cartType.ts
export type shippingAddress = z.infer<typeof shippingAddressSchema>;
