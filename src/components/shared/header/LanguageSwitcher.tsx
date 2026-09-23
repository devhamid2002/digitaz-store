"use client";

import { useLocale } from "next-intl";
import { usePathname } from "@/i18n/routing";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

const localeOptions = [
  {
    value: "fa" as const,
    label: "فارسی",
    flagClass: "fi fi-ir",
  },
  {
    value: "en" as const,
    label: "English (US)",
    flagClass: "fi fi-us",
  },
];

export default function LanguageSwitcher() {
  const locale = useLocale();
  const pathname = usePathname();

  const currentOption =
    localeOptions.find((opt) => opt.value === locale) ?? localeOptions[0];

  function handleLocaleChange(newLocale: "fa" | "en") {
    if (newLocale === locale) return;
    // Full-page navigation: next-themes injects a synchronous inline <script>
    // via ThemeProvider in the locale layout. A client-side router.replace()
    // would remount the locale layout on the client and React refuses to render
    // a <script> there ("Encountered a script tag..."). A hard navigation lets
    // the server render a fresh document instead. `pathname` from next-intl is
    // locale-stripped (e.g. "/" or "/products"), so prefix the target locale
    window.location.assign(`/${newLocale}${pathname}${window.location.search}`);
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-bold text-neutral-800 transition-colors hover:text-brand dark:text-neutral-200 dark:hover:text-brand-ink"
          />
        }
      >
        <span className={`${currentOption.flagClass} text-base`} />
        <span>{currentOption.label}</span>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" sideOffset={8}>
        {localeOptions.map((option) => (
          <DropdownMenuItem
            key={option.value}
            onClick={() => handleLocaleChange(option.value)}
          >
            <span className={`${option.flagClass} text-base`} />
            <span>{option.label}</span>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
