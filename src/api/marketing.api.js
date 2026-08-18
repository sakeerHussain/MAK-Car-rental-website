import apiClient from '@/api/client';

export async function submitContactForm(payload) {
  const { data } = await apiClient.post('/api/contact', payload);
  return data;
}

export async function fetchMarketingDoc(slug) {
  const { data } = await apiClient.get(`/api/docs/${slug}`);
  return data;
}

export async function fetchMarketingDocPdf(slug) {
  const { data } = await apiClient.get(`/api/docs/${slug}/pdf`, { responseType: 'blob' });
  return data;
}
