"use server";

import { getLocale, getTranslations } from "next-intl/server";

export type ServiceErrorKey =
  | "fetchProducts"
  | "fetchBanners"
  | "fetchCategories";

/**
 * Stable error codes returned by our API routes (and, by contract,
 * by the future real backend).
 */
const CODE_TO_KEY: Record<string, ServiceErrorKey> = {
  PRODUCTS_FETCH_FAILED: "fetchProducts",
  BANNERS_FETCH_FAILED: "fetchBanners",
  CATEGORIES_FETCH_FAILED: "fetchCategories",
};

/**
 * Convert any service-layer failure into a localized Error using the
 * current request locale. API routes stay locale-agnostic (codes only);
 * the human-readable message is resolved here, at the edge.
 */
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
    message = "Something went wrong";
  }

  throw new Error(message);
}
