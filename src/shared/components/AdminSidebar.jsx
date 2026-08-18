import { Link, useLocation } from 'react-router-dom';
import {
  BarChart3,
  Building2,
  Car,
  ClipboardList,
  FileText,
  LayoutDashboard,
  MapPin,
  Settings,
  Shield,
  Star,
  Truck,
  UserCog,
  Users,
  Wrench,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuthStore } from '@/features/auth/authStore';

const navGroups = [
  {
    label: 'Fleet',
    items: [
      { to: '/admin', label: 'Dashboard', icon: LayoutDashboard },
      { to: '/admin/cars', label: 'Cars', icon: Car, permission: 'MANAGE_FLEET' },
      { to: '/admin/drivers', label: 'Drivers', icon: Users, permission: 'MANAGE_DRIVERS' },
      { to: '/admin/employees', label: 'Employees', icon: UserCog, permission: 'MANAGE_FLEET' },
      { to: '/admin/vendors', label: 'Vendors', icon: Building2, permission: 'MANAGE_VENDORS' },
      { to: '/admin/maintenance', label: 'Maintenance', icon: Wrench, permission: 'MANAGE_FLEET' },
      { to: '/admin/inspections', label: 'Inspections', icon: ClipboardList, permission: 'MANAGE_FLEET' },
      { to: '/admin/tracking', label: 'Live Tracking', icon: MapPin, permission: 'MANAGE_FLEET' },
    ],
  },
  {
    label: 'Bookings',
    items: [
      { to: '/admin/bookings', label: 'Bookings', icon: FileText, permission: 'MANAGE_BOOKINGS' },
      {
        to: '/admin/corporate-trips',
        label: 'Corporate Trips',
        icon: Truck,
        permission: 'MANAGE_BOOKINGS',
      },
    ],
  },
  {
    label: 'Insights',
    items: [
      { to: '/admin/settlements', label: 'Billing / Settlements', icon: BarChart3, permission: 'MANAGE_BILLING' },
      { to: '/admin/reports', label: 'Reports', icon: BarChart3, permission: 'VIEW_REPORTS' },
      { to: '/admin/reviews', label: 'Reviews', icon: Star, permission: 'MANAGE_BOOKINGS' },
    ],
  },
  {
    label: 'Administration',
    items: [
      { to: '/admin/users', label: 'Staff & Users', icon: Users, permission: 'MANAGE_USERS' },
      { to: '/admin/audit', label: 'Audit Log', icon: Shield, permission: 'MANAGE_USERS' },
      { to: '/admin/settings', label: 'Settings', icon: Settings, permission: 'MANAGE_CONFIG' },
    ],
  },
];

export function AdminSidebar({ collapsed = false }) {
  const location = useLocation();
  const hasPermission = useAuthStore((s) => s.hasPermission);

  return (
    <aside
      className={cn(
        'flex h-full flex-col border-e border-white/10 bg-primary-deep text-white transition-all',
        collapsed ? 'w-16' : 'w-64',
      )}
    >
      <div className="flex h-16 items-center gap-2 border-b border-white/10 px-4">
        <span className="flex size-9 items-center justify-center rounded-xl bg-white/10">
          <Car className="size-5" />
        </span>
        {!collapsed ? <span className="font-bold">MAK Admin</span> : null}
      </div>

      <nav className="flex-1 overflow-y-auto p-3" aria-label="Admin navigation">
        {navGroups.map((group) => {
          const visibleItems = group.items.filter(
            (item) => !item.permission || hasPermission(item.permission),
          );
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.label} className="mb-4">
              {!collapsed ? (
                <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-wide text-white/50">
                  {group.label}
                </p>
              ) : null}
              <ul className="space-y-1">
                {visibleItems.map((item) => {
                  const Icon = item.icon;
                  const isActive =
                    item.to === '/admin'
                      ? location.pathname === '/admin'
                      : location.pathname.startsWith(item.to);

                  return (
                    <li key={item.to}>
                      <Link
                        to={item.to}
                        title={collapsed ? item.label : undefined}
                        className={cn(
                          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                          isActive
                            ? 'bg-white/15 text-white'
                            : 'text-white/75 hover:bg-white/10 hover:text-white',
                        )}
                      >
                        <Icon className="size-4 shrink-0" />
                        {!collapsed ? <span>{item.label}</span> : null}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          );
        })}
      </nav>
    </aside>
  );
}
