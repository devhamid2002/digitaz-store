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
    <nav className="hidden border-b border-neutral-100 md:block dark:border-neutral-800">
      {/* Primary navigation with catalog menu, placeholder links, and locale controls */}
      <div className="mx-auto flex min-h-[50px] max-w-[1280px] items-stretch px-5">
        <MegaMenu />

        <div className="flex flex-1 items-center justify-center gap-6">
          <button
            type="button"
            className="text-sm font-semibold text-neutral-800 transition-colors hover:text-brand dark:text-neutral-200 dark:hover:text-brand-ink"
          >
            {messages.products}
          </button>

          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
            |
          </span>

          <button
            type="button"
            className="text-sm font-semibold text-neutral-800 transition-colors hover:text-brand dark:text-neutral-200 dark:hover:text-brand-ink"
          >
            {messages.pages}
          </button>

          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
            |
          </span>

          <button
            type="button"
            className="text-sm font-semibold text-neutral-800 transition-colors hover:text-brand dark:text-neutral-200 dark:hover:text-brand-ink"
          >
            {messages.blog}
          </button>

          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
            |
          </span>

          <button
            type="button"
            className="text-sm font-semibold text-neutral-800 transition-colors hover:text-brand dark:text-neutral-200 dark:hover:text-brand-ink"
          >
            {messages.contact}
          </button>

          <span aria-hidden="true" className="text-neutral-300 dark:text-neutral-700">
            |
          </span>

          <button
            type="button"
            className="text-sm font-bold text-neutral-900 transition-colors hover:text-brand dark:text-neutral-100 dark:hover:text-brand-ink"
          >
            {messages.specialOffer}
          </button>
        </div>

        <div className="flex items-center gap-4">
          <LanguageSwitcher />

          <button
            type="button"
            className="flex items-center gap-2 text-sm font-bold text-neutral-800 transition-colors hover:text-brand dark:text-neutral-200 dark:hover:text-brand-ink"
          >
            {messages.phone}
          </button>
        </div>
      </div>
    </nav>
  );
}
