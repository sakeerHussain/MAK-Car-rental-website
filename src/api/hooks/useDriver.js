import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  changeDriverPassword,
  fetchDriverDashboard,
  fetchDriverProfile,
  fetchDriverTrips,
  updateDriverAvailability,
} from '@/api/driver.api';

export function useDriverDashboard() {
  return useQuery({ queryKey: ['driver', 'dashboard'], queryFn: fetchDriverDashboard });
}

export function useDriverTrips(params = {}) {
  return useQuery({
    queryKey: ['driver', 'trips', params],
    queryFn: () => fetchDriverTrips(params),
  });
}

export function useDriverProfile() {
  return useQuery({ queryKey: ['driver', 'profile'], queryFn: fetchDriverProfile });
}

export function useUpdateDriverAvailability() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateDriverAvailability,
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['driver', 'dashboard'] });
      qc.invalidateQueries({ queryKey: ['driver', 'profile'] });
    },
  });
}

export function useChangeDriverPassword() {
  return useMutation({ mutationFn: changeDriverPassword });
}
