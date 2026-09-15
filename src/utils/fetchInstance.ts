"use server"

type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

interface FetchOptions {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  baseUrl?: string;
}

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

  let token: string | undefined;
  // TODO: Uncomment when auth is implemented
  // token = await getAccessTokenCookies();
  if (!token) console.warn("No access token found!");
  
  // eslint-disable-next-line prefer-const
  let res = await fetch(finalUrl, buildFetchOptions(token));

  // if (res.status === 401 || res.status === 403) {
  //   try {
  //     token = await refreshAccessToken();
  //     res = await fetch(finalUrl, buildFetchOptions(token));
  //   } catch (err) {
  //     throw new Error("Unauthorized and refresh token failed");
  //   }
  // }

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

  if (res.status === 204) return null as T;

  const data = await res.json();
  return data as T;
}
