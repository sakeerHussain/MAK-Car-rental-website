import { useMutation } from '@tanstack/react-query';
import {
  downloadAdminReport,
  downloadDriverReport,
  downloadVendorReport,
} from '@/api/admin/reports.api';

export function useDownloadAdminReport() {
  return useMutation({
    mutationFn: ({ params, format }) => downloadAdminReport(params, format),
  });
}

export function useDownloadVendorReport() {
  return useMutation({
    mutationFn: ({ params, format }) => downloadVendorReport(params, format),
  });
}

export function useDownloadDriverReport() {
  return useMutation({
    mutationFn: ({ params, format }) => downloadDriverReport(params, format),
  });
}
