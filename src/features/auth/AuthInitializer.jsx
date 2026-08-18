import { useEffect } from 'react';
import { restoreSession } from '@/api/auth.api';
import { useAuthStore } from '@/features/auth/authStore';
import { Skeleton } from '@/components/ui/skeleton';

export function AuthInitializer({ children }) {
  const isInitialized = useAuthStore((s) => s.isInitialized);

  useEffect(() => {
    restoreSession();
  }, []);

  if (!isInitialized) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-bg">
        <div className="space-y-3 text-center">
          <Skeleton className="mx-auto h-10 w-48" />
          <Skeleton className="mx-auto h-4 w-32" />
        </div>
      </div>
    );
  }

  return children;
}
