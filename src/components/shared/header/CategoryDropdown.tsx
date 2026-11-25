"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { Check, ChevronDown } from "lucide-react";
import { getCategories } from "@/features/categories/actions/category.action";
import { useActionQuery } from "@/hooks/useActionQuery";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

interface Props {
  value?: string;
  onChange?: (value: string) => void;
}

export default function CategoryDropdown({ value = "", onChange }: Props) {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);

  const { data: categories = [] } = useActionQuery(
    ["categories"],
    getCategories
  );

  const selected = categories.find((category) => category.name === value);

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            title={selected?.name ?? t("allCategories")}
            className="flex h-full w-36 shrink-0 items-center justify-center gap-2 border-e border-neutral-200 bg-transparent px-3 text-sm text-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
          />
        }
      >
        <span className="truncate">{selected?.name ?? t("allCategories")}</span>
        <ChevronDown size={16} className="shrink-0" />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={8} className="max-w-64">
        <DropdownMenuItem
          onClick={() => onChange?.("")}
          className="gap-2"
        >
          <span className="flex-1 truncate">{t("allCategories")}</span>
          {!value && <Check size={14} aria-hidden="true" />}
        </DropdownMenuItem>

        {categories.map((category) => (
          <DropdownMenuItem
            key={category.id}
            onClick={() => onChange?.(category.name)}
            className="gap-2"
          >
            <span className="flex-1 truncate">{category.name}</span>
            {value === category.name && (
              <Check size={14} aria-hidden="true" />
            )}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
