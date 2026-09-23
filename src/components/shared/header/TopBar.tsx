import { MapPin, Truck, Store } from "lucide-react";

interface Props {
  messages: {
    shipping: string;
    findStore: string;
    customerCare: string;
    store: string;
  };
}

export default function TopBar({ messages }: Props) {
  return (
    <div className="border-b border-neutral-100 dark:border-neutral-800">
      <div className="mx-auto flex h-11 max-w-[1280px] items-center justify-between px-5 text-[12px] text-neutral-500 dark:text-neutral-400">
        <div className="flex items-center gap-3">
          <span className="group flex cursor-pointer items-center gap-1.5 transition-colors hover:text-brand-vivid dark:hover:text-brand-vivid">
            <MapPin
              size={15}
              className="transition-colors group-hover:text-brand-vivid"
            />
            {messages.findStore}
          </span>

          <span
            aria-hidden="true"
            className="text-neutral-300 dark:text-neutral-700"
          >
            |
          </span>

          <span className="group flex cursor-pointer items-center gap-1.5 transition-colors hover:text-brand-vivid dark:hover:text-brand-vivid">
            <Truck
              size={15}
              className="transition-colors group-hover:text-brand-vivid"
            />
            {messages.customerCare}
          </span>

          <span
            aria-hidden="true"
            className="text-neutral-300 dark:text-neutral-700"
          >
            |
          </span>

          <span className="group flex cursor-pointer items-center gap-1.5 transition-colors hover:text-brand-vivid dark:hover:text-brand-vivid">
            <Store
              size={15}
              className="transition-colors group-hover:text-brand-vivid"
            />
            {messages.store}
          </span>
        </div>
        <p>{messages.shipping}</p>
      </div>
    </div>
  );
}