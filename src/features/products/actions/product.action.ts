"use server";

import { fetchInstance } from "@/utils/fetchInstance";
import { toActionError } from "@/utils/actionError";
import { ApiError, type ActionResult } from "@/utils/actionResult";
import type { Product, ProductsResponse } from "../types/product";
import { isProduct, isProductsResponse } from "../types/product.validator";

// Failures are returned (not thrown) so callers can show the backend or
// localized message without hitting the production error redaction.
export async function getProducts(): Promise<ActionResult<Product[]>> {
  try {
    const data = await fetchInstance<ProductsResponse>("/api/products");

    if (!isProductsResponse(data)) {
      return toActionError(null, "PRODUCTS_FETCH_FAILED");
    }

    return { data: data.products };
  } catch (error) {
    console.error("Failed to fetch products:", error);
    return toActionError(error, "PRODUCTS_FETCH_FAILED");
  }
}

// Not-found and unexpected failures are returned as errors so pages can render
// the not-found boundary instead of an empty page.
export async function getProductBySlug(
  slug: string
): Promise<ActionResult<Product>> {
  try {
    const data = await fetchInstance<Product>(`/api/products/${slug}`, {
      cache: "force-cache",
    });

    if (!isProduct(data)) {
      return toActionError(null, "PRODUCT_FETCH_FAILED");
    }

    return { data };
  } catch (error) {
    if (error instanceof ApiError && error.code === "PRODUCT_NOT_FOUND") {
      return toActionError(error, "PRODUCT_NOT_FOUND");
    }

    console.error(`Failed to fetch product ${slug}:`, error);
    return toActionError(error, "PRODUCT_FETCH_FAILED");
  }
}
