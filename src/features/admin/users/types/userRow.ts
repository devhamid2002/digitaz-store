// Fields the admin users table renders; keeps the listing query narrow.
export interface userType {
  id: string;
  name: string;
  email: string | null;
  phone: string | null;
  role: string;
  createdAt: Date;
}
