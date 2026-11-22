import { redirect } from "next/navigation";
import { defaultLocale } from "@/i18n/config";

export default function HomePage() {
  // Redirect root to the default locale so every page renders under /[locale]
  redirect(`/${defaultLocale}`);
}
