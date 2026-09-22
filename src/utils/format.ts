export type PriceLocale = "fa" | "en";

/**
 * Shared price formatter.
 * fa → "۱۲٬۰۰۰٬۰۰۰ تومان", en → "$12,000,000"
 */
export function formatPrice(price: number, locale: PriceLocale = "fa"): string {
  if (locale === "en") {
    return `$${price.toLocaleString("en-US")}`;
  }
  return `${price.toLocaleString("fa-IR")} تومان`;
}

/**
 * Target date for the promo countdown.
 * Fixed offset from now: 155 days, 13 hours, 16 minutes, 46 seconds.
 */
export function getTargetDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 155);
  d.setHours(d.getHours() + 13);
  d.setMinutes(d.getMinutes() + 16);
  d.setSeconds(d.getSeconds() + 46);
  return d;
}
