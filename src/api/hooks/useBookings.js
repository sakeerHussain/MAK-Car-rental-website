import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  createBooking,
  fetchAvailableDrivers,
  fetchBookingInvoice,
  fetchMyBookings,
  previewBookingPrice,
} from '@/api/bookings.api';

export function useMyBookings() {
  return useQuery({
    queryKey: ['bookings', 'mine'],
    queryFn: fetchMyBookings,
  });
}

export function useBookingInvoice(bookingId) {
  return useQuery({
    queryKey: ['bookings', bookingId, 'invoice'],
    queryFn: () => fetchBookingInvoice(bookingId),
    enabled: Boolean(bookingId),
  });
}

export function usePricePreview(payload, enabled = true) {
  return useQuery({
    queryKey: ['bookings', 'price-preview', payload],
    queryFn: () => previewBookingPrice(payload),
    enabled: enabled && Boolean(payload?.carId && payload?.pickupDate && payload?.returnDate),
  });
}

export function useAvailableDrivers(params, enabled = true) {
  return useQuery({
    queryKey: ['drivers', 'available', params],
    queryFn: () => fetchAvailableDrivers(params),
    enabled: enabled && Boolean(params?.pickup && params?.return),
  });
}

export function useCreateBooking() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createBooking,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['bookings', 'mine'] });
    },
  });
}
