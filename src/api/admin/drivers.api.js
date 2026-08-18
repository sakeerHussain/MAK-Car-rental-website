import apiClient from '@/api/client';
import { normalizeEntity, normalizeList } from '@/api/admin/utils';

export async function fetchAdminDrivers() {
  const { data } = await apiClient.get('/admin/api/drivers');
  return normalizeList(data);
}

export async function fetchAdminDriver(id) {
  const { data } = await apiClient.get(`/admin/api/drivers/${id}`);
  return normalizeEntity(data);
}

export async function saveAdminDriver(payload) {
  const { data } = await apiClient.post('/admin/api/drivers', payload);
  return normalizeEntity(data);
}

export async function deleteAdminDriver(id) {
  const { data } = await apiClient.delete(`/admin/api/drivers/${id}`);
  return data;
}

export async function updateAdminDriverStatus(id, status) {
  const { data } = await apiClient.post(`/admin/api/drivers/${id}/status`, { status });
  return normalizeEntity(data);
}

export async function saveAdminDriverDocument(driverId, payload) {
  const { data } = await apiClient.post(`/admin/api/drivers/${driverId}/documents`, payload);
  return normalizeEntity(data);
}

export async function deleteAdminDriverDocument(driverId, docId) {
  const { data } = await apiClient.delete(`/admin/api/drivers/${driverId}/documents/${docId}`);
  return data;
}
