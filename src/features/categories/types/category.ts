export interface Category {
  id: string;
  slug: string;
  name: string;
  icon: string;
  description: string;
  image: string;
  productCount: number;
}

export interface CategoriesResponse {
  categories: Category[];
}
