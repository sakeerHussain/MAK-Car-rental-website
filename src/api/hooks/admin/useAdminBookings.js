import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createAdminBooking,
  deleteAdminBookingPayment,
  fetchAdminBookingPayments,
  fetchAdminBookings,
  saveAdminBookingPayment,
  updateAdminBookingStatus,
} from '@/api/admin/bookings.api';

export function useAdminBookings(params = {}) {
  return useQuery({
    queryKey: ['admin', 'bookings', params],
    queryFn: () => fetchAdminBookings(params),
  });
}

export function useAdminBookingPayments(bookingId) {
  return useQuery({
    queryKey: ['admin', 'bookings', bookingId, 'payments'],
    queryFn: () => fetchAdminBookingPayments(bookingId),
    enabled: Boolean(bookingId),
  });
}

export function useCreateAdminBooking() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: createAdminBooking,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'bookings'] }),
  });
}

export function useUpdateAdminBookingStatus() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, status }) => updateAdminBookingStatus(id, status),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'bookings'] }),
  });
}

export function useSaveAdminBookingPayment(bookingId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => saveAdminBookingPayment(bookingId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      qc.invalidateQueries({ queryKey: ['admin', 'bookings', bookingId, 'payments'] });
    },
  });
}

export function useDeleteAdminBookingPayment(bookingId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (paymentId) => deleteAdminBookingPayment(bookingId, paymentId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'bookings'] });
      qc.invalidateQueries({ queryKey: ['admin', 'bookings', bookingId, 'payments'] });
    },
  });
}
