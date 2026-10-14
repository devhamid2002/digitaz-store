import { getTranslations } from "next-intl/server";
import type { ApiErrorBody } from "@/types/api";
import { ApiError, ERROR_MESSAGE_KEYS } from "@/utils/actionResult";

// Resolve a failure into the shared `{ error }` envelope: the backend message
// when the API provided one, otherwise the localized `errors` fallback for the
// stable code.
export async function toActionError(
  error: unknown,
  fallbackCode: string
): Promise<{ error: ApiErrorBody }> {
  const apiError = error instanceof ApiError ? error : null;
  const code = apiError?.code || fallbackCode;

  if (apiError?.backendMessage) {
    return { error: { code, message: apiError.backendMessage } };
  }

  const key =
    ERROR_MESSAGE_KEYS[code] ||
    ERROR_MESSAGE_KEYS[fallbackCode] ||
    "unexpected";

  const t = await getTranslations("errors");
  return { error: { code, message: t(key) } };
}
