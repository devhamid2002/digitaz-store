"use client";

import { useState } from "react";
import { DirectionProvider } from "@base-ui/react/direction-provider";
import { useLocale, useTranslations } from "next-intl";
import { Slider } from "@/components/ui/slider";
import { formatPrice, type Locale } from "@/utils/format";

interface Props {
  min: number;
  max: number;
  initialMin?: number;
  initialMax?: number;
}

const STEP = 1000;

export default function PriceRangeFilter({
  min,
  max,
  initialMin,
  initialMax,
}: Props) {
  const locale = useLocale() as Locale;
  const t = useTranslations("search");
  const step = max - min >= STEP ? STEP : 1;
  const sliderMax = min + Math.floor((max - min) / step) * step;

  const [values, setValues] = useState<number[]>(() => {
    const start = Math.min(Math.max(initialMin ?? min, min), sliderMax);
    const end = Math.min(Math.max(initialMax ?? sliderMax, min), sliderMax);

    return start <= end ? [start, end] : [end, start];
  });

  if (max <= min) return null;

  const displayMin = values[0] <= min ? min : values[0];
  const displayMax = values[1] >= sliderMax ? max : values[1];

  return (
    <div>
      <p className="text-xs leading-5 text-gray-500 dark:text-gray-400">
        {t("priceFromTo", {
          from: formatPrice(displayMin, locale),
          to: formatPrice(displayMax, locale),
        })}
      </p>

      <DirectionProvider direction={locale === "fa" ? "rtl" : "ltr"}>
        <Slider
          className="mt-3"
          value={values}
          onValueChange={(next) => {
            const nextValues =
              typeof next === "number" ? [next, next] : Array.from(next);
            setValues([
              Math.min(nextValues[0], nextValues[1]),
              Math.max(nextValues[0], nextValues[1]),
            ]);
          }}
          min={min}
          max={sliderMax}
          step={step}
          minStepsBetweenValues={1}
        />
      </DirectionProvider>

      {values[0] > min && (
        <input type="hidden" name="minPrice" value={values[0]} />
      )}
      {values[1] < sliderMax && (
        <input type="hidden" name="maxPrice" value={values[1]} />
      )}
    </div>
  );
}
