import apiClient from '@/api/client';

export async function fetchCars(params = {}) {
  const { data } = await apiClient.get('/api/cars', { params });
  return data;
}

export async function fetchCar(id) {
  const { data } = await apiClient.get(`/api/cars/${id}`);
  return data;
}
