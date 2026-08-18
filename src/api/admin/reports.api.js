import apiClient from '@/api/client';
import { triggerBlobDownload } from '@/api/admin/utils';

/** @param {Record<string, string>} params @param {string} format */
export async function downloadAdminReport(params, format = 'excel') {
  const { data } = await apiClient.get(`/admin/reports/${format}`, {
    params,
    responseType: 'blob',
  });
  const ext = format === 'pdf' ? 'pdf' : 'xlsx';
  triggerBlobDownload(data, `report-${Date.now()}.${ext}`);
}

export async function downloadVendorReport(params, format = 'excel') {
  const { data } = await apiClient.get(`/admin/reports/vendors/${format}`, {
    params,
    responseType: 'blob',
  });
  const ext = format === 'pdf' ? 'pdf' : 'xlsx';
  triggerBlobDownload(data, `vendor-report-${Date.now()}.${ext}`);
}

export async function downloadDriverReport(params, format = 'excel') {
  const { data } = await apiClient.get(`/admin/reports/drivers/${format}`, {
    params,
    responseType: 'blob',
  });
  const ext = format === 'pdf' ? 'pdf' : 'xlsx';
  triggerBlobDownload(data, `driver-report-${Date.now()}.${ext}`);
}
