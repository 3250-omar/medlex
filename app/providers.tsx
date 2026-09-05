"use client";

import { useState } from "react";
import {
  MutationCache,
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from "@tanstack/react-query";
import { ThemeProvider } from "@/components/theme/ThemeProvider";
import { InterestDialogProvider } from "@/components/marketing/InterestDialog";
import { Toaster } from "@/components/ui/toast";
import { showApiError } from "@/lib/api/errorToast";

export default function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        queryCache: new QueryCache({
          onError: (error, query) =>
            showApiError(error, query.meta?.suppressGlobalError === true),
        }),
        mutationCache: new MutationCache({
          onError: (error, _variables, _context, mutation) =>
            showApiError(error, mutation.meta?.suppressGlobalError === true),
        }),
        defaultOptions: {
          queries: { staleTime: 60_000, refetchOnWindowFocus: false },
        },
      }),
  );

  return (
    <Toaster>
      <QueryClientProvider client={queryClient}>
        {/* <ThemeProvider> */}
        <InterestDialogProvider>{children}</InterestDialogProvider>
        {/* </ThemeProvider> */}
      </QueryClientProvider>
    </Toaster>
  );
}
