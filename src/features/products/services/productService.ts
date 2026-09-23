"use server";

import { fetchInstance } from "@/utils/fetchInstance";
import { toLocalizedError } from "@/utils/apiErrors";
import type { Product, ProductsResponse } from "../types/product";

export async function getProducts(): Promise<Product[]> {
  try {
    const data = await fetchInstance<ProductsResponse>("/api/products");
    return data.products;
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return toLocalizedError(error, "fetchProducts");
  }
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  try {
    const data = await fetchInstance<Product>(`/api/products/${slug}`);
    return data;
  } catch (error) {
    console.error(`Failed to fetch product ${slug}:`, error);
    return null;
  }
}

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
