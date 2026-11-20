import { getRequestConfig } from "next-intl/server";

import { defaultLocale, locales, type Locale } from "./config";

export { defaultLocale, locales };
export type { Locale };

export default getRequestConfig(async ({ requestLocale }) => {
  // Fall back to Persian for missing or unsupported locales
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale: locale as string,
    timeZone: "UTC",
    messages: (await import(`../messages/${locale}.json`)).default,
  };
});
