"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

type Props = {
  children: React.ReactNode;
};

/**
 * Theme provider wrapper.
 * Must be rendered inside the document (<html>/<body>, i.e. in the locale layout):
 * next-themes renders a synchronous inline <script>, and React cannot render a sync
 * script outside the main document without knowing its order.
 */
export default function ThemeProvider({ children }: Props) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
