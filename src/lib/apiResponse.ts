import { NextResponse } from "next/server";
import type { ApiErrorBody, ApiErrorDetail } from "@/types/api";

// Success response: the HTTP status carries the outcome and the payload lives
// under `data` (never a `success` flag).
export function jsonData<T>(data: T, status = 200) {
  return NextResponse.json({ data }, { status });
}

// Error response: a stable machine-readable code plus a human-readable message.
export function jsonError(
  code: string,
  message: string,
  status: number,
  details?: ApiErrorDetail[]
) {
  const error: ApiErrorBody = details
    ? { code, message, details }
    : { code, message };

  return NextResponse.json({ error }, { status });
}
