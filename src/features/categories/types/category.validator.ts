import { z } from "zod";
import type { CategoriesResponse, Category } from "./category";

// Runtime shape checks for category API payloads; children validate recursively.
export const categorySchema: z.ZodType<Category> = z.lazy(() =>
  z.object({
    id: z.string(),
    slug: z.string(),
    name: z.string(),
    icon: z.string(),
    description: z.string(),
    image: z.string(),
    productCount: z.number(),
    children: z.array(categorySchema).optional(),
  }),
);

export const categoriesResponseSchema: z.ZodType<CategoriesResponse> = z.object({
  categories: z.array(categorySchema),
});

export function isCategory(value: unknown): value is Category {
  return categorySchema.safeParse(value).success;
}

export function isCategoriesResponse(
  value: unknown,
): value is CategoriesResponse {
  return categoriesResponseSchema.safeParse(value).success;
}
