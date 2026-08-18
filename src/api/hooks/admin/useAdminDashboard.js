import { useQuery } from '@tanstack/react-query';
import {
  fetchAdminDashboard,
  fetchAdminVendors,
  fetchTrackingData,
} from '@/api/admin/dashboard.api';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: fetchAdminDashboard,
  });
}

export function useAdminVendors() {
  return useQuery({
    queryKey: ['admin', 'vendors'],
    queryFn: fetchAdminVendors,
  });
}

export function useTrackingData(refetchInterval = 10000) {
  return useQuery({
    queryKey: ['admin', 'tracking'],
    queryFn: fetchTrackingData,
    refetchInterval,
  });
}
