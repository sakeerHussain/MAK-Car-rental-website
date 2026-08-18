import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteAdminDriver,
  deleteAdminDriverDocument,
  fetchAdminDriver,
  fetchAdminDrivers,
  saveAdminDriver,
  saveAdminDriverDocument,
  updateAdminDriverStatus,
} from '@/api/admin/drivers.api';

export function useAdminDrivers() {
  return useQuery({ queryKey: ['admin', 'drivers'], queryFn: fetchAdminDrivers });
}

export function useAdminDriver(id) {
  return useQuery({
    queryKey: ['admin', 'drivers', id],
    queryFn: () => fetchAdminDriver(id),
    enabled: Boolean(id),
  });
}

export function useSaveAdminDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveAdminDriver,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'drivers'] }),
  });
}

export function useDeleteAdminDriver() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminDriver,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'drivers'] }),
  });
}

export function useUpdateAdminDriverStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateAdminDriverStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'drivers'] }),
  });
}

export function useSaveAdminDriverDocument(driverId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => saveAdminDriverDocument(driverId, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'drivers', driverId] }),
  });
}

export function useDeleteAdminDriverDocument(driverId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (docId) => deleteAdminDriverDocument(driverId, docId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'drivers', driverId] }),
  });
}
