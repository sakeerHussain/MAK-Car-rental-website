import apiClient from '@/api/client';
import { normalizeEntity, normalizeList } from '@/api/admin/utils';

export async function fetchAdminReviews() {
  const { data } = await apiClient.get('/admin/api/reviews');
  return normalizeList(data);
}

export async function approveAdminReview(id) {
  const { data } = await apiClient.post(`/admin/api/reviews/${id}/approve`);
  return normalizeEntity(data);
}

export async function deleteAdminReview(id) {
  const { data } = await apiClient.delete(`/admin/api/reviews/${id}`);
  return data;
}
