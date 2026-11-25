export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductSpecifications {
  colors: ProductColor[];
  sizes: string[];
}

export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number | null;
  discount?: number | null;
  brand: string;
  stock: number;
  rating: number;
  ratingCount: number;
  viewCount: number;
  isFeatured?: boolean;
  specifications: ProductSpecifications;
}

// Supported catalog orderings; values double as the `sort` query param.
export const PRODUCT_SORTS = [
  "newest",
  "price-desc",
  "price-asc",
  "best-selling",
] as const;

export type ProductSort = (typeof PRODUCT_SORTS)[number];

export interface ProductFilters {
  q?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  onSale?: boolean;
  featured?: boolean;
  sort?: ProductSort;
  page?: number;
  limit?: number;
}

export interface PriceRange {
  min: number;
  max: number;
}

export interface ProductsResponse {
  products: Product[];
  total: number;
  page: number;
  totalPages: number;
  priceRange: PriceRange;
}

// Selected color/size for the product detail variant picker
export interface ProductVariantSelection {
  colorIndex: number;
  size: string;
}
