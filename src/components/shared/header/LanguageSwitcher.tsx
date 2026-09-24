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

  // Full reload re-negotiates locale routing while preserving path and query
  function handleLocaleChange(newLocale: "fa" | "en") {
    if (newLocale === locale) return;
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
