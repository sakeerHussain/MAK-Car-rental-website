import { useMutation, useQuery } from '@tanstack/react-query';
import {
  downloadVendorSettlementExcel,
  downloadVendorSettlementPdf,
  fetchVendorCars,
  fetchVendorDashboard,
  fetchVendorDrivers,
  fetchVendorSettlements,
  fetchVendorTrips,
} from '@/api/vendor.api';

export function useVendorDashboard() {
  return useQuery({ queryKey: ['vendor', 'dashboard'], queryFn: fetchVendorDashboard });
}

export function useVendorCars() {
  return useQuery({ queryKey: ['vendor', 'cars'], queryFn: fetchVendorCars });
}

export function useVendorDrivers() {
  return useQuery({ queryKey: ['vendor', 'drivers'], queryFn: fetchVendorDrivers });
}

export function useVendorTrips(params = {}) {
  return useQuery({
    queryKey: ['vendor', 'trips', params],
    queryFn: () => fetchVendorTrips(params),
  });
}

export function useVendorSettlements() {
  return useQuery({ queryKey: ['vendor', 'settlements'], queryFn: fetchVendorSettlements });
}

export function useDownloadVendorSettlementPdf() {
  return useMutation({ mutationFn: downloadVendorSettlementPdf });
}

export function useDownloadVendorSettlementExcel() {
  return useMutation({ mutationFn: downloadVendorSettlementExcel });
}
