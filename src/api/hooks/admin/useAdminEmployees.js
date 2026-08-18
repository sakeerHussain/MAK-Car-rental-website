import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteAdminEmployee,
  fetchAdminEmployee,
  fetchAdminEmployees,
  saveAdminEmployee,
} from '@/api/admin/employees.api';

export function useAdminEmployees() {
  return useQuery({ queryKey: ['admin', 'employees'], queryFn: fetchAdminEmployees });
}

export function useAdminEmployee(id) {
  return useQuery({
    queryKey: ['admin', 'employees', id],
    queryFn: () => fetchAdminEmployee(id),
    enabled: Boolean(id),
  });
}

export function useSaveAdminEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveAdminEmployee,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'employees'] }),
  });
}

export function useDeleteAdminEmployee() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminEmployee,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'employees'] }),
  });
}
