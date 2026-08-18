import { useAuthStore } from '@/features/auth/authStore';

/**
 * @param {{
 *   permission?: string,
 *   role?: string,
 *   roles?: string[],
 *   children: React.ReactNode,
 *   fallback?: React.ReactNode,
 * }} props
 */
export function PermissionGate({
  permission,
  role,
  roles,
  children,
  fallback = null,
}) {
  const user = useAuthStore((s) => s.user);
  const hasPermission = useAuthStore((s) => s.hasPermission);

  if (!user) return fallback;

  if (role && user.role !== role) return fallback;
  if (roles && !roles.includes(user.role)) return fallback;
  if (permission && !hasPermission(permission)) return fallback;

  return children;
}
