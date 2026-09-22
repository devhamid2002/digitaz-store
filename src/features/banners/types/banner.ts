export interface Banner {
  id: string;
  image: string;
  alt: string;
}

export interface BannersResponse {
  banners: Banner[];
}
