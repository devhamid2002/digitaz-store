"use server"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  baseUrl?: string;
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
  } = options;
  const finalUrl = url.startsWith("http") ? url : baseUrl + url;
  const isFormData = body instanceof FormData;

  const buildFetchOptions = (token?: string): RequestInit => ({
    method,
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

  // Runs unauthenticated until cookie/refresh helpers exist
  const token: string | undefined = undefined;
  if (!token) console.warn("No access token found!");

  const res = await fetch(finalUrl, buildFetchOptions(token));

  if (!res.ok) {
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
