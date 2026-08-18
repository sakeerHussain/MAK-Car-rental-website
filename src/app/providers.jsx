import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ToastProvider } from '@/shared/components';
import { AuthInitializer } from '@/features/auth/AuthInitializer';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60_000,
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

export function AppProviders({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ToastProvider>
        <AuthInitializer>{children}</AuthInitializer>
      </ToastProvider>
    </QueryClientProvider>
  );
}
