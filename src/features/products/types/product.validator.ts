import { z } from "zod";
import type {
  Product,
  ProductColor,
  ProductSpecifications,
  ProductsResponse,
} from "./product";

// Runtime shape checks for catalog API payloads; actions reject unknown shapes
// so components only ever render validated products.
export const productColorSchema: z.ZodType<ProductColor> = z.object({
  name: z.string(),
  hex: z.string(),
});

export const productSpecificationsSchema: z.ZodType<ProductSpecifications> =
  z.object({
    colors: z.array(productColorSchema),
    sizes: z.array(z.string()),
  });

export const productSchema: z.ZodType<Product> = z.object({
  id: z.string(),
  slug: z.string(),
  name: z.string(),
  category: z.string(),
  description: z.string(),
  image: z.string(),
  price: z.number(),
  originalPrice: z.number().nullish(),
  discount: z.number().nullish(),
  brand: z.string(),
  stock: z.number(),
  rating: z.number(),
  ratingCount: z.number(),
  viewCount: z.number(),
  isFeatured: z.boolean().optional(),
  specifications: productSpecificationsSchema,
});

export const productsResponseSchema: z.ZodType<ProductsResponse> = z.object({
  products: z.array(productSchema),
});

export function isProductColor(value: unknown): value is ProductColor {
  return productColorSchema.safeParse(value).success;
}

export function isProductSpecifications(
  value: unknown,
): value is ProductSpecifications {
  return productSpecificationsSchema.safeParse(value).success;
}

export function isProduct(value: unknown): value is Product {
  return productSchema.safeParse(value).success;
}

export function isProductsResponse(value: unknown): value is ProductsResponse {
  return productsResponseSchema.safeParse(value).success;
}
