import { ThemeDropdownToggle } from "@/features/themes/ThemeDropdownToggle";
import CategoryDropdown from "./CategoryDropdown";

import {
  Search,
  UserRound,
  Heart,
  ShoppingBag,
} from "lucide-react";

interface Props {
  messages: {
    searchPlaceholder: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
  };
  isRTL?: boolean;
}

export default function MainHeader({ messages, isRTL = true }: Props) {
  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="border-b border-neutral-100 dark:border-neutral-800"
    >
      <div className="mx-auto flex min-h-[105px] max-w-[1280px] items-center gap-8 px-5">
        {/* Logo */}
        <div className="flex shrink-0 items-center">
          <div className="flex items-center gap-2">
            <div className="relative h-9 w-9">
              <div className="absolute right-0 top-1 h-3 w-8 -rotate-45 rounded-full bg-[#4545d8]" />
              <div className="absolute right-0 top-3 h-3 w-8 -rotate-45 rounded-full bg-[#ef426f]" />
              <div className="absolute right-0 top-5 h-3 w-8 -rotate-45 rounded-full bg-[#315fdc]" />
            </div>

            <span className="text-[29px] font-black italic tracking-tight">
              digitaz
            </span>
          </div>
        </div>

        {/* Search */}
        <div className="mx-auto flex h-[48px] w-full max-w-[775px] overflow-hidden rounded-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <CategoryDropdown />

          {/* Search input */}
          <div className="flex flex-1 items-center">
            <input
              type="text"
              placeholder={messages.searchPlaceholder}
              className="h-full w-full bg-transparent px-5 text-start text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
            />
          </div>

          {/* Search button */}
          <button
            type="button"
            aria-label="Search"
            className="flex w-[80px] shrink-0 items-center justify-center rounded-full bg-[#2161e8] text-white transition-colors hover:bg-[#1854d1]"
          >
            <Search size={21} />
          </button>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-5">
          <ThemeDropdownToggle
            labels={{
              light: messages.themeLight,
              dark: messages.themeDark,
              system: messages.themeSystem,
            }}
          />

          {/* User */}
          <button
            type="button"
            aria-label="Account"
            className="text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          >
            <UserRound size={23} strokeWidth={1.8} />
          </button>

          {/* Wishlist */}
          <button
            type="button"
            aria-label="Wishlist"
            className="text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          >
            <Heart size={23} strokeWidth={1.8} />
          </button>

          {/* Shopping bag */}
          <button
            type="button"
            aria-label="Shopping cart"
            className="relative text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          >
            <ShoppingBag size={23} strokeWidth={1.8} />

            <span className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              1
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
