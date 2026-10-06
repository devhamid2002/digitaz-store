"use server"

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
    // Surface the backend message while preserving the HTTP failure as an exception
    let message = res.statusText;
    try {
      const errorBody = await res.json();
      message = errorBody?.message || message;
    } catch {
      const text = await res.text();
      message = text || message;
    }
    throw new Error(message);
  }

  // 204 has no body; null satisfies the generic contract
  if (res.status === 204) return null as T;

  const data = await res.json();
  return data as T;
}
