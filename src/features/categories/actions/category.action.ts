"use server";

import { getLocale } from "next-intl/server";
import { fetchInstance } from "@/utils/fetchInstance";
import { toActionError } from "@/utils/actionError";
import type { ActionResult } from "@/utils/actionResult";
import type { Category, CategoriesResponse } from "../types/category";
import { isCategoriesResponse } from "../types/category.validator";

// Fetch the localized category tree; failures are returned for the caller to surface.
export async function getCategories(): Promise<ActionResult<Category[]>> {
  try {
    // Backend localizes category names via Accept-Language
    const locale = await getLocale();
    const data = await fetchInstance<CategoriesResponse>("/api/categories", {
      headers: {
        "Accept-Language": locale,
      },
    });

    if (!isCategoriesResponse(data)) {
      return toActionError(null, "CATEGORIES_FETCH_FAILED");
    }

    return { data: data.categories };
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    return toActionError(error, "CATEGORIES_FETCH_FAILED");
  }
}
