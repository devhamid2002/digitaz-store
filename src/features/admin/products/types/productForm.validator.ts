import { z } from "zod";

// Shared by the admin form resolver and the create action so the client and
// server accept the same shape.
export const productFormSchema = z.object({
  name: z.string().trim().min(1).max(120),
  category: z.string().trim().min(1).max(80),
  brand: z.string().trim().min(1).max(80),
  description: z.string().trim().min(1).max(2000),
  image: z.string().trim().min(1),
  price: z.number().int().min(0),
  originalPrice: z.number().int().min(0).optional(),
  discount: z.number().int().min(0).max(100).optional(),
  stock: z.number().int().min(0),
});
