import {
    Search,
    UserRound,
    Heart,
    ShoppingBag,
    ChevronDown,
    ArrowUpDown,
  } from "lucide-react";
  
  interface Props {
    messages: {
      searchPlaceholder: string;
      allCategories: string;
    };
    isRTL?: boolean;
  }
  
  export default function MainHeader({ messages, isRTL = true }: Props) {
    return (
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className="border-b border-neutral-100"
      >
        <div className="mx-auto flex min-h-[105px] max-w-[1280px] items-center gap-8 px-5">

          {/* Logo - first in DOM so it sits right in RTL (fa) and left in LTR (en) */}
          <div className="flex shrink-0 items-center">
            <div className="flex items-center gap-2">
              <div className="relative h-9 w-9">
                <div className="absolute right-0 top-1 h-3 w-8 -rotate-45 rounded-full bg-[#4545d8]" />
                <div className="absolute right-0 top-3 h-3 w-8 -rotate-45 rounded-full bg-[#ef426f]" />
                <div className="absolute right-0 top-5 h-3 w-8 -rotate-45 rounded-full bg-[#315fdc]" />
              </div>

              <span className="text-[29px] font-black italic tracking-tight">
                digitaz
              </span>
            </div>
          </div>
  
          {/* Search - DOM order: categories → input → button.
              With dir=rtl (fa): categories right, button left.
              With dir=ltr (en): categories left, button right (reversed). */}
          <div className="mx-auto flex h-[48px] w-full max-w-[775px] overflow-hidden rounded-full border border-neutral-200">
  
            <div className="flex w-[145px] shrink-0 items-center justify-center gap-2 border-e border-neutral-200 text-sm text-neutral-600">
              <span>{messages.allCategories}</span>
              <ArrowUpDown size={15} />
              <ChevronDown size={14} />
            </div>
  
            <div className="flex flex-1 items-center">
              <input
                type="text"
                placeholder={messages.searchPlaceholder}
                className="h-full w-full bg-transparent px-5 text-start text-sm outline-none placeholder:text-neutral-400"
              />
            </div>
  
            <button className="flex w-[80px] shrink-0 items-center justify-center rounded-full bg-[#2161e8] text-white">
              <Search size={21} />
            </button>
          </div>
  
          {/* Actions - last in DOM so it sits left in RTL (fa) and right in LTR (en) */}
          <div className="flex items-center gap-5">

            <button>
              <UserRound
                size={23}
                strokeWidth={1.8}
              />
            </button>

            <button className="relative">
              <Heart
                size={24}
                strokeWidth={1.8}
              />

              <span className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                1
              </span>
            </button>

            <button className="relative">
              <ShoppingBag
                size={23}
                strokeWidth={1.8}
              />

              <span className="absolute -end-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                1
              </span>
            </button>
          </div>
        </div>
      </div>
    );
  }