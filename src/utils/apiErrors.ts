"use server";

import { getLocale, getTranslations } from "next-intl/server";

export type ServiceErrorKey =
  | "fetchProducts"
  | "fetchBanners"
  | "fetchCategories";

// Stable error codes shared by API routes and the future real backend
const CODE_TO_KEY: Record<string, ServiceErrorKey> = {
  PRODUCTS_FETCH_FAILED: "fetchProducts",
  PRODUCT_FETCH_FAILED: "fetchProducts",
  PRODUCT_NOT_FOUND: "fetchProducts",
  BANNERS_FETCH_FAILED: "fetchBanners",
  CATEGORIES_FETCH_FAILED: "fetchCategories",
};

// API routes stay locale-agnostic (codes only); messages resolve here at the edge
// Always throws, so service catch blocks forward it with return
export async function toLocalizedError(
  error: unknown,
  fallbackKey: ServiceErrorKey
): Promise<never> {
  const code = error instanceof Error ? error.message : "";
  const key = CODE_TO_KEY[code] ?? fallbackKey;

  let message: string;
  try {
    const locale = await getLocale();
    const t = await getTranslations({ locale, namespace: "errors" });
    message = t(key);
  } catch {
    // Non-localized last resort when the errors namespace is unavailable
    message = "Something went wrong";
  }

  throw new Error(message);
}
