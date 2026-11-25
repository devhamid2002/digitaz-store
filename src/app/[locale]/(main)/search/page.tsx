import { SearchX } from "lucide-react";
import { getTranslations, setRequestLocale } from "next-intl/server";

import DynamicPagination from "@/components/shared/components/DynamicPagination";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { getCategories } from "@/features/categories/actions/category.action";
import { getProducts } from "@/features/products/actions/product.action";
import FilterSwitches from "@/features/products/components/FilterSwitches";
import PriceRangeFilter from "@/features/products/components/PriceRangeFilter";
import ProductCard from "@/features/products/components/ProductCard";
import {
  PRODUCT_SORTS,
  type ProductSort,
} from "@/features/products/types/product";
import { parseProductFilters } from "@/features/products/utils/productFilters";
import { Link } from "@/i18n/routing";
import { cn, formUrlQuery, PAGE_SIZE } from "@/lib/utils";

type Props = {
  params: Promise<{ locale: string }>;
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

const SORT_LABEL_KEYS: Record<ProductSort, string> = {
  newest: "newest",
  "price-desc": "priceDesc",
  "price-asc": "priceAsc",
  "best-selling": "bestSelling",
};

export default async function SearchPage({ params, searchParams }: Props) {
  const [{ locale }, query] = await Promise.all([params, searchParams]);
  setRequestLocale(locale);

  const t = await getTranslations("search");
  const filters = parseProductFilters(query);

  const [categoriesResult, productsResult] = await Promise.all([
    getCategories(),
    getProducts({ ...filters, limit: PAGE_SIZE }),
  ]);

  const categories = "data" in categoriesResult ? categoriesResult.data : [];
  const data = "data" in productsResult ? productsResult.data : null;

  // Keep only the filter params the catalog understands when building links.
  const linkQuery: Record<string, string> = {};
  for (const key of ["q", "category", "minPrice", "maxPrice"] as const) {
    const value = filters[key];
    if (value !== undefined) linkQuery[key] = String(value);
  }
  if (filters.inStock) linkQuery.inStock = "1";
  if (filters.onSale) linkQuery.onSale = "1";
  if (filters.featured) linkQuery.featured = "1";
  if (filters.sort && filters.sort !== "newest") {
    linkQuery.sort = filters.sort;
  }

  return (
    <main className="mx-auto w-full max-w-7xl px-4 py-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          {t("title")}
        </h1>
        <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
          {filters.q
            ? t("resultsFor", { query: filters.q })
            : t("subtitle")}
        </p>
      </header>

      <div className="grid items-start gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
        <aside className="rounded-2xl border border-gray-200 bg-white p-4 lg:sticky lg:top-6 dark:border-neutral-800 dark:bg-neutral-900">
          <form method="get" className="space-y-5">
            <h2 className="text-base font-semibold text-gray-900 dark:text-gray-100">
              {t("filters")}
            </h2>

            <div className="space-y-1.5">
              <label
                htmlFor="search-q"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("queryLabel")}
              </label>
              <Input
                id="search-q"
                name="q"
                type="search"
                defaultValue={filters.q ?? ""}
                placeholder={t("queryPlaceholder")}
              />
            </div>

            <div className="space-y-1.5">
              <label
                htmlFor="search-category"
                className="text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("category")}
              </label>
              <select
                id="search-category"
                name="category"
                defaultValue={filters.category ?? ""}
                className="h-10 w-full rounded-lg border border-input bg-transparent px-3 text-sm shadow-xs outline-none focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 dark:bg-input/30"
              >
                <option value="">{t("allCategories")}</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            {data && data.priceRange.max > data.priceRange.min && (
              <div className="space-y-1.5">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  {t("priceRange")}
                </span>
                <PriceRangeFilter
                  key={`${filters.minPrice ?? ""}-${filters.maxPrice ?? ""}`}
                  min={data.priceRange.min}
                  max={data.priceRange.max}
                  initialMin={filters.minPrice}
                  initialMax={filters.maxPrice}
                />
              </div>
            )}

            <FilterSwitches
              key={`${filters.inStock}-${filters.onSale}-${filters.featured}`}
              inStock={filters.inStock ?? false}
              onSale={filters.onSale ?? false}
              featured={filters.featured ?? false}
            />

            {filters.sort && filters.sort !== "newest" && (
              <input type="hidden" name="sort" value={filters.sort} />
            )}

            <div className="flex gap-2">
              <Button type="submit" className="flex-1">
                {t("apply")}
              </Button>
              <Link
                href="/search"
                className={cn(buttonVariants({ variant: "outline" }))}
              >
                {t("clear")}
              </Link>
            </div>
          </form>
        </aside>

        <section>
          {data ? (
            <>
              <div
                className={cn(
                  "mb-4 flex flex-col gap-3 rounded-xl border border-gray-200 bg-white px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-neutral-800 dark:bg-neutral-900",
                  locale === "fa" && "sm:flex-row-reverse"
                )}
              >
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {t("resultCount", { count: data.total })}
                </p>

                <nav
                  aria-label={t("sort")}
                  className="flex flex-wrap items-center gap-1.5"
                >
                  <span className="me-1 text-xs text-gray-500 dark:text-gray-400">
                    {t("sort")}:
                  </span>
                  {PRODUCT_SORTS.map((sort) => {
                    const active = (filters.sort ?? "newest") === sort;

                    return (
                      <Link
                        key={sort}
                        href={formUrlQuery({
                          params: linkQuery,
                          key: "sort",
                          value: sort === "newest" ? null : sort,
                          basePath: "/search",
                        })}
                        aria-current={active ? "true" : undefined}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-sm transition-colors",
                          active
                            ? "bg-brand text-white"
                            : "text-gray-600 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-neutral-800"
                        )}
                      >
                        {t(SORT_LABEL_KEYS[sort])}
                      </Link>
                    );
                  })}
                </nav>
              </div>

              {data.products.length === 0 ? (
                <div className="flex flex-col items-center justify-center gap-3 rounded-2xl border border-dashed border-gray-300 px-6 py-16 text-center dark:border-white/10">
                  <SearchX
                    aria-hidden="true"
                    className="size-10 text-gray-400 dark:text-gray-500"
                  />
                  <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                    {t("empty")}
                  </h2>
                  <p className="max-w-md text-sm text-gray-500 dark:text-gray-400">
                    {t("emptyHint")}
                  </p>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {data.products.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>

                  <div className="mt-8">
                    <DynamicPagination
                      currentPage={data.page}
                      totalPages={data.totalPages}
                      basePath="/search"
                      query={linkQuery}
                      labels={{
                        pagination: t("paginationLabel"),
                        previous: t("previous"),
                        next: t("next"),
                        more: t("morePages"),
                        page: t("pageLabel"),
                      }}
                    />
                  </div>
                </>
              )}
            </>
          ) : (
            <div className="rounded-2xl border border-destructive/30 bg-destructive/5 px-4 py-8 text-sm text-destructive">
              {t("error")}
            </div>
          )}
        </section>
      </div>
    </main>
  );
}
