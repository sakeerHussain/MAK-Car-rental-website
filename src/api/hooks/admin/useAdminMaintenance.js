import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteAdminMaintenance,
  fetchAdminMaintenance,
  fetchAdminMaintenanceRecord,
  saveAdminMaintenance,
} from '@/api/admin/maintenance.api';

export function useAdminMaintenance() {
  return useQuery({ queryKey: ['admin', 'maintenance'], queryFn: fetchAdminMaintenance });
}

export function useAdminMaintenanceRecord(id) {
  return useQuery({
    queryKey: ['admin', 'maintenance', id],
    queryFn: () => fetchAdminMaintenanceRecord(id),
    enabled: Boolean(id),
  });
}

export function useSaveAdminMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveAdminMaintenance,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'maintenance'] }),
  });
}

export function useDeleteAdminMaintenance() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminMaintenance,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'maintenance'] }),
  });
}
