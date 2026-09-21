"use server";

import { getLocale } from "next-intl/server";
import { fetchInstance } from "@/utils/fetchInstance";
import type { Category, CategoriesResponse } from "../types/category";

export async function getCategories(): Promise<Category[]> {
  try {
    const locale = await getLocale();
    const data = await fetchInstance<CategoriesResponse>("/api/categories", {
      headers: {
        "Accept-Language": locale,
      },
    });
    return data.categories;
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    throw new Error(
      error instanceof Error ? error.message : "Failed to fetch categories"
    );
  }
}

export async function getCategoryBySlug(
  slug: string
): Promise<Category | null> {
  try {
    const locale = await getLocale();
    const data = await fetchInstance<Category>(`/categories/${slug}`, {
      headers: {
        "Accept-Language": locale,
      },
    });
    return data;
  } catch {
    return null;
  }
}

export async function createCategory(
  category: Omit<Category, "id">
): Promise<Category> {
  return fetchInstance<Category>("/categories", {
    method: "POST",
    body: category,
  });
}

export async function updateCategory(
  id: string,
  category: Partial<Category>
): Promise<Category> {
  return fetchInstance<Category>(`/categories/${id}`, {
    method: "PUT",
    body: category,
  });
}

export async function deleteCategory(id: string): Promise<void> {
  await fetchInstance(`/categories/${id}`, {
    method: "DELETE",
  });
}
