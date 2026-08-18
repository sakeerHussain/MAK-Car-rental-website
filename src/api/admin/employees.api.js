import apiClient from '@/api/client';
import { normalizeEntity, normalizeList } from '@/api/admin/utils';

export async function fetchAdminEmployees() {
  const { data } = await apiClient.get('/admin/api/employees');
  return normalizeList(data);
}

export async function fetchAdminEmployee(id) {
  const { data } = await apiClient.get(`/admin/api/employees/${id}`);
  return normalizeEntity(data);
}

export async function saveAdminEmployee(payload) {
  const { data } = await apiClient.post('/admin/api/employees', payload);
  return normalizeEntity(data);
}

export async function deleteAdminEmployee(id) {
  const { data } = await apiClient.delete(`/admin/api/employees/${id}`);
  return data;
}
