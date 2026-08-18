import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/features/auth/authStore';

export function PublicRoute() {
  return <Outlet />;
}

export function CustomerRoute() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const location = useLocation();

  if (!accessToken || user?.role !== 'CUSTOMER') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function AdminRoute() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const location = useLocation();

  if (!accessToken || !['ADMIN', 'STAFF'].includes(user?.role)) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function AdminPermissionRoute({ permission }) {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasPermission = useAuthStore((s) => s.hasPermission);
  const location = useLocation();

  if (!accessToken || !['ADMIN', 'STAFF'].includes(user?.role)) {
    return <Navigate to="/admin/login" replace state={{ from: location }} />;
  }

  if (permission && !hasPermission(permission)) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
}

export function VendorRoute() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const location = useLocation();

  if (!accessToken || user?.role !== 'VENDOR') {
    return <Navigate to="/vendor/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function DriverRoute() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const location = useLocation();

  if (!accessToken || user?.role !== 'DRIVER') {
    return <Navigate to="/driver/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export function CorporateRoute() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasCorporateAccess = useAuthStore((s) => s.hasCorporateAccess);
  const location = useLocation();

  if (!accessToken || user?.role !== 'CUSTOMER') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasCorporateAccess()) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
}

export function CorporateInvoiceRoute() {
  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const hasCorporateInvoiceAccess = useAuthStore((s) => s.hasCorporateInvoiceAccess);
  const location = useLocation();

  if (!accessToken || user?.role !== 'CUSTOMER') {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!hasCorporateInvoiceAccess()) {
    return <Navigate to="/my-corporate-trips" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
