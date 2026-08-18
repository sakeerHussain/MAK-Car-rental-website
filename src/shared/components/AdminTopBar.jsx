import { Link } from 'react-router-dom';
import { Bell, LogOut, Menu, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/authStore';

export function AdminTopBar({ onMenuToggle }) {
  const user = useAuthStore((s) => s.user);
  const clearSession = useAuthStore((s) => s.clearSession);

  return (
    <header className="flex h-16 items-center justify-between border-b border-border-brand bg-surface px-4 sm:px-6">
      <div className="flex items-center gap-3">
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuToggle}
          aria-label="Toggle sidebar"
        >
          <Menu className="size-5" />
        </Button>
        <div>
          <p className="text-xs text-text-muted">Staff Portal</p>
          <p className="text-sm font-semibold text-text-primary">Operations Console</p>
        </div>
      </div>

      <div className="flex items-center gap-2">
        <Button type="button" variant="ghost" size="icon" aria-label="Notifications">
          <Bell className="size-5" />
        </Button>
        <Button variant="ghost" size="sm" asChild>
          <Link to="/admin/profile">
            <User className="size-4" />
            <span className="hidden sm:inline">{user?.name || 'Profile'}</span>
          </Link>
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => {
            clearSession();
            window.location.href = '/admin/login';
          }}
        >
          <LogOut className="size-4" />
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  );
}
