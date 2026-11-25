"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";

import { Switch } from "@/components/ui/switch";

interface Props {
  inStock: boolean;
  onSale: boolean;
  featured: boolean;
}

const FILTERS = [
  { key: "inStock", labelKey: "inStockOnly" },
  { key: "onSale", labelKey: "onSaleOnly" },
  { key: "featured", labelKey: "featuredOnly" },
] as const;

type FilterKey = (typeof FILTERS)[number]["key"];

export default function FilterSwitches({
  inStock,
  onSale,
  featured,
}: Props) {
  const t = useTranslations("search");
  const [checked, setChecked] = useState<Record<FilterKey, boolean>>({
    inStock,
    onSale,
    featured,
  });

  return (
    <div className="divide-y divide-gray-100 border-y border-gray-100 dark:divide-neutral-800 dark:border-neutral-800">
      {FILTERS.map(({ key, labelKey }) => (
        <div
          key={key}
          className="flex items-center justify-between gap-3 py-3"
        >
          <label
            htmlFor={`search-filter-${key}`}
            className="cursor-pointer text-sm text-gray-700 dark:text-gray-300"
          >
            {t(labelKey)}
          </label>

          <Switch
            id={`search-filter-${key}`}
            name={key}
            value="1"
            checked={checked[key]}
            onCheckedChange={(value) =>
              setChecked((current) => ({ ...current, [key]: value }))
            }
          />
        </div>
      ))}
    </div>
  );
}
