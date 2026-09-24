import type { Metadata } from "next";
import { getMessages, setRequestLocale } from "next-intl/server";
import localFont from "next/font/local";
import { notFound } from "next/navigation";
import { routing } from "@/i18n/routing";
import Providers from "@/components/providers/Providers";
import ThemeProvider from "@/components/providers/ThemeProvider";
import Header from "@/components/shared/header/Header";
import Footer from "@/components/shared/footer/Footer";

const vazirmatn = localFont({
  src: [
    { path: "../../../public/font/Vazirmatn-Thin.woff2", weight: "100" },
    { path: "../../../public/font/Vazirmatn-ExtraLight.woff2", weight: "200" },
    { path: "../../../public/font/Vazirmatn-Light.woff2", weight: "300" },
    { path: "../../../public/font/Vazirmatn-Regular.woff2", weight: "400" },
    { path: "../../../public/font/Vazirmatn-Medium.woff2", weight: "500" },
    { path: "../../../public/font/Vazirmatn-SemiBold.woff2", weight: "600" },
    { path: "../../../public/font/Vazirmatn-Bold.woff2", weight: "700" },
    { path: "../../../public/font/Vazirmatn-ExtraBold.woff2", weight: "800" },
    { path: "../../../public/font/Vazirmatn-Black.woff2", weight: "900" },
    { path: "../../../public/font/Vazirmatn[wght].woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

type Props = {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
};

// Prerender one static shell per supported locale
export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }));
}

// Resolve localized SEO metadata from the message catalog
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const messages = await getMessages({ locale });
  const metadata = messages.metadata as {
    title: string;
    description: string;
    keywords: string[];
  };

  return {
    title: metadata.title,
    description: metadata.description,
    keywords: metadata.keywords,
  };
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params;

  // Unknown locales fall through to the root not-found boundary
  if (!routing.locales.includes(locale as "en" | "fa")) {
    notFound();
  }

  setRequestLocale(locale);
  const messages = await getMessages();

  return (
    <html lang={locale} dir={locale === "fa" ? "rtl" : "ltr"} className="h-full antialiased" suppressHydrationWarning>
      <body className={`${vazirmatn.variable} ${vazirmatn.className} min-h-full flex flex-col overflow-x-hidden`}>
        <ThemeProvider>
          <Providers locale={locale} messages={messages}>
            <Header locale={locale as "en" | "fa"} />
            {children}
            <Footer locale={locale as "en" | "fa"} />
          </Providers>
        </ThemeProvider>
      </body>
    </html>
  );
}
