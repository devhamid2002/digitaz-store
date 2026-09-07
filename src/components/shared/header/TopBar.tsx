import {
    MapPin,
    Truck,
    Store,
  } from "lucide-react";
  
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
      <div className="border-b border-neutral-100">
        <div className="mx-auto flex h-11 max-w-[1280px] items-center justify-between px-5 text-[12px] text-neutral-500">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5">
              <MapPin size={15} />
              {messages.findStore}
            </span>

            <span aria-hidden="true" className="text-neutral-300">
              |
            </span>

            <span className="flex items-center gap-1.5">
              <Truck size={15} />
              {messages.customerCare}
            </span>

            <span aria-hidden="true" className="text-neutral-300">
              |
            </span>

            <span className="flex items-center gap-1.5">
              <Store size={15} />
              {messages.store}
            </span>
          </div>
  
          <p>{messages.shipping}</p>
        </div>
      </div>
    );
  }