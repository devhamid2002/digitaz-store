import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";

const vazirmatn = localFont({
  src: [
    { path: "../../public/font/Vazirmatn-Thin.woff2", weight: "100" },
    { path: "../../public/font/Vazirmatn-ExtraLight.woff2", weight: "200" },
    { path: "../../public/font/Vazirmatn-Light.woff2", weight: "300" },
    { path: "../../public/font/Vazirmatn-Regular.woff2", weight: "400" },
    { path: "../../public/font/Vazirmatn-Medium.woff2", weight: "500" },
    { path: "../../public/font/Vazirmatn-SemiBold.woff2", weight: "600" },
    { path: "../../public/font/Vazirmatn-Bold.woff2", weight: "700" },
    { path: "../../public/font/Vazirmatn-ExtraBold.woff2", weight: "800" },
    { path: "../../public/font/Vazirmatn-Black.woff2", weight: "900" },
    { path: "../../public/font/Vazirmatn[wght].woff2", weight: "100 900", style: "normal" },
  ],
  variable: "--font-vazirmatn",
  display: "swap",
});

export const metadata: Metadata = {
  title: "digitaz-store",
  description: "",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="fa" dir="rtl" className="h-full antialiased">
      <body className={`${vazirmatn.variable} ${vazirmatn.className} min-h-full flex flex-col`}>

        {children}
      </body>
    </html>
  );
}
