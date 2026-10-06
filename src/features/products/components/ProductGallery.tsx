"use client";

import { useState } from "react";
import Image from "next/image";
import Zoom from "react-medium-image-zoom";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper";

import "swiper/css";
import "swiper/css/navigation";
import "react-medium-image-zoom/dist/styles.css";

interface ProductGalleryProps {
  image: string;
  name: string;
}

export default function ProductGallery({ image, name }: ProductGalleryProps) {
  // Single backend image for now; duplicate as placeholder thumbs until gallery API exists
  const images = [image, image, image, image];
  const [swiper, setSwiper] = useState<SwiperClass | null>(null);
  const [selected, setSelected] = useState(0);

  return (
    <div className="w-full">
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        <div className="flex gap-3 overflow-x-auto pb-1 sm:flex-col sm:overflow-visible sm:pb-0">
          {images.map((src, index) => (
            <button
              key={index}
              type="button"
              onClick={() => swiper?.slideTo(index)}
              aria-label={`view-${index + 1}`}
              aria-pressed={index === selected}
              className={`relative h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-gray-100 transition-all sm:h-20 sm:w-20 dark:bg-night-surface ${
                index === selected
                  ? "ring-2 ring-gray-900 ring-offset-2 dark:ring-white dark:ring-offset-night"
                  : "ring-1 ring-gray-200 hover:ring-gray-400 dark:ring-gray-700"
              }`}
            >
              <Image
                src={src}
                alt={`${name}-${index + 1}`}
                fill
                className="object-contain p-2"
                sizes="(max-width: 640px) 64px, 80px"
              />
            </button>
          ))}
        </div>

        <div className="relative min-w-0 flex-1">
          <Swiper
            modules={[Navigation]}
            navigation
            onSwiper={setSwiper}
            onSlideChange={(instance) => setSelected(instance.activeIndex)}
            className="overflow-hidden rounded-2xl bg-gray-100 dark:bg-night-surface"
          >
            {images.map((src, index) => (
              <SwiperSlide key={index}>
                <div className="relative aspect-[4/3] max-h-[320px] w-full sm:aspect-square sm:max-h-none">
                  <Zoom>
                    <Image
                      src={src}
                      alt={name}
                      fill
                      className="object-contain p-6"
                      sizes="(max-width: 1024px) 100vw, 50vw"
                      priority={index === 0}
                    />
                  </Zoom>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </div>
    </div>
  );
}
