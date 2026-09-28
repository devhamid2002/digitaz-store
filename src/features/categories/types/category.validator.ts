import { isNumber, isOptional, isRecord, isString } from "@/utils/guards";
import type { CategoriesResponse, Category } from "./category";

// Runtime shape checks for category API payloads; children validate recursively.
export function isCategory(value: unknown): value is Category {
  if (!isRecord(value)) return false;
  return (
    isString(value.id) &&
    isString(value.slug) &&
    isString(value.name) &&
    isString(value.icon) &&
    isString(value.description) &&
    isString(value.image) &&
    isNumber(value.productCount) &&
    isOptional(value.children, isCategoryList)
  );
}

function isCategoryList(value: unknown): value is Category[] {
  return Array.isArray(value) && value.every(isCategory);
}

export function isCategoriesResponse(
  value: unknown
): value is CategoriesResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.categories) &&
    value.categories.every(isCategory)
  );
}
