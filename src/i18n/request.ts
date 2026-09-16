import { getRequestConfig } from "next-intl/server";

// Can be imported from a shared config
export const locales = ["fa", "en"] as const;
export const defaultLocale = "fa" as const;

export type Locale = (typeof locales)[number];

export default getRequestConfig(async ({ requestLocale }) => {
  let locale = await requestLocale;

  if (!locale || !locales.includes(locale as Locale)) {
    locale = defaultLocale;
  }

  return {
    locale: locale as string,
    messages: (await import(`../messages/${locale}.json`)).default
  };
});
