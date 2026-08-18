import apiClient from '@/api/client';

export async function fetchMyBookings() {
  const { data } = await apiClient.get('/api/bookings/mine');
  return data;
}

export async function createBooking(payload) {
  const { data } = await apiClient.post('/api/bookings', payload);
  return data;
}

export async function previewBookingPrice(payload) {
  const { data } = await apiClient.post('/api/bookings/price-preview', payload);
  return data;
}

export async function fetchAvailableDrivers(params) {
  const { data } = await apiClient.get('/api/drivers/available', { params });
  return data;
}

export async function fetchBookingInvoice(bookingId) {
  const { data } = await apiClient.get(`/api/bookings/${bookingId}/invoice`);
  return data;
}

export async function fetchBookingInvoicePdfUrl(bookingId) {
  return `/api/bookings/${bookingId}/invoice/pdf`;
}
