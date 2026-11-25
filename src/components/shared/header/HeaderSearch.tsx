"use client";

import { useEffect, useRef, useState } from "react";
import { Search } from "lucide-react";
import { useTranslations } from "next-intl";

import type { Product } from "@/features/products/types/product";
import { Link, useRouter } from "@/i18n/routing";
import CategoryDropdown from "./CategoryDropdown";

type Suggestion = Pick<Product, "id" | "slug" | "name" | "category">;

interface Props {
  locale: string;
  placeholder: string;
  variant?: "desktop" | "mobile";
}

// Header search keeps category selection and product-name suggestions in one
// place so desktop and mobile behave the same way.
export default function HeaderSearch({
  locale,
  placeholder,
  variant = "desktop",
}: Props) {
  const t = useTranslations("search");
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [open, setOpen] = useState(false);

  const isDesktop = variant === "desktop";
  const hasSuggestions =
    open && q.trim().length >= 2 && suggestions.length > 0;

  useEffect(() => {
    const term = q.trim();

    if (term.length < 2) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      const params = new URLSearchParams({ q: term, limit: "5" });
      if (category) params.set("category", category);

      try {
        const response = await fetch(`/api/products?${params.toString()}`, {
          signal: controller.signal,
        });
        if (!response.ok) return;

        const body = (await response.json()) as {
          data?: { products?: Suggestion[] };
        };
        const products = body.data?.products ?? [];

        setSuggestions(products);
        setOpen(products.length > 0);
      } catch (error) {
        if (controller.signal.aborted) return;

        console.error("Failed to fetch search suggestions:", error);
        setSuggestions([]);
        setOpen(false);
      }
    }, 250);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
  }, [q, category]);

  useEffect(() => {
    if (!open) return;

    const handlePointerDown = (event: PointerEvent) => {
      if (!containerRef.current?.contains(event.target as Node)) {
        setOpen(false);
      }
    };

    document.addEventListener("pointerdown", handlePointerDown);
    return () => document.removeEventListener("pointerdown", handlePointerDown);
  }, [open]);

  const params = new URLSearchParams();
  if (q.trim()) params.set("q", q.trim());
  if (category) params.set("category", category);
  const search = params.toString();
  const searchHref = `/search${search ? `?${search}` : ""}`;

  return (
    <div
      ref={containerRef}
      className={
        isDesktop
          ? "relative mx-auto flex h-[48px] w-full max-w-[775px] rounded-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
          : "relative mt-3 flex h-[44px] rounded-full border border-neutral-200 bg-white dark:border-neutral-700 dark:bg-neutral-800"
      }
    >
      {isDesktop && (
        <CategoryDropdown
          value={category}
          onChange={(value) => {
            setCategory(value);
            setOpen(false);
          }}
        />
      )}

      <form
        action={`/${locale}/search`}
        method="get"
        onSubmit={() => setOpen(false)}
        className="flex flex-1 items-center"
      >
        {category && <input type="hidden" name="category" value={category} />}

        <input
          type="search"
          name="q"
          value={q}
          onChange={(event) => {
            setQ(event.target.value);
            setOpen(false);
          }}
          onFocus={() => {
            if (suggestions.length > 0) setOpen(true);
          }}
          onKeyDown={(event) => {
            if (event.key === "Escape") setOpen(false);
          }}
          placeholder={placeholder}
          autoComplete="off"
          className={
            isDesktop
              ? "h-full w-full bg-transparent px-5 text-start text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
              : "h-full w-full bg-transparent px-4 text-start text-sm text-neutral-900 outline-none placeholder:text-neutral-400 dark:text-neutral-100 dark:placeholder:text-neutral-500"
          }
        />

        <button
          type="submit"
          aria-label={t("queryLabel")}
          className={
            isDesktop
              ? "flex h-full w-[80px] shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover"
              : "flex h-full w-[56px] shrink-0 items-center justify-center rounded-full bg-brand text-white transition-colors hover:bg-brand-hover"
          }
        >
          <Search size={isDesktop ? 21 : 19} />
        </button>
      </form>

      {hasSuggestions && (
        <div className="absolute inset-x-0 top-[calc(100%+6px)] z-50 overflow-hidden rounded-2xl border border-neutral-200 bg-white py-1 shadow-lg dark:border-neutral-700 dark:bg-neutral-900">
          {suggestions.map((product) => (
            <button
              key={product.id}
              type="button"
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => {
                setOpen(false);
                router.push(`/product/${product.slug}`);
              }}
              className="flex w-full items-center justify-between gap-3 px-4 py-2.5 text-start text-sm text-neutral-800 transition-colors hover:bg-neutral-100 dark:text-neutral-200 dark:hover:bg-neutral-800"
            >
              <span className="line-clamp-1">{product.name}</span>
              <span className="shrink-0 text-xs text-neutral-400 dark:text-neutral-500">
                {product.category}
              </span>
            </button>
          ))}

          <Link
            href={searchHref}
            onClick={() => setOpen(false)}
            className="block border-t border-neutral-100 px-4 py-2.5 text-center text-sm font-medium text-brand transition-colors hover:bg-neutral-100 dark:border-neutral-800 dark:hover:bg-neutral-800"
          >
            {t("viewAllResults")}
          </Link>
        </div>
      )}
    </div>
  );
}
