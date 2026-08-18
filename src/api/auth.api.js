import apiClient from '@/api/client';
import { useAuthStore } from '@/features/auth/authStore';

const TOKEN_KEY = 'mak_access_token';

export function persistToken(token) {
  if (token) {
    sessionStorage.setItem(TOKEN_KEY, token);
  } else {
    sessionStorage.removeItem(TOKEN_KEY);
  }
}

export function getPersistedToken() {
  return sessionStorage.getItem(TOKEN_KEY);
}

export async function login(payload) {
  const { data } = await apiClient.post('/api/auth/login', payload);
  useAuthStore.getState().setSession(data.user, data.accessToken);
  persistToken(data.accessToken);
  return data;
}

export async function register(payload) {
  const { data } = await apiClient.post('/api/auth/register', payload);
  useAuthStore.getState().setSession(data.user, data.accessToken);
  persistToken(data.accessToken);
  return data;
}

export async function logout() {
  try {
    await apiClient.post('/api/auth/logout');
  } finally {
    useAuthStore.getState().clearSession();
    persistToken(null);
  }
}

export async function fetchMe() {
  const { data } = await apiClient.get('/api/auth/me');
  useAuthStore.getState().setSession(data.user, data.accessToken);
  persistToken(data.accessToken);
  return data;
}

export async function restoreSession() {
  const token = getPersistedToken();
  if (!token) {
    useAuthStore.getState().markInitialized();
    return null;
  }
  useAuthStore.getState().setSession(null, token);
  try {
    return await fetchMe();
  } catch {
    useAuthStore.getState().clearSession();
    persistToken(null);
    return null;
  } finally {
    useAuthStore.getState().markInitialized();
  }
}
