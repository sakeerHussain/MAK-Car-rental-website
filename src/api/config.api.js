import apiClient from '@/api/client';

export async function fetchConfig() {
  const { data } = await apiClient.get('/api/config');
  return data;
}
