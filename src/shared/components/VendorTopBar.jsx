import { NavLink } from 'react-router-dom';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuthStore } from '@/features/auth/authStore';
import { cn } from '@/lib/utils';
import { logout } from '@/api/auth.api';

const navLinks = [
  { to: '/vendor', label: 'Dashboard', end: true },
  { to: '/vendor/cars', label: 'Cars' },
  { to: '/vendor/drivers', label: 'Drivers' },
  { to: '/vendor/trips', label: 'Trips' },
  { to: '/vendor/settlements', label: 'Settlements' },
];

export function VendorTopBar() {
  const user = useAuthStore((s) => s.user);

  return (
    <header className="border-b border-border-brand bg-surface">
      <div className="flex h-16 items-center justify-between gap-4 px-4 sm:px-6">
        <div>
          <p className="text-xs text-text-muted">Vendor Portal</p>
          <p className="text-sm font-semibold">{user?.name || 'Vendor Dashboard'}</p>
        </div>
        <nav className="hidden items-center gap-1 md:flex" aria-label="Vendor navigation">
          {navLinks.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              end={link.end}
              className={({ isActive }) =>
                cn(
                  'rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                  isActive ? 'bg-primary-light text-primary-deep' : 'text-text-secondary hover:bg-primary-pale',
                )
              }
            >
              {link.label}
            </NavLink>
          ))}
        </nav>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={async () => {
            await logout();
            window.location.href = '/vendor/login';
          }}
        >
          <LogOut className="size-4" />
          Sign Out
        </Button>
      </div>
    </header>
  );
}
