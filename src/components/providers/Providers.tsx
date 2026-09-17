"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";

type Props = {
  children: React.ReactNode;
  locale: string;
  messages?: Record<string, unknown>;
};

/**
 * Locale-aware providers: Session, Query, and Intl.
 * ThemeProvider wraps this from the locale layout, since next-themes must render
 * its inline script inside the document.
 */
export default function Providers({ children, locale, messages }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <SessionProvider>
      <QueryClientProvider client={queryClient}>
        <NextIntlClientProvider locale={locale} messages={messages}>
          {children}
        </NextIntlClientProvider>
      </QueryClientProvider>
    </SessionProvider>
  );
}
