"use client";

import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import RevealObserver from "@/components/marketing/RevealObserver";
import { InterestDialogProvider } from "@/components/marketing/InterestDialog";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: { staleTime: 60_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <InterestDialogProvider>
          {/* <RevealObserver /> */}
          {children}
        </InterestDialogProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}
