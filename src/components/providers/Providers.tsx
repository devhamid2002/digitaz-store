"use client";

import { useState } from "react";
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { SessionProvider } from "next-auth/react";
import { NextIntlClientProvider } from "next-intl";
import StoreProvider from "@/components/providers/StoreProvider";
import { Toaster, toast } from "@/components/ui/toast";

type Props = {
  children: React.ReactNode;
  locale: string;
  messages?: Record<string, unknown>;
};

export default function Providers({ children, locale, messages }: Props) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        // Surface failed action queries once, using the message the action resolved
        queryCache: new QueryCache({
          onError: (error) => {
            const title =
              error instanceof Error && error.message
                ? error.message
                : "Unexpected error";
            toast.add({ type: "error", title });
          },
        }),
        defaultOptions: {
          queries: {
            // Cache catalog reads for a minute and avoid refetch churn on focus
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  );

  return (
    <StoreProvider>
      <SessionProvider>
        <QueryClientProvider client={queryClient}>
          <NextIntlClientProvider locale={locale} messages={messages}>
            {children}
            <Toaster />
          </NextIntlClientProvider>
        </QueryClientProvider>
      </SessionProvider>
    </StoreProvider>
  );
}
