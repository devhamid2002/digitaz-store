"use server";

import { fetchInstance } from "@/utils/fetchInstance";
import { toLocalizedError } from "@/utils/apiErrors";
import type { Banner, BannersResponse } from "../types/banner";

export async function getBanners(): Promise<Banner[]> {
  try {
    const data = await fetchInstance<BannersResponse>("/api/banners");
    return data.banners;
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return toLocalizedError(error, "fetchBanners");
  }
}
