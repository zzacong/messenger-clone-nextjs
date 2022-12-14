'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
    },
  },
});

export function QueryProvider({ children }: React.PropsWithChildren<unknown>) {
  return <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>;
}
