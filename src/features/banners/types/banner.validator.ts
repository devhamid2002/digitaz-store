import { isRecord, isString } from "@/utils/guards";
import type { Banner, BannersResponse } from "./banner";

// Runtime shape checks for slider API payloads.
export function isBanner(value: unknown): value is Banner {
  return (
    isRecord(value) && isString(value.id) && isString(value.image) && isString(value.alt)
  );
}

export function isBannersResponse(value: unknown): value is BannersResponse {
  return (
    isRecord(value) &&
    Array.isArray(value.banners) &&
    value.banners.every(isBanner)
  );
}
