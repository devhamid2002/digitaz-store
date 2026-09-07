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
          <span className="group flex cursor-pointer items-center gap-1.5 transition-colors hover:text-blue-500 dark:hover:text-blue-500">
            <MapPin
              size={15}
              className="transition-colors group-hover:text-blue-500"
            />
            {messages.findStore}
          </span>

          <span
            aria-hidden="true"
            className="text-neutral-300 dark:text-neutral-400"
          >
            |
          </span>

          <span className="group flex cursor-pointer items-center gap-1.5 transition-colors hover:text-blue-500 dark:hover:text-blue-500">
            <Truck
              size={15}
              className="transition-colors group-hover:text-blue-500"
            />
            {messages.customerCare}
          </span>

          <span
            aria-hidden="true"
            className="text-neutral-300 dark:text-neutral-400"
          >
            |
          </span>

          <span className="group flex cursor-pointer items-center gap-1.5 transition-colors hover:text-blue-500 dark:hover:text-blue-500">
            <Store
              size={15}
              className="transition-colors group-hover:text-blue-500"
            />
            {messages.store}
          </span>
        </div>
        <p>{messages.shipping}</p>
      </div>
    </div>
  );
}