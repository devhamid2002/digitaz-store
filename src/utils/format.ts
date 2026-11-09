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

export function formatDateTime(
  date: Date | string | null | undefined,
  locale: Locale = "fa",
) {
  if (!date) return "";

  return new Intl.DateTimeFormat(locale === "fa" ? "fa-IR" : "en-US", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(date));
}

export function formatDateTimeFa(date: Date | string | null | undefined) {
  return formatDateTime(date, "fa");
}