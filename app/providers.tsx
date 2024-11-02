'use client';

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState, useEffect } from 'react';
import { AuthProvider } from '@/contexts/AuthContext';

export function Providers({ children }: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient({
    defaultOptions: {
      queries: {
        staleTime: 0, // Consider all data stale immediately
        gcTime: 1000 * 60 * 5, // 5 minutes
        refetchOnWindowFocus: true,
        refetchOnMount: true,
        refetchOnReconnect: true,
        retry: 2,
        retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      },
    },
  }));

  // Add this effect to prefetch data
  useEffect(() => {
    queryClient.prefetchQuery({
      queryKey: ['workflows'],
      queryFn: async () => {
        const response = await fetch('/api/workflows');
        return response.json();
      },
    });

    queryClient.prefetchQuery({
      queryKey: ['agents'],
      queryFn: async () => {
        const response = await fetch('/api/agents');
        return response.json();
      },
    });
  }, [queryClient]);

  return (
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        {children}
        <ReactQueryDevtools initialIsOpen={false} />
      </QueryClientProvider>
    </AuthProvider>
  );
} 
