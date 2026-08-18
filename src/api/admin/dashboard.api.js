import apiClient from '@/api/client';
import { normalizeEntity, normalizeList } from '@/api/admin/utils';

export async function fetchAdminDashboard() {
  const { data } = await apiClient.get('/admin/api/dashboard');
  return normalizeEntity(data);
}

export async function fetchAdminVendors() {
  const { data } = await apiClient.get('/admin/api/vendors');
  return normalizeList(data);
}

export async function fetchTrackingData() {
  const { data } = await apiClient.get('/admin/tracking/data');
  return normalizeList(data);
}
