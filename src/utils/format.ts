export type Locale = "fa" | "en";

// fa → "۱۲٬۰۰۰٬۰۰۰ تومان", en → "$12,000,000"
export function formatPrice(price: number, locale: Locale = "fa"): string {
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

export function formatDateTimeFa(date: Date | string | null | undefined) {
  if (!date) return "";

  return new Date(date).toLocaleDateString("fa-IR", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}