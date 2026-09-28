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
}

export interface ProductsResponse {
  products: Product[];
}
