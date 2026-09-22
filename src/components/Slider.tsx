"use client";

import Image from "next/image";
import { useQuery } from "@tanstack/react-query";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import { getBanners } from "@/features/banners/services/bannerService";

// Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";

/**
 * Main page slider with autoplay, pagination dots, and left/right navigation arrows.
 * Banner images come from GET /api/banners.
 */
export default function Slider() {
  const { data: banners = [], isLoading } = useQuery({
    queryKey: ["banners"],
    queryFn: getBanners,
  });

  if (isLoading) {
    return (
      <div className="w-full h-[350px] bg-gray-200 dark:bg-gray-800 animate-pulse" />
    );
  }

  if (banners.length === 0) {
    return null;
  }

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
          <div className="relative w-full h-[350px]">
            <Image
              src={banner.image}
              alt={banner.alt}
              fill
              className="object-cover"
              sizes="100vw"
              priority
            />
          </div>
        </SwiperSlide>
      ))}
    </Swiper>
  );
}
