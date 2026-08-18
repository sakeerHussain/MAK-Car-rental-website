import apiClient from '@/api/client';
import { triggerBlobDownload } from '@/api/admin/utils';

export async function fetchVendorDashboard() {
  const { data } = await apiClient.get('/api/vendor/dashboard');
  return data;
}

export async function fetchVendorCars() {
  const { data } = await apiClient.get('/api/vendor/cars');
  return data.cars || data;
}

export async function fetchVendorDrivers() {
  const { data } = await apiClient.get('/api/vendor/drivers');
  return data.drivers || data;
}

export async function fetchVendorTrips(params = {}) {
  const { data } = await apiClient.get('/api/vendor/trips', { params });
  return data.trips || data;
}

export async function fetchVendorSettlements() {
  const { data } = await apiClient.get('/api/vendor/settlements');
  return data.settlements || data;
}

export async function downloadVendorSettlementPdf(id) {
  const { data } = await apiClient.get(`/api/vendor/settlements/${id}/pdf`, { responseType: 'blob' });
  triggerBlobDownload(data, `settlement-${id}.pdf`);
}

export async function downloadVendorSettlementExcel(id) {
  const { data } = await apiClient.get(`/api/vendor/settlements/${id}/excel`, { responseType: 'blob' });
  triggerBlobDownload(data, `settlement-${id}.xlsx`);
}
