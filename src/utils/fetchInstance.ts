"use server"

import { ApiError } from "@/utils/actionResult";

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  baseUrl?: string;
  cache?: RequestCache;
}

// Empty fallback keeps relative URLs same-origin when the env var is unset
const DEFAULT_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL || "";

export async function fetchInstance<T>(
  url: string,
  options: FetchOptions = {}
): Promise<T> {
  const {
    method = "GET",
    body,
    headers = {},
    baseUrl = DEFAULT_BASE_URL,
    cache,
  } = options;
  const finalUrl = url.startsWith("http") ? url : baseUrl + url;
  const isFormData = body instanceof FormData;

  const buildFetchOptions = (token?: string): RequestInit => ({
    method,
    cache,
    headers: {
      // Omit JSON Content-Type so the browser sets the multipart boundary for FormData
      ...(isFormData ? {} : { "Content-Type": "application/json" }),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers,
    },
    body:
      method !== "GET" && body !== undefined
        ? isFormData
          ? body
          : typeof body === "string"
          ? body
          : JSON.stringify(body)
        : undefined,
  });

  // Runs unauthenticated until cookie/refresh helpers exist (no per-call warning:
  // the token slot below is intentionally unwired, so logging here is pure noise).
  const token: string | undefined = undefined;

  const res = await fetch(finalUrl, buildFetchOptions(token));

  if (!res.ok) {
    // Errors follow the `{ error: { code, message, details? } }` envelope; keep
    // both the stable code and the backend message for the action to resolve.
    let code: string | null = null;
    let backendMessage: string | null = null;

    try {
      const body = await res.json();
      const errorBody = body?.error;
      if (errorBody && typeof errorBody === "object") {
        if (typeof errorBody.code === "string") {
          code = errorBody.code;
        }
        if (typeof errorBody.message === "string" && errorBody.message) {
          backendMessage = errorBody.message;
        }
      }
    } catch {
      const text = await res.text();
      backendMessage = text || null;
    }

    throw new ApiError(backendMessage ?? res.statusText, {
      code,
      backendMessage,
      status: res.status,
    });
  }

  // 204 has no body; null satisfies the generic contract
  if (res.status === 204) return null as T;

  // Success follows the `{ data }` envelope; unwrap the payload when present.
  const payload = await res.json();
  if (payload && typeof payload === "object" && "data" in payload) {
    return (payload as { data: T }).data;
  }
  return payload as T;
}
