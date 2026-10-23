import { z } from "zod";

// Delivery address collected on the shipping step of the cart flow
export const shippingAddressSchema = z.object({
  fullName: z.string().min(1),
  city: z.string().min(1),
  streetAddress: z.string().min(1),
  postalCode: z.string().min(1),
  country: z.string().min(1),
});
