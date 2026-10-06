import { isNullable, isNumber, isOptional, isRecord, isString } from "@/utils/guards";
import type { Product, ProductColor, ProductSpecifications, ProductsResponse } from "./product";

function isStringArray(value: unknown): value is string[] {
  return Array.isArray(value) && value.every(isString);
}

// Runtime shape checks for catalog API payloads; actions reject unknown shapes
// so components only ever render validated products.
export function isProductColor(value: unknown): value is ProductColor {
  return (
    isRecord(value) && isString(value.name) && isString(value.hex)
  );
}

export function isProductSpecifications(
  value: unknown,
): value is ProductSpecifications {
  return (
    isRecord(value) &&
    Array.isArray(value.colors) &&
    value.colors.every(isProductColor) &&
    isStringArray(value.sizes)
  );
}

export function isProduct(value: unknown): value is Product {
  if (!isRecord(value)) return false;
  return (
    isString(value.id) &&
    isString(value.slug) &&
    isString(value.name) &&
    isString(value.category) &&
    isString(value.description) &&
    isString(value.image) &&
    isNumber(value.price) &&
    isNullable(value.originalPrice, isNumber) &&
    isNullable(value.discount, isNumber) &&
    isString(value.brand) &&
    isNumber(value.stock) &&
    isNumber(value.rating) &&
    isNumber(value.ratingCount) &&
    isNumber(value.viewCount) &&
    isOptional(value.isFeatured, (v): v is boolean => typeof v === "boolean") &&
    isProductSpecifications(value.specifications)
  );
}

export function isProductsResponse(value: unknown): value is ProductsResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.products) &&
    value.products.every(isProduct)
  );
}
