import { getTranslations } from "next-intl/server";
import { Truck, RotateCcw, Headphones, CreditCard } from "lucide-react";

const icons = [
  Truck,
  Headphones,
  RotateCcw,
  CreditCard,
];

const featureKeys = [
  "freeShipping",
  "support",
  "returns",
  "payment",
] as const;

// Icons and translation keys share an index so each benefit pairs icon, title, and subtitle
export default async function FeaturesBar() {
  const t = await getTranslations("features");

  return (
    <div className="w-full bg-white dark:bg-gray-900 py-8 border-b border-gray-100 dark:border-gray-800">
      <div className="max-w-7xl mx-auto px-4">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
          {featureKeys.map((key, index) => {
            const Icon = icons[index];
            return (
              <div
                key={key}
                className="flex items-center gap-3 sm:gap-4 justify-center lg:justify-start"
              >
                <div className="shrink-0">
                  <Icon
                    className="w-7 h-7 sm:w-8 sm:h-8 text-gray-700 dark:text-gray-300"
                    strokeWidth={1.5}
                  />
                </div>
                <div className="flex flex-col text-right">
                  <h3 className="font-bold text-gray-900 dark:text-gray-100 text-sm lg:text-base">
                    {t(`${key}.title`)}
                  </h3>
                  <p className="text-gray-500 dark:text-gray-400 text-xs lg:text-sm mt-1">
                    {t(`${key}.subtitle`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
