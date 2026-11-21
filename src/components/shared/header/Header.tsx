import TopBar from "./TopBar";
import MainHeader from "./MainHeader";
import Navigation from "./Navigation";
import faMessages from "@/messages/fa.json";
import enMessages from "@/messages/en.json";

export type HeaderMessages = typeof faMessages.header;

type Locale = "fa" | "en";

interface HeaderProps {
  locale?: Locale;
}

export default function Header({ locale = "fa" }: HeaderProps) {
  // Server component: only the active locale's dictionary is sent to the client
  const messages: HeaderMessages = (
    locale === "fa" ? faMessages : enMessages
  ).header;

  const isRTL = locale === "fa";

  return (
    <header
      dir={isRTL ? "rtl" : "ltr"}
      className="w-full bg-white text-neutral-900 dark:bg-neutral-900 dark:text-neutral-100"
    >
      <TopBar messages={messages} />
      <MainHeader messages={messages} isRTL={isRTL} locale={locale} />
      <Navigation messages={messages} />
    </header>
  );
}
