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

export interface ProductsResponse {
  products: Product[];
}

// Selected color/size for the product detail variant picker
export interface ProductVariantSelection {
  colorIndex: number;
  size: string;
}
