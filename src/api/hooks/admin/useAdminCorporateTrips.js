import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteAdminCorporateAccount,
  deleteAdminCorporateMembership,
  deleteAdminCorporateTrip,
  exportAdminCorporateTripsExcel,
  fetchAdminCorporateAccounts,
  fetchAdminCorporateMemberships,
  fetchAdminCorporateTrip,
  fetchAdminCorporateTrips,
  saveAdminCorporateAccount,
  saveAdminCorporateMembership,
  saveAdminCorporateTrip,
  updateAdminCorporateTripStatus,
} from '@/api/admin/corporate-trips.api';

export function useAdminCorporateTrips() {
  return useQuery({ queryKey: ['admin', 'corporate-trips'], queryFn: fetchAdminCorporateTrips });
}

export function useAdminCorporateTrip(id) {
  return useQuery({
    queryKey: ['admin', 'corporate-trips', id],
    queryFn: () => fetchAdminCorporateTrip(id),
    enabled: Boolean(id),
  });
}

export function useSaveAdminCorporateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveAdminCorporateTrip,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'corporate-trips'] }),
  });
}

export function useDeleteAdminCorporateTrip() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminCorporateTrip,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'corporate-trips'] }),
  });
}

export function useUpdateAdminCorporateTripStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateAdminCorporateTripStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'corporate-trips'] }),
  });
}

export function useAdminCorporateAccounts() {
  return useQuery({ queryKey: ['admin', 'corporate-accounts'], queryFn: fetchAdminCorporateAccounts });
}

export function useSaveAdminCorporateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveAdminCorporateAccount,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'corporate-accounts'] }),
  });
}

export function useDeleteAdminCorporateAccount() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminCorporateAccount,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'corporate-accounts'] }),
  });
}

export function useAdminCorporateMemberships() {
  return useQuery({ queryKey: ['admin', 'corporate-memberships'], queryFn: fetchAdminCorporateMemberships });
}

export function useSaveAdminCorporateMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveAdminCorporateMembership,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'corporate-memberships'] }),
  });
}

export function useDeleteAdminCorporateMembership() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminCorporateMembership,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'corporate-memberships'] }),
  });
}

export function useExportCorporateTripsExcel() {
  return useMutation({ mutationFn: exportAdminCorporateTripsExcel });
}
