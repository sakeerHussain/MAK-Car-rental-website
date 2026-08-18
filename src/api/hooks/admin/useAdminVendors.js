import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteAdminVendor,
  fetchAdminVendor,
  fetchAdminVendors,
  saveAdminVendor,
} from '@/api/admin/vendors.api';

export function useAdminVendors() {
  return useQuery({ queryKey: ['admin', 'vendors'], queryFn: fetchAdminVendors });
}

export function useAdminVendor(id) {
  return useQuery({
    queryKey: ['admin', 'vendors', id],
    queryFn: () => fetchAdminVendor(id),
    enabled: Boolean(id),
  });
}

export function useSaveAdminVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveAdminVendor,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'vendors'] }),
  });
}

export function useDeleteAdminVendor() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminVendor,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'vendors'] }),
  });
}
