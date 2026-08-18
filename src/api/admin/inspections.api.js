import apiClient from '@/api/client';
import { normalizeEntity, normalizeList } from '@/api/admin/utils';

export async function fetchAdminInspections() {
  const { data } = await apiClient.get('/admin/api/inspections');
  return normalizeList(data);
}

export async function fetchAdminInspection(id) {
  const { data } = await apiClient.get(`/admin/api/inspections/${id}`);
  return normalizeEntity(data);
}

export async function saveAdminInspection(payload) {
  const { data } = await apiClient.post('/admin/api/inspections', payload);
  return normalizeEntity(data);
}

export async function deleteAdminInspection(id) {
  const { data } = await apiClient.delete(`/admin/api/inspections/${id}`);
  return data;
}
