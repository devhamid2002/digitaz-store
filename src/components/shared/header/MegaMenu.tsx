"use client";

import { useState } from "react";
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

type Category = {
  title: string;
  href?: string;
  children?: Category[];
};

const categories: Category[] = [
  {
    title: "لوازم جانبی موبایل",
    children: [
      {
        title: "گجت های موبایل",
      },
      {
        title: "کاور و محافظ موبایل",
      },
      {
        title: "ساعت هوشمند",
      },
    ],
  },

  {
    title: "لوازم جانبی رایانه",
    children: [
      {
        title: "لوازم جانبی لپ تاپ",
        children: [
          { title: "کیف لپ تاپ", href: "/products/laptop-bags" },
          { title: "کول پد", href: "/products/cooling-pads" },
          { title: "ماوس", href: "/products/mouse" },
          { title: "کیبورد", href: "/products/keyboards" },
        ],
      },
      {
        title: "تجهیزات کامپیوتر",
        children: [
          { title: "وب کم", href: "/products/webcams" },
          { title: "میکروفون", href: "/products/microphones" },
          { title: "اسپیکر", href: "/products/speakers" },
          { title: "هاب USB", href: "/products/usb-hubs" },
        ],
      },
    ],
  },

  {
    title: "لوازم جانبی خودرو",
    children: [
      {
        title: "لوازم داخل خودرو",
        children: [
          { title: "هولدر موبایل", href: "/products/car-holders" },
          { title: "شارژر فندکی", href: "/products/car-chargers" },
          { title: "دوربین خودرو", href: "/products/dash-cams" },
        ],
      },
      {
        title: "تجهیزات خودرو",
        children: [
          { title: "کمپرسور", href: "/products/compressors" },
          { title: "جامپ استارتر", href: "/products/jump-starters" },
        ],
      },
    ],
  },

  {
    title: "صوتی و تصویری",
    children: [
      {
        title: "لوازم صوتی",
        children: [
          { title: "اسپیکر", href: "/products/speakers" },
          { title: "هدفون", href: "/products/headphones" },
          { title: "میکروفون", href: "/products/microphones" },
        ],
      },
      {
        title: "لوازم تصویری",
        children: [
          { title: "پروژکتور", href: "/products/projectors" },
          {
            title: "تجهیزات تصویری",
            href: "/products/video-accessories",
          },
        ],
      },
    ],
  },

  {
    title: "خانه و آشپزخانه",
    children: [
      {
        title: "لوازم آشپزخانه",
        children: [
          {
            title: "لوازم برقی",
            href: "/products/kitchen-appliances",
          },
          {
            title: "ابزار آشپزی",
            href: "/products/cooking-tools",
          },
          {
            title: "ظروف",
            href: "/products/dishes",
          },
        ],
      },
      {
        title: "لوازم خانه",
        children: [
          {
            title: "دکوراسیون",
            href: "/products/decorations",
          },
          {
            title: "نظافت",
            href: "/products/cleaning",
          },
        ],
      },
    ],
  },

  {
    title: "زیبایی و سلامت",
    children: [
      {
        title: "مراقبت شخصی",
        children: [
          {
            title: "لوازم اصلاح",
            href: "/products/shaving",
          },
          {
            title: "مراقبت پوست",
            href: "/products/skincare",
          },
          {
            title: "مراقبت مو",
            href: "/products/hair-care",
          },
        ],
      },
    ],
  },

  {
    title: "مد و پوشاک",
    children: [
      {
        title: "پوشاک",
        children: [
          {
            title: "لباس مردانه",
            href: "/products/men-clothing",
          },
          {
            title: "لباس زنانه",
            href: "/products/women-clothing",
          },
          {
            title: "اکسسوری",
            href: "/products/accessories",
          },
        ],
      },
    ],
  },

  {
    title: "ورزش و سفر",
    children: [
      {
        title: "ورزش",
        children: [
          {
            title: "لوازم ورزشی",
            href: "/products/sports",
          },
          {
            title: "فیتنس",
            href: "/products/fitness",
          },
        ],
      },
      {
        title: "سفر",
        children: [
          {
            title: "کوله پشتی",
            href: "/products/backpacks",
          },
          {
            title: "لوازم سفر",
            href: "/products/travel",
          },
        ],
      },
    ],
  },
];

export default function MegaMenu() {
  const [activeCategory, setActiveCategory] =
    useState<Category | null>(categories[0]);

  const [activeSubCategory, setActiveSubCategory] =
    useState<Category | null>(null);

  const handleCategoryEnter = (category: Category) => {
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
              bg-blue-600
              p-6
              text-sm
              font-medium
              text-white
              hover:bg-blue-800
              focus:bg-blue-800
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
                        activeCategory?.title === category.title;

                      return (
                        <button
                          key={category.title}
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
                          <span>{category.title}</span>

                          {/* Arrow ONLY if category has children */}
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
                          {activeCategory.title}
                        </h3>

                        <Link
                          href="/products"
                          className="
                            whitespace-nowrap
                            text-xs
                            text-primary
                            transition-colors
                            hover:text-blue-500
                          "
                        >
                          مشاهده همه
                        </Link>
                      </div>

                      <div className="space-y-1">
                        {activeCategory.children.map(
                          (subcategory) => {
                            const isActive =
                              activeSubCategory?.title ===
                              subcategory.title;

                            return (
                              <button
                                key={subcategory.title}
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
                                  {subcategory.title}
                                </span>

                                {/* Arrow ONLY if this
                                    subcategory has children */}
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
                        {activeSubCategory.title}
                      </h3>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      {activeSubCategory.children.map((item) => (
                        <Link
                          key={item.title}
                          href={item.href ?? "#"}
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
                          {item.title}
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
