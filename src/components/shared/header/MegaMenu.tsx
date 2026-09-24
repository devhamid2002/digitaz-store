"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { RiMenu5Fill } from "react-icons/ri";

import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";

import { getCategories } from "@/features/categories/services/categoryService";
import type { Category } from "@/features/categories/types/category";

export default function MegaMenu() {
  // Subscribe to the category tree for hover-driven three-pane navigation
  const { data: categories = [] } = useQuery({
    queryKey: ["categories"],
    queryFn: getCategories,
  });

  const [activeCategory, setActiveCategory] = useState<Category | null>(
    categories[0] ?? null
  );
  const [activeSubCategory, setActiveSubCategory] =
    useState<Category | null>(null);

  const handleCategoryEnter = (category: Category) => {
    // Switching top-level categories resets the drilled-in subcategory pane
    setActiveCategory(category);
    setActiveSubCategory(null);
  };

  const handleSubCategoryEnter = (subcategory: Category) => {
    setActiveSubCategory(subcategory);
  };

  return (
    <NavigationMenu dir="rtl">
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger
            className="
              bg-brand-strong
              p-6
              text-sm
              font-medium
              text-white
              hover:bg-brand-strong-hover
              focus:bg-brand-strong-hover
            "
          >
            <RiMenu5Fill size={15} />
            دسته‌بندی محصولات
          </NavigationMenuTrigger>

          <NavigationMenuContent>
            <div
              className="
                w-[900px]
                overflow-hidden
                rounded-xl
                border
                bg-background
                shadow-xl
              "
            >
              <div className="flex min-h-[400px]">
                <div
                  className="
                    w-[30%]
                    border-l
                    bg-muted/30
                    p-3
                  "
                >
                  <div
                    className="
                      mb-3
                      px-3
                      text-xs
                      font-semibold
                      text-muted-foreground
                    "
                  >
                    دسته‌بندی‌ها
                  </div>

                  <div className="space-y-1">
                    {categories.map((category) => {
                      const isActive =
                        activeCategory?.id === category.id;

                      return (
                        <button
                          key={category.id}
                          type="button"
                          onMouseEnter={() =>
                            handleCategoryEnter(category)
                          }
                          className={`
                            group
                            flex
                            w-full
                            items-center
                            justify-between
                            rounded-lg
                            px-3
                            py-2.5
                            text-right
                            text-sm
                            transition-colors

                            ${
                              isActive
                                ? "bg-primary text-primary-foreground"
                                : "hover:bg-muted"
                            }
                          `}
                        >
                          <span>{category.name}</span>

                          {category.children?.length ? (
                            <ChevronLeft
                              size={16}
                              className="
                                text-current
                                transition-transform
                              "
                            />
                          ) : null}
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div
                  className="
                    w-[30%]
                    border-l
                    p-5
                  "
                >
                  {activeCategory?.children?.length ? (
                    <>
                      <div className="mb-4 flex items-center justify-between gap-3">
                        <h3 className="text-sm font-bold">
                          {activeCategory.name}
                        </h3>

                        <Link
                          href={`/products`}
                          className="
                            whitespace-nowrap
                            text-xs
                            text-primary
                            transition-colors
                            hover:text-brand-vivid
                          "
                        >
                          مشاهده همه
                        </Link>
                      </div>

                      <div className="space-y-1">
                        {activeCategory.children.map(
                          (subcategory) => {
                            const isActive =
                              activeSubCategory?.id ===
                              subcategory.id;

                            return (
                              <button
                                key={subcategory.id}
                                type="button"
                                onMouseEnter={() =>
                                  handleSubCategoryEnter(
                                    subcategory
                                  )
                                }
                                className={`
                                  flex
                                  w-full
                                  items-center
                                  justify-between
                                  rounded-lg
                                  px-3
                                  py-2.5
                                  text-right
                                  text-sm
                                  transition-colors

                                  ${
                                    isActive
                                      ? "bg-muted font-medium"
                                      : "hover:bg-muted"
                                  }
                                `}
                              >
                                <span>
                                  {subcategory.name}
                                </span>

                                {subcategory.children?.length ? (
                                  <ChevronLeft
                                    size={15}
                                    className="
                                      text-muted-foreground
                                    "
                                  />
                                ) : null}
                              </button>
                            );
                          }
                        )}
                      </div>
                    </>
                  ) : (
                    <div className="text-sm text-muted-foreground">
                      محصولی موجود نیست
                    </div>
                  )}
                </div>

                {activeSubCategory?.children?.length ? (
                  <div className="flex-1 border-l p-5">
                    <div className="mb-4 flex items-center justify-between">
                      <h3 className="text-sm font-bold">
                        {activeSubCategory.name}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {activeSubCategory.children.map((item) => (
                        <Link
                          key={item.id}
                          href={`/products/${item.slug}`}
                          className="
                            rounded-lg
                            px-3
                            py-2.5
                            text-sm
                            text-muted-foreground
                            transition-colors
                            hover:bg-muted
                            hover:text-foreground
                          "
                        >
                          {item.name}
                        </Link>
                      ))}
                    </div>
                  </div>
                ) : null}
              </div>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}
