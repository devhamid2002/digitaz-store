import Image from "next/image";
import { Trash2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { formatPrice, type Locale } from "@/utils/format";
import { CartItem } from "@/features/cart/types/cartType";

type OrderItemProps = {
  line: CartItem
  locale: Locale;
  labels: {
    color: string;
    size: string;
    quantity: string;
    remove: string;
  };
  onRemove?: () => void;
  pending?: boolean;
};

export default function OrderItem({
  line,
  locale,
  labels,
  onRemove,
  pending = false,
}: OrderItemProps) {
  const quantity = Number(line.qty) || 1;

  return (
    <li className="flex gap-4 p-4 sm:p-5">
        <Link href={`/product/${line.slug}`}>
            <Image
                src={line.image}
                alt={line.name}
                width={80}
                height={80}
                className="h-20 w-20 shrink-0 rounded-lg bg-gray-50 object-contain dark:bg-neutral-800"
            />
        </Link>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <Link
          href={`/product/${line.slug}`}
          className="text-sm font-bold text-gray-900 hover:text-brand dark:text-gray-100 dark:hover:text-brand-ink"
        >
          {line.name}
        </Link>

        {(line.color || line.size) && (
          <p className="flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-gray-500 dark:text-gray-400">
            {line.color && (
              <span>
                {labels.color}:{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {line.color}
                </span>
              </span>
            )}

            {line.color && line.size && (
              <span className="text-gray-300 dark:text-gray-600">|</span>
            )}

            {line.size && (
              <span>
                {labels.size}:{" "}
                <span className="font-medium text-gray-700 dark:text-gray-300">
                  {line.size}
                </span>
              </span>
            )}
          </p>
        )}

        <p className="mt-1 text-sm text-gray-600 tabular-nums dark:text-gray-400">
          {formatPrice(line.price, locale)}
          <span className="mx-1.5 text-gray-300 dark:text-gray-600">×</span>
          <span className="sr-only">{labels.quantity}: </span>
          {quantity}
        </p>
      </div>

      <div className="flex shrink-0 flex-col items-end justify-between">
        {onRemove && (
          <button
            type="button"
            onClick={onRemove}
            disabled={pending}
            aria-label={labels.remove}
            title={labels.remove}
            className="flex h-9 w-9 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-red-50 hover:text-red-600 disabled:cursor-not-allowed disabled:opacity-50 dark:hover:bg-red-950"
          >
            <Trash2 size={16} />
          </button>
        )}

        <span className="text-sm font-bold text-gray-900 tabular-nums dark:text-gray-100">
          {formatPrice(line.price * quantity, locale)}
        </span>
      </div>
    </li>
  );
}