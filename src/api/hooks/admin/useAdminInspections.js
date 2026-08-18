import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteAdminInspection,
  fetchAdminInspection,
  fetchAdminInspections,
  saveAdminInspection,
} from '@/api/admin/inspections.api';

export function useAdminInspections() {
  return useQuery({ queryKey: ['admin', 'inspections'], queryFn: fetchAdminInspections });
}

export function useAdminInspection(id) {
  return useQuery({
    queryKey: ['admin', 'inspections', id],
    queryFn: () => fetchAdminInspection(id),
    enabled: Boolean(id),
  });
}

export function useSaveAdminInspection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveAdminInspection,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'inspections'] }),
  });
}

export function useDeleteAdminInspection() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminInspection,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'inspections'] }),
  });
}
