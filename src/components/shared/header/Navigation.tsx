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
    <nav className="border-b border-neutral-100 dark:border-neutral-800">
      <div className="mx-auto flex min-h-[50px] max-w-[1280px] items-stretch px-5">
        {/* Categories button */}
        <button
          type="button"
          onClick={onToggle}
          className="flex min-w-[255px] items-center justify-between bg-[#2161e8] px-5 text-sm font-bold text-white transition-colors hover:bg-[#1854d1]"
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

        {/* Navigation links */}
        <div className="flex flex-1 items-center justify-center gap-12">
          {/* Products */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800 transition-colors hover:text-[#2161e8] dark:text-neutral-200 dark:hover:text-[#2161e8]"
          >
            {messages.products}
            <ChevronDown size={13} />
          </button>

          {/* Pages */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800 transition-colors hover:text-[#2161e8] dark:text-neutral-200 dark:hover:text-[#2161e8]"
          >
            {messages.pages}
            <ChevronDown size={13} />
          </button>

          {/* Blog */}
          <button
            type="button"
            className="flex items-center gap-1.5 text-sm font-semibold text-neutral-800 transition-colors hover:text-[#2161e8] dark:text-neutral-200 dark:hover:text-[#2161e8]"
          >
            {messages.blog}
            <ChevronDown size={13} />
          </button>

          {/* Contact */}
          <button
            type="button"
            className="text-sm font-semibold text-neutral-800 transition-colors hover:text-[#2161e8] dark:text-neutral-200 dark:hover:text-[#2161e8]"
          >
            {messages.contact}
          </button>

          {/* Special Offer */}
          <button
            type="button"
            className="text-sm font-bold text-neutral-900 transition-colors hover:text-[#2161e8] dark:text-neutral-100 dark:hover:text-[#2161e8]"
          >
            {messages.specialOffer}
          </button>

          {/* Phone */}
          <button
            type="button"
            className="flex items-center gap-2 text-sm font-bold text-neutral-800 transition-colors hover:text-[#2161e8] dark:text-neutral-200 dark:hover:text-[#2161e8]"
          >
            <Phone size={16} />
            {messages.phone}
          </button>
        </div>
      </div>
    </nav>
  );
}