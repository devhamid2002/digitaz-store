"use server";

import { fetchInstance } from "@/utils/fetchInstance";
import { toLocalizedError } from "@/utils/apiErrors";
import type { Product, ProductsResponse } from "../types/product";
import { isProduct, isProductsResponse } from "../types/product.validator";

// Throws a localized error on failure so the catalog surfaces it instead of rendering empty
export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchInstance<ProductsResponse>("/api/products");
    if (!isProductsResponse(data)) throw new Error("PRODUCTS_FETCH_FAILED");
    return data.products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return toLocalizedError(error, "fetchProducts");
  }
}

// Missing products resolve to null so the page can render the not-found boundary
export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const data = await fetchInstance<Product>(`/api/products/${slug}`);
    if (!isProduct(data)) return null;
    return data;
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    return null;
  }
}

// Derive showcase splits from the shared catalog fetch instead of a dedicated endpoint
export async function getFeaturedProduct(): Promise<Product | null> {
  try {
    const products = await getProducts();
    return products.find((p) => p.isFeatured) ?? null;
  } catch {
    return null;
  }
}

export async function getRegularProducts(): Promise<Product[]> {
  try {
    const products = await getProducts();
    return products.filter((p) => !p.isFeatured);
  } catch {
    return [];
  }
}
