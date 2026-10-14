import { z } from "zod";
import type { Banner, BannersResponse } from "./banner";

// Runtime shape checks for slider API payloads.
export const bannerSchema: z.ZodType<Banner> = z.object({
  id: z.string(),
  image: z.string(),
  alt: z.string(),
});

export const bannersResponseSchema: z.ZodType<BannersResponse> = z.object({
  banners: z.array(bannerSchema),
});

export function isBanner(value: unknown): value is Banner {
  return bannerSchema.safeParse(value).success;
}

export function isBannersResponse(value: unknown): value is BannersResponse {
  return bannersResponseSchema.safeParse(value).success;
}
