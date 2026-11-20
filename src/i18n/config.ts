// Shared locale configuration. Kept free of next-intl navigation imports so the
// server request config can read it without pulling client navigation code in.
export const locales = ["en", "fa"] as const;

export const defaultLocale = "fa" satisfies (typeof locales)[number];

export type Locale = (typeof locales)[number];
