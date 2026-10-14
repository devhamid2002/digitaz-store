"use server";

import { fetchInstance } from "@/utils/fetchInstance";
import { toActionError } from "@/utils/actionError";
import type { ActionResult } from "@/utils/actionResult";
import type { Banner, BannersResponse } from "../types/banner";
import { isBannersResponse } from "../types/banner.validator";

// Fetch slider banners; failures are returned for the caller to surface.
export async function getBanners(): Promise<ActionResult<Banner[]>> {
  try {
    const data = await fetchInstance<BannersResponse>("/api/banners");
    if (!isBannersResponse(data)) {
      return toActionError(null, "BANNERS_FETCH_FAILED");
    }
    return { data: data.banners };
  } catch (error) {
    console.error("Failed to fetch banners:", error);
    return toActionError(error, "BANNERS_FETCH_FAILED");
  }
}
