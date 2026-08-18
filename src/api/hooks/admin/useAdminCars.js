import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
  deleteAdminCar,
  deleteAdminCarDocument,
  deleteAdminCarPhoto,
  fetchAdminCar,
  fetchAdminCarMedia,
  fetchAdminCars,
  saveAdminCar,
  saveAdminCarDocument,
  saveAdminCarPhoto,
} from '@/api/admin/cars.api';

export function useAdminCars() {
  return useQuery({ queryKey: ['admin', 'cars'], queryFn: fetchAdminCars });
}

export function useAdminCar(id) {
  return useQuery({
    queryKey: ['admin', 'cars', id],
    queryFn: () => fetchAdminCar(id),
    enabled: Boolean(id),
  });
}

export function useAdminCarMedia(id) {
  return useQuery({
    queryKey: ['admin', 'cars', id, 'media'],
    queryFn: () => fetchAdminCarMedia(id),
    enabled: Boolean(id),
  });
}

export function useSaveAdminCar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: saveAdminCar,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'cars'] }),
  });
}

export function useDeleteAdminCar() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: deleteAdminCar,
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'cars'] }),
  });
}

export function useSaveAdminCarDocument(carId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => saveAdminCarDocument(carId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'cars', carId] });
      qc.invalidateQueries({ queryKey: ['admin', 'cars', carId, 'media'] });
    },
  });
}

export function useDeleteAdminCarDocument(carId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (docId) => deleteAdminCarDocument(carId, docId),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['admin', 'cars', carId] }),
  });
}

export function useSaveAdminCarPhoto(carId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload) => saveAdminCarPhoto(carId, payload),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'cars', carId] });
      qc.invalidateQueries({ queryKey: ['admin', 'cars', carId, 'media'] });
    },
  });
}

export function useDeleteAdminCarPhoto(carId) {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (photoId) => deleteAdminCarPhoto(carId, photoId),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['admin', 'cars', carId] });
      qc.invalidateQueries({ queryKey: ['admin', 'cars', carId, 'media'] });
    },
  });
}
