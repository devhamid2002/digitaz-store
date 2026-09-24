"use client";

import { useState } from "react";
import Link from "next/link";
import { ThemeDropdownToggle } from "@/features/themes/ThemeDropdownToggle";
import CategoryDropdown from "./CategoryDropdown";
import MobileMenu from "./MobileMenu";

import {
  Menu,
  Search,
  UserRound,
  Heart,
  ShoppingBag,
  ShoppingCart,
} from "lucide-react";

interface Props {
  messages: {
    searchPlaceholder: string;
    themeLight: string;
    themeDark: string;
    themeSystem: string;
    menu: string;
    close: string;
    categories: string;
    products: string;
    pages: string;
    blog: string;
    contact: string;
    specialOffer: string;
  };
  isRTL?: boolean;
  locale?: string;
}

export default function MainHeader({ messages, isRTL = true, locale = "fa" }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="border-b border-neutral-100 dark:border-neutral-800"
    >
      {/* Desktop row */}
      <div className="mx-auto hidden min-h-[105px] max-w-[1280px] items-center gap-8 px-5 md:flex">
        {/* Brand logo */}
        <Link
          href={`/${locale}`}
          aria-label="digitaz home"
          className="flex shrink-0 items-center"
        >
          <span className="flex items-center gap-2">
            <span className="relative h-9 w-9" aria-hidden="true">
              <span className="absolute right-0 top-1 h-3 w-8 -rotate-45 rounded-full bg-[#4545d8]" />
              <span className="absolute right-0 top-3 h-3 w-8 -rotate-45 rounded-full bg-[#ef426f]" />
              <span className="absolute right-0 top-5 h-3 w-8 -rotate-45 rounded-full bg-[#315fdc]" />
            </span>

            <span className="text-[29px] font-black italic tracking-tight">
              digitaz
            </span>
          </span>
        </Link>

        {/* Catalog search with category scope */}
        <div className="mx-auto flex h-[48px] w-full max-w-[775px] overflow-hidden rounded-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <CategoryDropdown />

          <div className="flex flex-1 items-center">
            <input
              type="text"
              placeholder={messages.searchPlaceholder}
              className="h-full w-full bg-transparent px-5 text-start text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
            />
          </div>

          <button
            type="button"
            aria-label="Search"
            className="flex w-[80px] shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover"
          >
            <Search size={21} />
          </button>
        </div>

        {/* Theme and account shortcuts; cart count is static until cart state exists */}
        <div className="flex items-center gap-5">
          <ThemeDropdownToggle
            labels={{
              light: messages.themeLight,
              dark: messages.themeDark,
              system: messages.themeSystem,
            }}
          />

          <button
            type="button"
            aria-label="Account"
            className="text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          >
            <UserRound size={23} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            aria-label="Wishlist"
            className="text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          >
            <Heart size={23} strokeWidth={1.8} />
          </button>

          <button
            type="button"
            aria-label="Shopping cart"
            className="relative text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          >
            <ShoppingCart  size={23} strokeWidth={1.8} />

            <span className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
              1
            </span>
          </button>
        </div>
      </div>

      {/* Mobile rows: compact bar plus full-width search */}
      <div className="px-4 py-3 md:hidden">
        <div className="flex items-center justify-between gap-3">
          <button
            type="button"
            aria-label={messages.menu}
            onClick={() => setMenuOpen(true)}
            className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
          >
            <Menu size={22} />
          </button>

          <Link
            href={`/${locale}`}
            aria-label="digitaz home"
            className="flex shrink-0 items-center"
          >
            <span className="flex items-center gap-1.5">
              <span className="relative h-7 w-7" aria-hidden="true">
                <span className="absolute right-0 top-0.5 h-2.5 w-6 -rotate-45 rounded-full bg-[#4545d8]" />
                <span className="absolute right-0 top-2 h-2.5 w-6 -rotate-45 rounded-full bg-[#ef426f]" />
                <span className="absolute right-0 top-3.5 h-2.5 w-6 -rotate-45 rounded-full bg-[#315fdc]" />
              </span>

              <span className="text-xl font-black italic tracking-tight">
                digitaz
              </span>
            </span>
          </Link>

          <div className="flex shrink-0 items-center gap-4">
            <button
              type="button"
              aria-label="Wishlist"
              className="text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              <Heart size={22} strokeWidth={1.8} />
            </button>

            <button
              type="button"
              aria-label="Shopping cart"
              className="relative text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              <ShoppingBag size={22} strokeWidth={1.8} />

              <span className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                1
              </span>
            </button>
          </div>
        </div>

        <div className="mt-3 flex h-[44px] overflow-hidden rounded-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800">
          <div className="flex flex-1 items-center">
            <input
              type="text"
              placeholder={messages.searchPlaceholder}
              className="h-full w-full bg-transparent px-4 text-start text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
            />
          </div>

          <button
            type="button"
            aria-label="Search"
            className="flex w-[56px] shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover"
          >
            <Search size={19} />
          </button>
        </div>
      </div>

      <MobileMenu
        open={menuOpen}
        onClose={() => setMenuOpen(false)}
        messages={messages}
        locale={locale}
      />
    </div>
  );
}
