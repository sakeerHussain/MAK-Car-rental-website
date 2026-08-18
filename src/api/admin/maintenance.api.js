import apiClient from '@/api/client';
import { normalizeEntity, normalizeList } from '@/api/admin/utils';

export async function fetchAdminMaintenance() {
  const { data } = await apiClient.get('/admin/api/maintenance');
  return normalizeList(data);
}

export async function fetchAdminMaintenanceRecord(id) {
  const { data } = await apiClient.get(`/admin/api/maintenance/${id}`);
  return normalizeEntity(data);
}

export async function saveAdminMaintenance(payload) {
  const { data } = await apiClient.post('/admin/api/maintenance', payload);
  return normalizeEntity(data);
}

export async function deleteAdminMaintenance(id) {
  const { data } = await apiClient.delete(`/admin/api/maintenance/${id}`);
  return data;
}
