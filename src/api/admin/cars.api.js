import apiClient from '@/api/client';
import { normalizeEntity, normalizeList } from '@/api/admin/utils';

export async function fetchAdminCars() {
  const { data } = await apiClient.get('/admin/api/cars');
  return normalizeList(data);
}

export async function fetchAdminCar(id) {
  const { data } = await apiClient.get(`/admin/api/cars/${id}`);
  return normalizeEntity(data);
}

export async function saveAdminCar(payload) {
  const { data } = await apiClient.post('/admin/api/cars', payload);
  return normalizeEntity(data);
}

export async function deleteAdminCar(id) {
  const { data } = await apiClient.post(`/admin/api/cars/${id}/delete`);
  return data;
}

export async function fetchAdminCarMedia(id) {
  const { data } = await apiClient.get(`/admin/api/cars/${id}/media`);
  return normalizeList(data);
}

export async function saveAdminCarDocument(carId, payload) {
  const { data } = await apiClient.post(`/admin/api/cars/${carId}/documents`, payload);
  return normalizeEntity(data);
}

export async function deleteAdminCarDocument(carId, docId) {
  const { data } = await apiClient.delete(`/admin/api/cars/${carId}/documents/${docId}`);
  return data;
}

export async function saveAdminCarPhoto(carId, payload) {
  const { data } = await apiClient.post(`/admin/api/cars/${carId}/photos`, payload);
  return normalizeEntity(data);
}

export async function deleteAdminCarPhoto(carId, photoId) {
  const { data } = await apiClient.delete(`/admin/api/cars/${carId}/photos/${photoId}`);
  return data;
}
