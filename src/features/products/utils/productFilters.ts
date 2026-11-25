import {
  PRODUCT_SORTS,
  type ProductFilters,
  type ProductSort,
} from "../types/product";

type SearchParamSource =
  | URLSearchParams
  | Record<string, string | string[] | undefined>;

function readParam(source: SearchParamSource, key: string) {
  if (source instanceof URLSearchParams) {
    return source.get(key) ?? undefined;
  }

  const value = source[key];
  return Array.isArray(value) ? value[0] : value;
}

function parsePrice(value: string | undefined) {
  if (!value) return undefined;

  const parsed = Number(value);
  return Number.isFinite(parsed) && parsed >= 0 ? Math.floor(parsed) : undefined;
}

function parsePositiveInt(value: string | undefined) {
  if (!value) return undefined;

  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : undefined;
}

function parseFlag(value: string | undefined) {
  return value === "1" || value === "true";
}

export function isProductSort(value: string | undefined): value is ProductSort {
  return PRODUCT_SORTS.some((sort) => sort === value);
}

// Normalizes page search params and API query strings into the catalog filter
// contract; invalid values fall back to defaults instead of failing the query.
export function parseProductFilters(
  source: SearchParamSource
): ProductFilters {
  const q = readParam(source, "q")?.trim();
  const category = readParam(source, "category")?.trim();
  const sort = readParam(source, "sort");
  const minPrice = parsePrice(readParam(source, "minPrice"));
  const maxPrice = parsePrice(readParam(source, "maxPrice"));
  const limit = parsePositiveInt(readParam(source, "limit"));

  return {
    q: q || undefined,
    category: category || undefined,
    minPrice,
    maxPrice,
    inStock: parseFlag(readParam(source, "inStock")),
    onSale: parseFlag(readParam(source, "onSale")),
    featured: parseFlag(readParam(source, "featured")),
    sort: isProductSort(sort) ? sort : undefined,
    page: parsePositiveInt(readParam(source, "page")) ?? 1,
    limit: limit ? Math.min(limit, 100) : undefined,
  };
}
