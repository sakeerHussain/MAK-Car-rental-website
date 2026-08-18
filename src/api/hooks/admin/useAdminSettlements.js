import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  downloadSettlementExcel,
  downloadSettlementPdf,
  fetchAdminSettlement,
  fetchAdminSettlements,
  generateAdminSettlement,
  updateAdminSettlementStatus,
} from '@/api/admin/settlements.api';

export function useAdminSettlements() {
  return useQuery({ queryKey: ['admin', 'settlements'], queryFn: fetchAdminSettlements });
}

export function useAdminSettlement(id) {
  return useQuery({
    queryKey: ['admin', 'settlements', id],
    queryFn: () => fetchAdminSettlement(id),
    enabled: Boolean(id),
  });
}

export function useGenerateAdminSettlement() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: generateAdminSettlement,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'settlements'] }),
  });
}

export function useUpdateAdminSettlementStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateAdminSettlementStatus(id, status),
    onSuccess: (_, { id }) => {
      qc.invalidateQueries({ queryKey: ['admin', 'settlements'] });
      qc.invalidateQueries({ queryKey: ['admin', 'settlements', id] });
    },
  });
}

export function useDownloadSettlementPdf() {
  return useMutation({ mutationFn: downloadSettlementPdf });
}

export function useDownloadSettlementExcel() {
  return useMutation({ mutationFn: downloadSettlementExcel });
}
