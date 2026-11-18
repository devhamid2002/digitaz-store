// Fields the admin table renders; keeps the listing query narrow.
export interface AdminProductRow {
  id: string;
  slug: string;
  name: string;
  image: string;
  category: string;
  brand: string;
  price: number;
  stock: number;
}
