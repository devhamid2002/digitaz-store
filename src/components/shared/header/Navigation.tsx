import {
    Menu,
    ChevronDown,
    ChevronUp,
    Phone,
  } from "lucide-react";
  
  interface Props {
    messages: {
      categories: string;
      products: string;
      pages: string;
      blog: string;
      contact: string;
      specialOffer: string;
      phone: string;
    };
    open: boolean;
    onToggle: () => void;
  }
  
  export default function Navigation({
    messages,
    open,
    onToggle,
  }: Props) {
    return (
      <nav className="border-b border-neutral-100">
        <div className="mx-auto flex min-h-[50px] max-w-[1280px] items-stretch px-5">
  
          <button
            onClick={onToggle}
            className="flex min-w-[255px] items-center justify-between bg-[#2161e8] px-5 text-sm font-bold text-white"
          >
            <span className="flex items-center gap-3">
              <Menu size={19} />
              {messages.categories}
            </span>
  
            {open ? (
              <ChevronUp size={17} />
            ) : (
              <ChevronDown size={17} />
            )}
          </button>
  
          <div className="flex flex-1 items-center justify-center gap-12">
  
            <button className="flex items-center gap-1.5 text-sm font-semibold">
              {messages.products}
              <ChevronDown size={13} />
            </button>
  
            <button className="flex items-center gap-1.5 text-sm font-semibold">
              {messages.pages}
              <ChevronDown size={13} />
            </button>
  
            <button className="flex items-center gap-1.5 text-sm font-semibold">
              {messages.blog}
              <ChevronDown size={13} />
            </button>
  
            <button className="text-sm font-semibold">
              {messages.contact}
            </button>

            <button className="text-sm font-bold">
              {messages.specialOffer}
            </button>
  
            <button className="flex items-center gap-2 text-sm font-bold">
              <Phone size={16} />
              {messages.phone}
            </button>
  
  
          </div>
        </div>
      </nav>
    );
  }