import apiClient from '@/api/client';
import { normalizeEntity, normalizeList, triggerBlobDownload } from '@/api/admin/utils';

export async function fetchAdminSettlements() {
  const { data } = await apiClient.get('/admin/api/settlements');
  return normalizeList(data);
}

export async function fetchAdminSettlement(id) {
  const { data } = await apiClient.get(`/admin/api/settlements/${id}`);
  return normalizeEntity(data);
}

export async function generateAdminSettlement(payload) {
  const { data } = await apiClient.post('/admin/api/settlements', payload);
  return normalizeEntity(data);
}

export async function updateAdminSettlementStatus(id, status) {
  const { data } = await apiClient.post(`/admin/api/settlements/${id}/status`, { status });
  return normalizeEntity(data);
}

export async function downloadSettlementPdf(id) {
  const { data } = await apiClient.get(`/admin/settlements/${id}/pdf`, { responseType: 'blob' });
  triggerBlobDownload(data, `settlement-${id}.pdf`);
}

export async function downloadSettlementExcel(id) {
  const { data } = await apiClient.get(`/admin/settlements/${id}/excel`, { responseType: 'blob' });
  triggerBlobDownload(data, `settlement-${id}.xlsx`);
}
