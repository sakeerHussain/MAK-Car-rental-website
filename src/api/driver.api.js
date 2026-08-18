import apiClient from '@/api/client';

export async function fetchDriverDashboard() {
  const { data } = await apiClient.get('/api/driver/dashboard');
  return data;
}

export async function fetchDriverTrips(params = {}) {
  const { data } = await apiClient.get('/api/driver/trips', { params });
  return data.trips || data;
}

export async function fetchDriverProfile() {
  const { data } = await apiClient.get('/api/driver/profile');
  return data;
}

export async function updateDriverAvailability(status) {
  const { data } = await apiClient.post('/api/driver/availability', { status });
  return data;
}

export async function changeDriverPassword(payload) {
  const { data } = await apiClient.post('/api/driver/password', payload);
  return data;
}
