"use client";

import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/**
 * Test banner data — solid color backgrounds with Persian text.
 * In production, this will come from a CMS or API.
 */
const banners = [
  {
    id: 1,
    bg: "bg-blue-600",
    title: "تخفیف ویژه تابستانی",
    subtitle: "تا ۵۰٪ تخفیف روی محصولات منتخب",
  },
  {
    id: 2,
    bg: "bg-red-500",
    title: "محصولات جدید",
    subtitle: "جدیدترین گجت‌های هوشمند موجود شد",
  },
  {
    id: 3,
    bg: "bg-emerald-600",
    title: "ارسال رایگان",
    subtitle: "ارسال رایگان برای سفارش‌های بالای ۵۰۰ هزار تومان",
  },
];

/**
 * Main page slider with autoplay, pagination dots, and left/right navigation arrows.
 */
export default function Slider() {
  return (
    <Swiper
      modules={[Autoplay, Pagination, Navigation]}
      autoplay={{ delay: 4000, disableOnInteraction: false }}
      pagination={{ clickable: true }}
      navigation
      loop
      className="w-full"
    >
      {banners.map((banner) => (
        <SwiperSlide key={banner.id}>
          <div
            className={`${banner.bg} flex h-[350px] items-center justify-center text-white`}
          >
            <div className="text-center">
              <h2 className="mb-3 text-3xl font-bold">{banner.title}</h2>
              <p className="text-lg opacity-90">{banner.subtitle}</p>
            </div>
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
