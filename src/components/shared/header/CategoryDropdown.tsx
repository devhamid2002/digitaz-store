"use client";

import { useState, useRef, useCallback } from "react";
import { useQuery } from "@tanstack/react-query";
import { ChevronDown } from "lucide-react";
import { getCategories } from "@/features/categories/services/categoryService";

import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";

/**
 * Category dropdown for the search bar.
 * Fetches categories from the API and displays parent categories on hover.
 */
export default function CategoryDropdown() {
  const [open, setOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout>>(null);

  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const handleMouseEnter = useCallback(() => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setOpen(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    timeoutRef.current = setTimeout(() => setOpen(false), 150);
  }, []);

  return (
    <div onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <DropdownMenu open={open} onOpenChange={setOpen}>
        {/* Trigger button styled to match the search bar */}
        <DropdownMenuTrigger
          render={
            <button
              type="button"
              className="flex h-full w-36 shrink-0 items-center justify-center gap-2 border-e border-neutral-200 bg-transparent text-sm text-neutral-800 dark:border-neutral-700 dark:text-neutral-200"
            />
          }
        >
          <span>همه دسته‌بندی‌ها</span>
          <ChevronDown size={16} />
        </DropdownMenuTrigger>

        {/* Dropdown content with category list */}
        <DropdownMenuContent align="start" sideOffset={8}>
          {categories.map((category) => (
            <DropdownMenuItem
              key={category.id}
              render={
                <a href={`/products/${category.slug}`} />
              }
            >
              {category.name}
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
