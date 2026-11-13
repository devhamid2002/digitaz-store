import { z } from "zod";

// Delivery address fields shared by the address book and the order snapshot.
// `label` is optional on the snapshot so orders created before the address
// book existed still validate.
export const shippingAddressSchema = z.object({
  label: z.string().trim().min(1).optional(),
  fullName: z.string().trim().min(1),
  city: z.string().trim().min(1),
  streetAddress: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  country: z.string().trim().min(1),
});

// Address book rows always carry a user-facing name (Home, Workplace, ...).
export const addressFormSchema = shippingAddressSchema.extend({
  label: z.string().trim().min(1),
});

export const savedAddressSchema = addressFormSchema.extend({
  id: z.string(),
  isDefault: z.boolean(),
});
