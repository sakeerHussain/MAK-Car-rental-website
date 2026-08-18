import apiClient from '@/api/client';

export async function fetchHomeData() {
  const { data } = await apiClient.get('/api/home');
  return data;
}
