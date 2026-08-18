import { useQuery } from '@tanstack/react-query';
import {
  fetchAdminDashboard,
  fetchTrackingData,
} from '@/api/admin/dashboard.api';

export function useAdminDashboard() {
  return useQuery({
    queryKey: ['admin', 'dashboard'],
    queryFn: fetchAdminDashboard,
  });
}

export function useTrackingData(refetchInterval = 10000) {
  return useQuery({
    queryKey: ['admin', 'tracking'],
    queryFn: fetchTrackingData,
    refetchInterval,
  });
}
