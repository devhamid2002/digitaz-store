export interface Product {
  id: string;
  slug: string;
  name: string;
  category: string;
  description: string;
  image: string;
  price: number;
  originalPrice?: number;
  discount?: number;
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
