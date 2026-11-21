"use client";

import { useState } from "react";
import { useTranslations } from "next-intl";
import { ChevronDown } from "lucide-react";
import { Link } from "@/i18n/routing";
import { getCategories } from "@/features/categories/actions/category.action";
import { useActionQuery } from "@/hooks/useActionQuery";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

export default function CategoryDropdown() {
  const t = useTranslations("header");
  const [open, setOpen] = useState(false);

  const { data: categories = [] } = useActionQuery(
    ["categories"],
    getCategories
  );

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <button
            type="button"
            className="flex h-full w-36 shrink-0 items-center justify-center gap-2 border-e border-neutral-200 bg-transparent text-sm text-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
          />
        }
      >
        <span>{t("allCategories")}</span>
        <ChevronDown size={16} />
      </DropdownMenuTrigger>

      <DropdownMenuContent align="start" sideOffset={8}>
        {categories.map((category) => (
          <DropdownMenuItem
            key={category.id}
            render={
              <Link href="/#products" />
            }
          >
            {category.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
