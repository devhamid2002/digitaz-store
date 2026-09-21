"use client";

import { useTranslations } from "next-intl";
import Image from "next/image";

const bannerKeys = ["banner1", "banner2", "banner3"] as const;

const bannerStyles = [
  "bg-gray-100 dark:bg-gray-800",
  "bg-orange-50 dark:bg-orange-950",
  "bg-gray-200 dark:bg-gray-700",
];

const bannerImages = [
  "/images/headphone/06.png",
  "/images/mobile/05.png",
  "/images/headphone/07.png",
];

export default function PromoBanners() {
  const t = useTranslations("promoBanners");

  return (
    <div className="w-full bg-white dark:bg-gray-900 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bannerKeys.map((key, index) => (
            <div
              key={key}
              className={`relative overflow-hidden rounded-xl ${bannerStyles[index]} h-64 md:h-72 flex items-center justify-between p-6 transition-all duration-300 hover:shadow-lg`}
            >
              <div className="z-10 flex flex-col justify-center h-full w-1/2">
                <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2 leading-relaxed">
                  {t(`${key}.title`)}
                </h2>

                <div className="mt-2">
                  <span className="text-sm text-gray-600 dark:text-gray-400 block mb-1">
                    {t(`${key}.priceLabel`)}
                  </span>
                  <span className="text-2xl font-bold text-red-600 dark:text-red-400">
                    {t(`${key}.price`)}
                  </span>
                </div>

                {key === "banner3" && (
                  <span className="text-sm text-gray-400 dark:text-gray-500 line-through mt-1">
                    {t(`${key}.oldPrice`)}
                  </span>
                )}
              </div>

              <div className="relative w-1/2 h-full flex items-center justify-center">
                <div className="relative w-full h-full">
                  <Image
                    src={bannerImages[index]}
                    alt={t(`${key}.title`)}
                    fill
                    className="object-contain object-left md:object-center mix-blend-multiply dark:mix-blend-lighten"
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
