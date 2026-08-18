import { Link } from 'react-router-dom';
import { LogOut, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/authStore';

export function DriverTopBar() {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-brand bg-surface px-4 sm:px-6">
      <div>
        <p className="text-xs text-text-muted">Driver Portal</p>
        <p className="text-sm font-semibold">{user?.name || 'Driver Dashboard'}</p>
      </div>
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="sm" asChild>
          <Link to="/driver/profile">
            <User className="size-4" />
            Profile
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            clearSession();
            window.location.href = '/driver/login';
          }}
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}
