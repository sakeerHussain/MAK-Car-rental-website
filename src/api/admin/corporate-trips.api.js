import apiClient from '@/api/client';
import { normalizeEntity, normalizeList, triggerBlobDownload } from '@/api/admin/utils';

export async function fetchAdminCorporateTrips() {
  const { data } = await apiClient.get('/admin/api/corporate-trips');
  return normalizeList(data);
}

export async function fetchAdminCorporateTrip(id) {
  const { data } = await apiClient.get(`/admin/api/corporate-trips/${id}`);
  return normalizeEntity(data);
}

export async function saveAdminCorporateTrip(payload) {
  const { data } = await apiClient.post('/admin/api/corporate-trips', payload);
  return normalizeEntity(data);
}

export async function deleteAdminCorporateTrip(id) {
  const { data } = await apiClient.delete(`/admin/api/corporate-trips/${id}`);
  return data;
}

export async function updateAdminCorporateTripStatus(id, status) {
  const { data } = await apiClient.post(`/admin/api/corporate-trips/${id}/status`, { status });
  return normalizeEntity(data);
}

export async function fetchAdminCorporateAccounts() {
  const { data } = await apiClient.get('/admin/api/corporate-trips/accounts');
  return normalizeList(data);
}

export async function saveAdminCorporateAccount(payload) {
  const { data } = await apiClient.post('/admin/api/corporate-trips/accounts', payload);
  return normalizeEntity(data);
}

export async function deleteAdminCorporateAccount(id) {
  const { data } = await apiClient.delete(`/admin/api/corporate-trips/accounts/${id}`);
  return data;
}

export async function fetchAdminCorporateMemberships() {
  const { data } = await apiClient.get('/admin/api/corporate-trips/memberships');
  return normalizeList(data);
}

export async function saveAdminCorporateMembership(payload) {
  const { data } = await apiClient.post('/admin/api/corporate-trips/memberships', payload);
  return normalizeEntity(data);
}

export async function deleteAdminCorporateMembership(id) {
  const { data } = await apiClient.delete(`/admin/api/corporate-trips/memberships/${id}`);
  return data;
}

export async function exportAdminCorporateTripsExcel() {
  const { data } = await apiClient.get('/admin/corporate-trips/export', { responseType: 'blob' });
  triggerBlobDownload(data, 'corporate-trips.xlsx');
}
