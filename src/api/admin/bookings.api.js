import apiClient from '@/api/client';
import { normalizeEntity, normalizeList } from '@/api/admin/utils';

export async function fetchAdminBookings(params = {}) {
  const { data } = await apiClient.get('/admin/api/bookings', { params });
  return normalizeList(data);
}

export async function createAdminBooking(payload) {
  const { data } = await apiClient.post('/admin/api/bookings', payload);
  return normalizeEntity(data);
}

export async function updateAdminBookingStatus(id, status) {
  const { data } = await apiClient.post(`/admin/api/bookings/${id}/status`, { status });
  return normalizeEntity(data);
}

export async function fetchAdminBookingPayments(id) {
  const { data } = await apiClient.get(`/admin/api/bookings/${id}/payments`);
  return normalizeList(data);
}

export async function saveAdminBookingPayment(bookingId, payload) {
  const { data } = await apiClient.post(`/admin/api/bookings/${bookingId}/payments`, payload);
  return normalizeEntity(data);
}

export async function deleteAdminBookingPayment(bookingId, paymentId) {
  const { data } = await apiClient.delete(`/admin/api/bookings/${bookingId}/payments/${paymentId}`);
  return data;
}
