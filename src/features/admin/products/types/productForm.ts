import { z } from "zod";
import { productFormSchema } from "./productForm.validator";

// Admin form payload; the server derives slug, rating, and specifications.
export type ProductFormValues = z.infer<typeof productFormSchema>;
