"use client";

import { useState } from "react";
import Image from "next/image";
import { Expand } from "lucide-react";

interface ProductGalleryProps {
  image: string;
  name: string;
}

export default function ProductGallery({ image, name }: ProductGalleryProps) {
  // Single backend image for now; duplicate as placeholder thumbs until gallery API exists
  const images = [image, image, image, image];
  const [selected, setSelected] = useState(0);
  const [zoomed, setZoomed] = useState(false);

  return (
    <div className="w-full">
      <div className="flex flex-col-reverse gap-4 sm:flex-row">
        <div className="flex gap-3 overflow-x-auto pb-1 sm:flex-col sm:overflow-visible sm:pb-0">
          {images.map((src, index) => (
            <button
              key={index}
              type="button"
              onClick={() => setSelected(index)}
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

        <div className="relative aspect-[4/3] max-h-[320px] w-full overflow-hidden rounded-2xl bg-gray-100 sm:aspect-square sm:max-h-none dark:bg-night-surface">
          <Image
            src={images[selected]}
            alt={name}
            fill
            className="object-contain p-6"
            sizes="(max-width: 1024px) 100vw, 50vw"
            priority
          />
          <button
            type="button"
            onClick={() => setZoomed(true)}
            aria-label="zoom"
            className="absolute bottom-4 end-4 flex h-10 w-10 items-center justify-center rounded-full bg-white text-gray-900 shadow-md transition-transform hover:scale-105 dark:bg-night dark:text-white"
          >
            <Expand size={18} />
          </button>
        </div>
      </div>

      {zoomed && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4"
          onClick={() => setZoomed(false)}
          role="dialog"
          aria-modal="true"
        >
          <div className="relative aspect-square w-full max-w-2xl overflow-hidden rounded-2xl bg-white dark:bg-night-surface">
            <Image
              src={images[selected]}
              alt={name}
              fill
              className="object-contain p-8"
              sizes="100vw"
            />
          </div>
        </div>
      )}
    </div>
  );
}
