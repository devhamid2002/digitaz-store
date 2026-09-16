import MegaMenu from "./MegaMenu";
import LanguageSwitcher from "./LanguageSwitcher";

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
}

export default function Navigation({ messages }: Props) {
  return (
    <nav className="border-b border-neutral-100 dark:border-neutral-800">
      <div className="mx-auto flex min-h-[50px] max-w-[1280px] items-stretch px-5">
        {/* Section 1: Categories */}
        <MegaMenu />

        {/* Section 2: Menu links */}
        <div className="flex flex-1 items-center justify-center gap-6">
          <button
            type="button"
            className="text-sm font-semibold text-neutral-800 transition-colors hover:text-[#2161e8] dark:text-neutral-200 dark:hover:text-blue-400"
          >
            {messages.products}
          </button>

          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
            |
          </span>

          <button
            type="button"
            className="text-sm font-semibold text-neutral-800 transition-colors hover:text-[#2161e8] dark:text-neutral-200 dark:hover:text-blue-400"
          >
            {messages.pages}
          </button>

          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
            |
          </span>

          <button
            type="button"
            className="text-sm font-semibold text-neutral-800 transition-colors hover:text-[#2161e8] dark:text-neutral-200 dark:hover:text-blue-400"
          >
            {messages.blog}
          </button>

          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
            |
          </span>

          <button
            type="button"
            className="text-sm font-semibold text-neutral-800 transition-colors hover:text-[#2161e8] dark:text-neutral-200 dark:hover:text-blue-400"
          >
            {messages.contact}
          </button>

          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
            |
          </span>

          <button
            type="button"
            className="text-sm font-bold text-neutral-900 transition-colors hover:text-[#2161e8] dark:text-neutral-100 dark:hover:text-blue-400"
          >
            {messages.specialOffer}
          </button>
        </div>

        {/* Section 3: Language switcher + Phone */}
        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <button
            type="button"
            className="flex items-center gap-2 text-sm font-bold text-neutral-800 transition-colors hover:text-[#2161e8] dark:text-neutral-200 dark:hover:text-blue-400"
          >
            {messages.phone}
          </button>
        </div>
      </div>
    </nav>
  );
}
