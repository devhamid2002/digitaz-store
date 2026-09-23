export type PriceLocale = "fa" | "en";

// fa → "۱۲٬۰۰۰٬۰۰۰ تومان", en → "$12,000,000"
export function formatPrice(price: number, locale: PriceLocale = "fa"): string {
  if (locale === "en") {
    return `$${price.toLocaleString("en-US")}`;
  }
  return `${price.toLocaleString("fa-IR")} تومان`;
}

// Mock countdown target until the backend provides discountEndsAt
export function getTargetDate(): Date {
  const d = new Date();
  d.setDate(d.getDate() + 155);
  d.setHours(d.getHours() + 13);
  d.setMinutes(d.getMinutes() + 16);
  d.setSeconds(d.getSeconds() + 46);
  return d;
}
