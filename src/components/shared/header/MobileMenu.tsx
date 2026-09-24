"use client";

import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { X } from "lucide-react";
import { getCategories } from "@/features/categories/services/categoryService";
import LanguageSwitcher from "./LanguageSwitcher";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";

export interface MobileMenuMessages {
  menu: string;
  close: string;
  categories: string;
  products: string;
  pages: string;
  blog: string;
  contact: string;
  specialOffer: string;
}

interface MobileMenuProps {
  open: boolean;
  onClose: () => void;
  messages: MobileMenuMessages;
  locale: string;
}

export default function MobileMenu({
  open,
  onClose,
  messages,
  locale,
}: MobileMenuProps) {
  // Categories share the cached query with the desktop mega menu
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const isRTL = locale === "fa";
  // Panel slides in from the same physical side as the hamburger button
  const swipeDirection: "right" | "left" = isRTL ? "right" : "left";

  const navLinks = [
    messages.products,
    messages.pages,
    messages.blog,
    messages.contact,
    messages.specialOffer,
  ];

  return (
    <Drawer
      open={open}
      onOpenChange={(value) => {
        if (!value) onClose();
      }}
      swipeDirection={swipeDirection}
    >
      {/* Pin panel positioning to LTR so the physical side stays correct under RTL */}
      <DrawerContent className="[direction:ltr] bg-white [--drawer-content-width:280px] dark:bg-neutral-900">
        <div
          dir={isRTL ? "rtl" : "ltr"}
          className="flex min-h-0 flex-1 flex-col"
        >
          <DrawerHeader className="flex-row items-center justify-between border-b border-neutral-100 px-4 py-3 dark:border-neutral-800">
            <DrawerTitle className="text-sm font-bold">
              {messages.menu}
            </DrawerTitle>
            <DrawerClose
              aria-label={messages.close}
              className="flex h-9 w-9 items-center justify-center rounded-full text-neutral-700 hover:bg-neutral-100 dark:text-neutral-300 dark:hover:bg-neutral-800"
            >
              <X size={20} />
            </DrawerClose>
          </DrawerHeader>

          <nav className="min-h-0 flex-1 overflow-y-auto px-4 py-3">
            <p className="mb-2 text-xs font-bold text-neutral-400 dark:text-neutral-500">
              {messages.categories}
            </p>
            <ul className="space-y-1">
              {categories.map((category) => (
                <li key={category.id}>
                  <Link
                    href={`/products/${category.slug}`}
                    onClick={onClose}
                    className="block rounded-lg px-2 py-2 text-sm font-medium text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>

            <div className="my-3 border-t border-neutral-100 dark:border-neutral-800" />

            <ul className="space-y-1">
              {navLinks.map((label) => (
                <li key={label}>
                  <button
                    type="button"
                    onClick={onClose}
                    className="block w-full rounded-lg px-2 py-2 text-start text-sm font-semibold text-neutral-800 hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
                  >
                    {label}
                  </button>
                </li>
              ))}
            </ul>
          </nav>

          <DrawerFooter className="border-t border-neutral-100 pt-4 dark:border-neutral-800">
            <LanguageSwitcher />
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}
