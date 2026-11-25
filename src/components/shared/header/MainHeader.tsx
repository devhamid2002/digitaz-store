"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { ThemeDropdownToggle } from "@/features/themes/ThemeDropdownToggle";
import { useAppSelector } from "@/context/hooks";
import { selectCartCount } from "@/context/slices/cartSlice";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import HeaderSearch from "./HeaderSearch";
import MobileMenu from "./MobileMenu";

import {
  LogOut,
  Menu,
  Package,
  UserRound,
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
    account: string;
    profile: string;
    orders: string;
    logout: string;
    login: string;
  };
  isRTL?: boolean;
  locale?: string;
}

export default function MainHeader({ messages, isRTL = true, locale = "fa" }: Props) {
  const [menuOpen, setMenuOpen] = useState(false);
  const cartCount = useAppSelector(selectCartCount);
  const { data: session, status } = useSession();

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

        {/* Catalog search with category scope and name suggestions */}
        <HeaderSearch
          locale={locale}
          placeholder={messages.searchPlaceholder}
        />

        {/* Theme and account shortcuts; cart badge reflects the live cart count */}
        <div className="flex items-center gap-5">
          <ThemeDropdownToggle
            labels={{
              light: messages.themeLight,
              dark: messages.themeDark,
              system: messages.themeSystem,
            }}
          />

          {status === "authenticated" ? (
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <button
                    type="button"
                    aria-label={messages.account}
                    title={session.user?.name ?? messages.account}
                    className="flex items-center justify-center text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
                  />
                }
              >
                {session.user?.image ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={session.user.image}
                    alt={session.user.name ?? messages.account}
                    className="h-7 w-7 rounded-full object-cover"
                  />
                ) : (
                  <UserRound size={23} strokeWidth={1.8} />
                )}
              </DropdownMenuTrigger>

              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuGroup>
                  <DropdownMenuLabel className="truncate px-2">
                    {session.user?.name ?? messages.account}
                  </DropdownMenuLabel>

                  <DropdownMenuItem
                    className="gap-2 px-2 py-1.5"
                    render={<Link href={`/${locale}/user/profile`} />}
                  >
                    <UserRound aria-hidden="true" />
                    {messages.profile}
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    className="gap-2 px-2 py-1.5"
                    render={<Link href={`/${locale}/user/orders`} />}
                  >
                    <Package aria-hidden="true" />
                    {messages.orders}
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  variant="destructive"
                  className="gap-2 px-2 py-1.5"
                  onClick={() => signOut({ callbackUrl: `/${locale}` })}
                >
                  <LogOut aria-hidden="true" />
                  {messages.logout}
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : status === "loading" ? (
            <span
              aria-hidden="true"
              className="text-neutral-700 dark:text-neutral-300"
            >
              <UserRound size={23} strokeWidth={1.8} />
            </span>
          ) : (
            <Link
              href={`/${locale}/auth/sign-in`}
              className="inline-flex h-9 items-center justify-center rounded-full bg-brand px-4 text-sm font-medium text-white transition-colors hover:bg-brand-hover"
            >
              {messages.login}
            </Link>
          )}

          <Link
            href={`/${locale}/cart`}
            aria-label="Shopping cart"
            className="relative text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
          >
            <ShoppingCart size={23} strokeWidth={1.8} />

            {cartCount > 0 && (
              <span className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                {cartCount}
              </span>
            )}
          </Link>
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
            <Link
              href={`/${locale}/cart`}
              aria-label="Shopping cart"
              className="relative text-neutral-700 transition-colors hover:text-neutral-900 dark:text-neutral-300 dark:hover:text-white"
            >
              <ShoppingBag size={22} strokeWidth={1.8} />

              {cartCount > 0 && (
                <span className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {cartCount}
                </span>
              )}
            </Link>
          </div>
        </div>

        <HeaderSearch
          locale={locale}
          placeholder={messages.searchPlaceholder}
          variant="mobile"
        />
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
