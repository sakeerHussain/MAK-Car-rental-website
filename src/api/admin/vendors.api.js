import apiClient from '@/api/client';
import { normalizeEntity, normalizeList } from '@/api/admin/utils';

export async function fetchAdminVendors() {
  const { data } = await apiClient.get('/admin/api/vendors');
  return normalizeList(data);
}

export async function fetchAdminVendor(id) {
  const { data } = await apiClient.get(`/admin/api/vendors/${id}`);
  return normalizeEntity(data);
}

export async function saveAdminVendor(payload) {
  const { data } = await apiClient.post('/admin/api/vendors', payload);
  return normalizeEntity(data);
}

export async function deleteAdminVendor(id) {
  const { data } = await apiClient.delete(`/admin/api/vendors/${id}`);
  return data;
}
