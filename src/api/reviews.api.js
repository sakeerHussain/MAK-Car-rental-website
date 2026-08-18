import apiClient from '@/api/client';

export async function fetchCarReviews(carId) {
  const { data } = await apiClient.get(`/api/cars/${carId}/reviews`);
  return data;
}

export async function submitReview(payload) {
  const { data } = await apiClient.post('/api/reviews', payload);
  return data;
}
